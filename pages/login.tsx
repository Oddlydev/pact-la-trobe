import { useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import InputField from "@/src/components/Forms/InputFields";
import FormButton from "@/src/components/Buttons/FormButtons";

type LoginResponse = {
  user: {
    id: number;
    login: string;
    email: string;
    displayName: string;
  };
};

const buildForgotPasswordUrl = (loginUrl: string | undefined) => {
  if (!loginUrl) return "#";
  const separator = loginUrl.includes("?") ? "&" : "?";
  return `${loginUrl}${separator}action=lostpassword`;
};

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const wordpressLoginUrl = useMemo(() => {
    const explicit = process.env.NEXT_PUBLIC_WORDPRESS_LOGIN_URL;
    if (explicit && explicit.length > 0) {
      return explicit;
    }
    const graphql = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    if (!graphql) return undefined;
    return graphql.replace(/\/graphql\/?$/, "/wp-login.php");
  }, []);

  const forgotPasswordUrl = useMemo(
    () => buildForgotPasswordUrl(wordpressLoginUrl),
    [wordpressLoginUrl]
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!identifier.trim() || !password) {
      setError("Please provide both email/username and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as
        | LoginResponse
        | { message?: string };

      if (!response.ok) {
        const message =
          "message" in data && data.message ? data.message : undefined;
        throw new Error(message ?? "Unable to sign in with those credentials.");
      }

      const displayName = "user" in data ? data.user.displayName : "";
      const greeting = displayName
        ? `Welcome back, ${displayName}!`
        : "Welcome back!";
      setSuccess(greeting);

      await router.replace("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | PACT La Trobe</title>
      </Head>
      <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/assets/images/logo.svg"
            alt="PACT La Trobe"
            className="mx-auto w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <InputField
              label="Email address"
              name="identifier"
              type="text"
              placeholder=""
              autoComplete="username"
              required
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              disabled={loading}
            />

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 font-dmsans"
                >
                  Password
                </label>
                <a
                  href={forgotPasswordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium leading-5 tracking-normal text-[var(--color-accent)]"
                >
                  Forgot password?
                </a>
              </div>
              <InputField
                id="password"
                name="password"
                type="password"
                placeholder=""
                required
                autoComplete="current-password"
                label=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-dmsans" role="alert">
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-green-600 font-dmsans" role="status">
                {success}
              </p>
            )}

            <FormButton
              variant="dark"
              label={loading ? "Signing in..." : "Sign in"}
              className="w-full"
              type="submit"
              disabled={loading}
            />
          </form>
        </div>
      </main>
    </>
  );
}


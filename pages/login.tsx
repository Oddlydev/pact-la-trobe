import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type User = {
  ID: number;
  user_login: string;
  user_nicename: string;
  user_email: string;
  user_url: string;
};

export default function LoginPage() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  // User list display
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  // Load WordPress users (for table)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    }
    fetchUsers();
  }, []);

  // Handle Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccess(null);
    setLoadingLogin(true);

    try {
      // inside handleLogin()
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid login");
      setLoginSuccess("Signed in successfully. Redirecting…");
      setTimeout(() => router.push("/"), 1000);
      return;

      // ✅ Successful login → redirect
      router.push("/");
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoadingLogin(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login – Test</title>
      </Head>

      <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
          <img
            src="/assets/images/logo.svg"
            alt="Your Company"
            className="mx-auto w-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-zinc-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            {/* Password Field with Forgot Password */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 font-dmsans"
              >
                Password
              </label>
              <a
                href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-login.php?action=lostpassword`}
                className="text-sm font-medium leading-5 tracking-normal text-[var(--color-accent)]"
              >
                Forgot password?
              </a>
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {/* 🧠 Show validation or login error */}
            {loginError && (
              <p className="text-red-600 text-sm text-center">{loginError}</p>
            )}
            {loginSuccess && (
              <p className="text-green-600 text-sm text-center">
                {loginSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className={`w-full flex justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 ${
                loadingLogin ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingLogin ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

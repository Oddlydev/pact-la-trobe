import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InputField from "src/components/Forms/InputFields";

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
  const [showPassword, setShowPassword] = useState(false);
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
      const cleanMessage = (msg: string) =>
        (msg || "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      // inside handleLogin()
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = cleanMessage(data?.error || "Invalid login");
        const friendly = /incorrect|invalid|unknown/i.test(msg)
          ? "Incorrect email or password. Please try again."
          : msg || "Login failed. Please try again.";
        throw new Error(friendly);
      }
      setLoginSuccess("Signed in successfully. Redirecting…");
      setTimeout(() => router.push("/"), 1000);
      return;

      //Successful login → redirect
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

        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin}>
            <InputField
              type="email"
              name="email"
              id="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <div>
              {/* Password Field with Forgot Password */}
              <div className="flex items-center justify-between mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 leading-5 font-dmsans"
                >
                  Password
                </label>
                <a
                  href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-login.php?action=lostpassword`}
                  className="text-sm font-medium leading-5 tracking-normal text-[var(--color-accent)]"
                >
                  Forgot your password?
                </a>
              </div>

              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={[
                    "block w-full rounded-md bg-white px-3 py-2",
                    "text-base placeholder:text-gray-500 placeholder:text-sm placeholder:font-normal",
                    "border ring-0 focus:ring-0 focus:outline-none shadow-sm",
                    "font-dmsans text-gray-900",
                    "border-gray-300 focus:border-[var(--blue-500,#3B82F6)]",
                    "sm:text-sm sm:leading-6",
                    "autofill:shadow-[inset_0_0_0_1000px_white]",
                    "pr-10", // space for the toggle icon
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-800 hover:text-gray-900"
                >
                  {showPassword ? (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M2.99172 2.05812L6.12996 5.17146C6.13584 5.17729 6.14172 5.18312 6.1476 5.18896L14.9542 13.9265C14.96 13.9315 14.9659 13.9373 14.9718 13.9431L18.1117 17.0581C18.357 17.3023 18.357 17.6973 18.1117 17.9415C17.8656 18.1856 17.4666 18.1856 17.2205 17.9415L14.4308 15.1748C13.1994 15.9173 11.7403 16.4581 10.1057 16.4581C7.94688 16.4581 6.09552 15.5156 4.66332 14.4056C3.2286 13.2948 2.16936 11.9831 1.57632 11.159L1.53096 11.0965C1.31844 10.8031 1.07568 10.4681 1.07568 9.99979C1.07568 9.53146 1.31844 9.19646 1.53096 8.90312L1.57632 8.84062C2.17524 8.00729 3.25716 6.66812 4.72548 5.54562L2.10048 2.94146C1.85436 2.69729 1.85436 2.30229 2.10048 2.05812C2.3466 1.81396 2.7456 1.81396 2.99172 2.05812ZM5.62428 6.43812C4.23072 7.47146 3.18492 8.75562 2.60196 9.56729C2.46504 9.75812 2.39952 9.85062 2.36088 9.92479C2.33568 9.97229 2.33568 9.98479 2.33568 9.99812V9.99979V10.0015C2.33568 10.0148 2.33568 10.0273 2.36088 10.0748C2.39952 10.149 2.46504 10.2415 2.60196 10.4323C3.15636 11.204 4.1358 12.4115 5.43864 13.4206C6.74232 14.4306 8.32656 15.2081 10.1057 15.2081C11.3447 15.2081 12.4879 14.8315 13.5102 14.2606L11.8117 12.5756C11.3111 12.9215 10.7021 13.1248 10.046 13.1248C8.33916 13.1248 6.95568 11.7523 6.95568 10.059C6.95568 9.40812 7.16064 8.80396 7.50924 8.30812L5.62428 6.43812ZM10.1057 4.79146C9.41604 4.79146 8.75664 4.90812 8.13168 5.10979C7.80072 5.21646 7.4454 5.03646 7.33788 4.70812C7.23036 4.37979 7.4118 4.02729 7.74276 3.92062C8.48028 3.68312 9.27072 3.54146 10.1057 3.54146C12.2653 3.54146 14.1158 4.48396 15.5489 5.59396C16.9828 6.70479 18.0428 8.01646 18.6359 8.84062L18.6804 8.90312C18.8929 9.19646 19.1357 9.53146 19.1357 9.99979C19.1357 10.4681 18.8929 10.8031 18.6804 11.0965L18.6359 11.159C18.2293 11.724 17.6069 12.5131 16.7988 13.309C16.5518 13.5523 16.1528 13.5506 15.9076 13.3056C15.6623 13.0606 15.664 12.6648 15.9109 12.4223C16.656 11.6881 17.2331 10.9573 17.6102 10.4323C17.7472 10.2415 17.8127 10.149 17.8513 10.0748C17.8757 10.0273 17.8757 10.0148 17.8757 10.0023V10.0015V9.99979V9.99812V9.99729C17.8757 9.98479 17.8757 9.97229 17.8513 9.92479C17.8127 9.85062 17.7472 9.75812 17.6102 9.56729C17.055 8.79562 16.0764 7.58812 14.7736 6.57896C13.469 5.56896 11.8856 4.79146 10.1057 4.79146ZM8.42484 9.21562C8.29128 9.46729 8.21568 9.75479 8.21568 10.059C8.21568 11.0615 9.03552 11.8748 10.046 11.8748C10.3535 11.8748 10.6424 11.7998 10.8961 11.6681L8.42484 9.21562Z" fill="#111827"/>
                    </svg>
                  ) : (
                    // Eye (show) icon
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M10.3156 3.54199C12.4753 3.54199 14.3258 4.48449 15.7588 5.59449C17.1927 6.70533 18.2528 8.01699 18.8458 8.84116L18.8904 8.90366C19.1029 9.19699 19.3456 9.53199 19.3456 10.0003C19.3456 10.4687 19.1029 10.8037 18.8904 11.097L18.8458 11.1595C18.2528 11.9837 17.1927 13.2953 15.7588 14.4062C14.3258 15.5162 12.4753 16.4587 10.3156 16.4587C8.15684 16.4587 6.30548 15.5162 4.87328 14.4062C3.43856 13.2953 2.37932 11.9837 1.78628 11.1595L1.74092 11.097C1.5284 10.8037 1.28564 10.4687 1.28564 10.0003C1.28564 9.53199 1.5284 9.19699 1.74092 8.90366L1.78628 8.84116C2.37932 8.01699 3.43856 6.70533 4.87328 5.59449C6.30548 4.48449 8.15684 3.54199 10.3156 3.54199ZM2.81192 9.56783C2.675 9.75866 2.60948 9.85116 2.57084 9.92533C2.54564 9.97283 2.54564 9.98533 2.54564 9.99866V10.0003V10.002C2.54564 10.0153 2.54564 10.0278 2.57084 10.0753C2.60948 10.1495 2.675 10.242 2.81192 10.4328C3.36632 11.2045 4.34576 12.412 5.6486 13.4212C6.95228 14.4312 8.53652 15.2087 10.3156 15.2087C12.0956 15.2087 13.679 14.4312 14.9835 13.4212C16.2864 12.412 17.265 11.2045 17.8202 10.4328C17.9571 10.242 18.0226 10.1495 18.0613 10.0753C18.0856 10.0278 18.0856 10.0153 18.0856 10.0028V10.002V10.0003V9.99866V9.99783C18.0856 9.98533 18.0856 9.97283 18.0613 9.92533C18.0226 9.85116 17.9571 9.75866 17.8202 9.56783C17.265 8.79616 16.2864 7.58866 14.9835 6.57949C13.679 5.56949 12.0956 4.79199 10.3156 4.79199C8.53652 4.79199 6.95228 5.56949 5.6486 6.57949C4.34576 7.58866 3.36632 8.79616 2.81192 9.56783ZM10.3156 13.1253C8.576 13.1253 7.16564 11.7262 7.16564 10.0003C7.16564 8.27449 8.576 6.87533 10.3156 6.87533C12.0553 6.87533 13.4656 8.27449 13.4656 10.0003C13.4656 11.7262 12.0553 13.1253 10.3156 13.1253ZM8.42564 10.0003C8.42564 11.0362 9.27236 11.8753 10.3156 11.8753C11.3598 11.8753 12.2056 11.0362 12.2056 10.0003C12.2056 8.96449 11.3598 8.12533 10.3156 8.12533C9.27236 8.12533 8.42564 8.96449 8.42564 10.0003Z" fill="#111827"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Show validation or login error */}
            {loginError && (
              <div className="text-red-600 text-sm text-center mt-4">
                {loginError}
              </div>
            )}
            {loginSuccess && (
              <p className="text-green-600 text-sm text-center mt-4">
                {loginSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className={`w-full flex justify-center rounded-md bg-black px-4 py-2.5 mt-6 text-sm font-semibold text-white shadow-md hover:bg-gray-800 ${
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

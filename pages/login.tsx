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
    setLoadingLogin(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

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

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
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

        {/* 🧠 Display WordPress users */}
        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-2xl">
          <h3 className="text-xl font-bold text-zinc-900 mb-4 text-center">
            Current Users
          </h3>

          {loadingUsers && <p className="text-center">Loading users...</p>}
          {errorUsers && (
            <p className="text-center text-red-600">{errorUsers}</p>
          )}

          {!loadingUsers && !errorUsers && (
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 border-b">ID</th>
                  <th className="py-2 px-3 border-b">Login</th>
                  <th className="py-2 px-3 border-b">Name</th>
                  <th className="py-2 px-3 border-b">Email</th>
                  <th className="py-2 px-3 border-b">URL</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.ID} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{u.ID}</td>
                    <td className="py-2 px-3">{u.user_login}</td>
                    <td className="py-2 px-3">{u.user_nicename}</td>
                    <td className="py-2 px-3">{u.user_email}</td>
                    <td className="py-2 px-3">
                      <a
                        href={u.user_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {u.user_url}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}

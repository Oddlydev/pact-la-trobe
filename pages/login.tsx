// pages/login.tsx
import Head from "next/head";
import InputField from "@/src/components/InputFields/InputFields";
import FormButton from "@/src/components/Buttons/FormButtons";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login – Test</title>
      </Head>
      <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/assets/images/logo.svg"
            alt="Your Company"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            {/* Email Field */}
            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              validate={(val) =>
                !val.includes("@") ? "Please enter a valid email" : null
              }
            />

            {/* Password Field */}
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              validate={(val) =>
                val.length < 6 ? "Password must be at least 6 characters" : null
              }
            />

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-sm font-medium leading-5 tracking-normal text-[var(--color-accent)]"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <FormButton
              variant="dark"
              label="Sign in"
              className="w-full"
              onClick={() => console.log("Sign in clicked")}
            />
          </form>
        </div>
      </main>
    </>
  );
}

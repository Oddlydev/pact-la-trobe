import Head from "next/head";
import InputField from "@/src/components/Forms/InputFields";
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
            className="mx-auto w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-zinc-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-16 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            {/* Email Field */}
            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder=""
              required
              validate={(val) =>
                !val.includes("@") ? "Please enter a valid email" : null
              }
            />

            {/* Password Field with Forgot Password */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 font-dmsans"
                >
                  Password
                </label>
                <a
                  href="#"
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
                label="" // 👈 disable InputField's own label
                validate={(val) =>
                  val.length < 6
                    ? "Password must be at least 6 characters"
                    : null
                }
              />
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

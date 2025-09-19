import React from "react";
import Link from "next/link";
import Layout from "@/src/components/Layout";
import PrimaryButton from "@/src/components/Buttons/PrimaryButtons";

export default function SampleHomePage() {
  const links: { href: string; label: string; variant?: "dark" | "light" }[] = [
    { href: "/patient-profile", label: "Patient Profile", variant: "dark" },
    { href: "/patient-management", label: "Patient Management" },
    { href: "/patients", label: "Patients" },
    { href: "/assessment-form", label: "Assessment Form" },
    { href: "/assessment-report", label: "Assessment Report" },
    { href: "/resources", label: "Resources" },
    { href: "/user-profile", label: "User Profile" },
    { href: "/login", label: "Login" },
    { href: "/all-components", label: "All Components" },
  ];

  return (
    <Layout>
      <div className="rounded-xl border border-white bg-[rgba(0,0,0,0.00)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sample Home</h1>
            <p className="text-sm text-gray-600">
              Jump to commonly used pages in this demo
            </p>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0">
              <PrimaryButton
                variant={item.variant ?? "light"}
                label={item.label}
              />
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/src/components/Navigation/Sidebar";
import Topbar from "@/src/components/Navigation/Topbar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Login page has no sidebar/topbar
  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Dashboard layout
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[rgba(171,190,194,0.10)] shadow-[inset_0_0_50px_0_rgba(171,190,194,0.10)] pt-6 pb-4 px-4">
          {children}
        </main>
      </div>
    </div>
  );
}

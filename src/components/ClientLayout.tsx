"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/public";

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="main-wrapper">
      <Sidebar />
      <main className="content-area animate-fade">
        {children}
      </main>
    </div>
  );
}

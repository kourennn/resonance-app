"use client";

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/public";

  return (
    <html lang="en">
      <body>
        <AppProvider>
          {!isPublicRoute ? (
            <div className="main-wrapper">
              <Sidebar />
              <main className="content-area animate-fade">
                {children}
              </main>
            </div>
          ) : (
            <>{children}</>
          )}
        </AppProvider>
      </body>
    </html>
  );
}

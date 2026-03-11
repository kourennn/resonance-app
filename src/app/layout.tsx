import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "RESONANCE | Member Management",
  description: "Elite Voice Impersonator Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}

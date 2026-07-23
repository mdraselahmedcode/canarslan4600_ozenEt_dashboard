import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/provider";

export const metadata: Metadata = {
  title: "Özen Et - Admin Dashboard Login",
  description: "B2B Wholesale Management System Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-nunito bg-slate-50 text-text-dark">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}


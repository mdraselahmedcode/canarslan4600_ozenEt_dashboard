import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}

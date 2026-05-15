import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import AuthNav from "./AuthNav";

export const metadata: Metadata = {
  title: "Aura Store",
  description: "Tienda Online Premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <nav className="glass-nav">
          <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
            Aura
          </Link>
          <AuthNav />
        </nav>
        {children}
      </body>
    </html>
  );
}

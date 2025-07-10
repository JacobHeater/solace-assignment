import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="fixed z-50 top-0 left-0 w-full bg-[var(--solace-green)] text-[var(--solace-foreground)] py-5 pl-[20px] md:pl-[90px] font-bold text-xl shadow-b-lg drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
          <div>Solace Advocates</div>
        </header>
        <main className="mt-24">
          {children}
        </main>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}

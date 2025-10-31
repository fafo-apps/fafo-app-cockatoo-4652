import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oman Travel Blog",
  description: "Your beautiful travel journal for exploring Oman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#faf7f2] text-zinc-900`}>
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight">Oman Travel Blog</Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="hover:text-amber-700">Home</Link>
              <Link href="/stories" className="hover:text-amber-700">Stories</Link>
              <Link href="/stories/new" className="inline-flex items-center rounded-full bg-amber-600 text-white px-3 py-1.5 hover:bg-amber-700">New Story</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} Your Oman Journey
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Full-Stack JS engineer test assessment - the Quiz Builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
        <nav style={{ display: 'flex', gap: 64, marginBottom: 24 }}>
          <a href="/">Main</a>
          <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <a href="/quizzes">Quizzes</a>
            <a href="/create">Create</a>
          </nav>
        </nav>
        {children}
      </body>
    </html>
  );
}

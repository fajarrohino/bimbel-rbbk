import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const plusJakartaSans = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: "400 800",
});

export const metadata: Metadata = {
  title: "RBBK",
  description:
    "Pendampingan belajar ramah anak untuk Calistung, Matematika, Bahasa Inggris, dan Sains di Purbalingga bersama Bu Khotimah.",
  icons: {
    icon: [
      { url: "/logo-rbbk.png", type: "image/png" },
    ],
    shortcut: "/logo-rbbk.png",
    apple: "/logo-rbbk.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo-rbbk.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo-rbbk.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-rbbk.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans min-h-screen bg-surface text-on-surface`}>
        {children}
      </body>
    </html>
  );
}

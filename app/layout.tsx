import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swastha Setu — Voice-First Health Triage & PHC Locator",
  description: "Free voice-first health triage and government Primary Health Centre locator in Telugu, Hindi, and English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF6EE] text-[#2C2418]">
        {children}
      </body>
    </html>
  );
}

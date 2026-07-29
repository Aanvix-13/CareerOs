import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CareerOS — Organise Your Entire Job Search",
    template: "%s | CareerOS",
  },
  description:
    "CareerOS is your personal career operating system. Manage resumes, track applications, prepare for interviews and never miss a deadline — all from one organised workspace.",
  keywords: ["job search", "career management", "resume tracker", "interview tracker", "job applications"],
  authors: [{ name: "CareerOS" }],
  openGraph: {
    title: "CareerOS — Your Personal Career Operating System",
    description:
      "Manage resumes, track job applications, prepare for interviews, and measure career progress — all in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        {/*
          Plus Jakarta Sans is loaded via @import in globals.css.
          No <link> tag needed here since Next.js 16 with Turbopack processes CSS imports.
        */}
        <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#111827]">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

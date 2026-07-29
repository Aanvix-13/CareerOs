import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareerOS",
  description: "Track and optimize your job applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="h-full antialiased"
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

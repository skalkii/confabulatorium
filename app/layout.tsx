import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "./components/SiteNav";

export const metadata: Metadata = {
  title: {
    default: "Confabulatorium",
    template: "%s · Confabulatorium",
  },
  description:
    "An archive of what the machine remembers that never happened. LLM confabulations presented as dreams, cross-referenced with the waking record.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    title: "Confabulatorium",
    description: "An archive of what the machine remembers that never happened.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <SiteNav />
        {children}
        <footer className="mx-auto mt-24 max-w-5xl border-t border-[color:var(--color-rule)] px-6 py-10">
          <p className="meta">
            Confabulatorium · an archive of what the machine remembers that never happened
          </p>
        </footer>
      </body>
    </html>
  );
}

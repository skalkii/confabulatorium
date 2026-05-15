import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { SiteNav } from "./components/SiteNav";
import { ThemeProvider } from "./components/ThemeProvider";
import { Mark } from "./components/Mark";
import { serif, mono } from "./fonts";

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
    <ViewTransitions>
      <html
        lang="en"
        className={`${serif.variable} ${mono.variable}`}
        suppressHydrationWarning
      >
        <body className="min-h-screen antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <SiteNav />
          {children}
          <footer className="mx-auto mt-20 flex max-w-6xl flex-col gap-3 border-t border-rule px-5 py-8 md:mt-28 md:flex-row md:items-center md:justify-between md:px-6 md:py-10 xl:max-w-7xl">
            <div className="flex items-center gap-3 text-faded">
              <Mark size={20} />
              <p className="meta">
                Confabulatorium · an archive of what the machine remembers that never happened
              </p>
            </div>
            <p className="meta">est. 2026</p>
          </footer>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}

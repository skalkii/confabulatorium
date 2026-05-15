import Link from "next/link";
import { Mark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-rule bg-parchment/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-6 md:py-4 xl:max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif tracking-tight text-h2"
        >
          <Mark size={22} className="text-ink" />
          <span>Confabulatorium</span>
          <span className="meta ml-2 hidden md:inline">est. 2026</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <ul className="meta flex shrink-0 gap-4 md:gap-5">
            <li>
              <Link href="/dream/new" className="hover:text-rust">
                Submit
              </Link>
            </li>
            <li>
              <Link href="/archive" className="hover:text-rust">
                Archive
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-rust">
                About
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

/**
 * Spacer to push page content below the fixed header.
 * Used by pages that don't supply their own top padding.
 */
export const NAV_HEIGHT_CLASS = "pt-[58px] md:pt-[68px]";

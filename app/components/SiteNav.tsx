import Link from "next/link";

export function SiteNav() {
  return (
    <header className="border-b border-rule bg-parchment/95 backdrop-blur sticky top-0 z-20">
      <nav className="mx-auto flex max-w-5xl items-baseline justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
        <Link href="/" className="font-serif tracking-tight text-h2 lg:text-[1.5rem]">
          Confabulatorium
          <span className="meta ml-3 hidden sm:inline">est. 2026</span>
        </Link>
        <ul className="meta flex shrink-0 gap-4 md:gap-6">
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
      </nav>
    </header>
  );
}

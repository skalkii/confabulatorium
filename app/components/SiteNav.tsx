import Link from "next/link";

export function SiteNav() {
  return (
    <header className="border-b border-[color:var(--color-rule)] bg-[color:var(--color-parchment)]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl tracking-tight">
          Confabulatorium
          <span className="meta ml-3 font-mono">est. 2026</span>
        </Link>
        <ul className="meta flex gap-6">
          <li>
            <Link href="/dream/new" className="hover:text-[color:var(--color-rust)]">
              Submit
            </Link>
          </li>
          <li>
            <Link href="/archive" className="hover:text-[color:var(--color-rust)]">
              Archive
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-[color:var(--color-rust)]">
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

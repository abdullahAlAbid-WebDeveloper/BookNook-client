"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        {/* Left: logo + links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            aria-label="BookNook home"
            className={`group flex shrink-0 items-center rounded-md ${focusRing}`}
          >
            <Image
              src="/Images/booknook-logo.png"
              alt="BookNook"
              width={1507}
              height={533}
              preload
              className="h-14 w-auto rounded-md transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none dark:rounded-lg dark:bg-[#FBF3E4] dark:p-1.5"
            />
          </Link>

          <nav aria-label="Main" className="hidden sm:block">
            <ul className="flex items-center gap-6 text-sm">
              {links.map(({ href, label }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-md transition-colors ${focusRing} ${
                        active
                          ? "font-medium text-forest"
                          : "text-forest/60 hover:text-forest"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right: theme + auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/login"
            className={`rounded-md border border-line bg-cream px-4 py-1.5 text-sm font-medium text-forest transition-colors hover:bg-forest/5 ${focusRing}`}
          >
            Login
          </Link>

          <Link
            href="/register"
            className={`rounded-md bg-forest px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${focusRing}`}
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
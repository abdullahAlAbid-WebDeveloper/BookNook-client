"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { authClient, signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

const links = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
    toast.add({
      title: "Logged out",
      description: "See you again soon!",
      type: "success",
    });
    router.push("/login");
  };

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

          {session?.user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`rounded-full outline-none ${focusRing}`}
                  aria-label="User menu"
                >
                  <Avatar className="h-9 w-9 border border-line ring-2 ring-forest/40">
                    <AvatarImage
                      src={session.user.image || "/Images/booknook-logo.png"}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback className="bg-cream text-sm font-semibold text-forest">
                      {(session.user.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-44 border-line bg-cream-raised shadow-sm"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="border-b border-line px-3 py-2 font-display text-sm text-ink">
                      {session.user.name || "User"}
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => router.push("/my-books")}
                      className="px-3 py-2 text-sm text-ink data-highlighted:bg-forest/10 data-highlighted:text-forest"
                    >
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="px-3 py-2 text-sm text-ink data-highlighted:bg-forest/10 data-highlighted:text-forest"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}

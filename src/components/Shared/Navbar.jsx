"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import { Moon, Sun, Bars, Xmark } from "@gravity-ui/icons";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/hooks/useTheme"; // ✅ NEW ADD

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/all-classes" },
  { label: "Community Forum", href: "/community-forum" },
];

const handleLogout = async () => {
  await signOut();
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  // ✅ GLOBAL THEME HOOK
  const { theme, toggleTheme } = useTheme();

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b14]/95">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <NextLink href="/" className="flex items-center">
          <div className="transition-transform duration-300 hover:scale-105">
            <Image
              src="/assets/logox.png"
              alt="GymNest Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Gym
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Nest
            </span>
          </h1>
        </NextLink>

        {/* NAV LINKS */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <li key={link.href}>
                <NextLink
                  href={link.href}
                  className={`relative pb-2 text-sm font-semibold transition ${
                    isActive
                      ? "text-pink-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-gradient-to-r after:from-fuchsia-500 after:to-orange-400"
                      : "text-slate-700 hover:text-pink-500 dark:text-neutral-300 dark:hover:text-pink-400"
                  }`}
                >
                  {link.label}
                </NextLink>
              </li>
            );
          })}
        </ul>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-4 lg:flex">

          {/* THEME TOGGLE (UPDATED) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-slate-100 text-pink-500 transition hover:bg-pink-500 hover:text-white dark:border-white/10 dark:bg-[#0c1220] dark:text-orange-300 dark:hover:bg-pink-500"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* AUTH */}
          {user ? (
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-white">
              <Avatar>
                <Avatar.Image alt={user.name} src={user.image} />
                <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
              </Avatar>

              <span>Hi, {user.name}!</span>

              <NextLink
                href={`/dashboard/${user?.role}`}
                className="h-9 px-4 text-sm font-bold text-pink-500 hover:text-white bg-transparent hover:bg-pink-500 border border-pink-500/30 hover:border-pink-500 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
              >
                Dashboard
              </NextLink>

              <Button
                variant="bordered"
                onClick={handleLogout}
                className="h-9 px-4 text-md font-bold text-red-500 hover:text-white bg-transparent hover:bg-red-500 border-red-500/30 hover:border-red-500 rounded-xl transition-all duration-200 active:scale-95"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <NextLink
                href="/auth/signin"
                className="text-sm font-semibold text-slate-900 transition hover:text-pink-500 dark:text-white dark:hover:text-pink-400"
              >
                Login
              </NextLink>

              <NextLink href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="h-11 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-7 font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90">
                  Register
                </Button>
              </NextLink>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-slate-100 text-slate-900 lg:hidden dark:border-white/10 dark:bg-[#0c1220] dark:text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <Xmark className="h-5 w-5" />
          ) : (
            <Bars className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white px-4 py-5 lg:hidden dark:border-white/10 dark:bg-[#070b14]">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <NextLink
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-b border-pink-500 bg-pink-500/10 text-pink-500"
                        : "text-slate-700 hover:bg-pink-500/10 hover:text-pink-500 dark:text-neutral-300"
                    }`}
                  >
                    {link.label}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          {/* THEME BUTTON MOBILE */}
          <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-5 dark:border-white/10">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-white/10 dark:text-white"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark Mode
                </>
              )}
            </button>

            <NextLink
              href="/auth/signin"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl border border-black/10 px-4 py-3 text-center text-sm font-semibold text-slate-900 dark:border-white/10 dark:text-white"
            >
              Login
            </NextLink>

            <NextLink href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
              <Button className="h-11 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-7 font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90">
                Register
              </Button>
            </NextLink>
          </div>
        </div>
      )}
    </nav>
  );
}
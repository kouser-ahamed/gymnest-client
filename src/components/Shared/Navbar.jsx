"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import Image from "next/image";
import { Moon, Sun, Bars, Xmark } from "@gravity-ui/icons";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/hooks/useTheme";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/all-classes" },
  { label: "Community Forum", href: "/community-forum" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    await signOut();
  };

  const dashboardHref = `/dashboard/${user?.role || "member"}`;
  const userName = user?.name || "User";
  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b14]/95">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <NextLink
          href="/"
          className="flex items-center"
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        >
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

        {/* RIGHT SIDE FOR LARGE DEVICE */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* THEME TOGGLE */}
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex h-12 min-w-[170px] items-center justify-between gap-3 rounded-2xl border border-black/10 bg-slate-100 px-3 text-sm font-bold text-slate-900 transition hover:border-pink-500/30 hover:bg-pink-500/10 dark:border-white/10 dark:bg-[#0c1220] dark:text-white dark:hover:bg-white/10"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    {user?.image ? (
                      <Avatar.Image alt={userName} src={user.image} />
                    ) : null}
                    <Avatar.Fallback>{userInitial}</Avatar.Fallback>
                  </Avatar>

                  <span className="max-w-[110px] truncate">
                    Hi, {userName}!
                  </span>
                </div>

                <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  ▾
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#101624] dark:shadow-black/30">
                  <div className="border-b border-slate-200 p-4 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        {user?.image ? (
                          <Avatar.Image alt={userName} src={user.image} />
                        ) : null}
                        <Avatar.Fallback>{userInitial}</Avatar.Fallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                          {userName}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 p-3">
                    <NextLink
                      href={dashboardHref}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex h-11 w-full items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 text-sm font-bold text-pink-600 transition hover:bg-pink-500 hover:text-white dark:text-pink-300"
                    >
                      Dashboard
                    </NextLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex h-11 w-full items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <NextLink
                href="/auth/signin"
                className="flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-900 transition hover:text-pink-500 dark:text-white dark:hover:text-pink-400"
              >
                Login
              </NextLink>

              <NextLink href="/auth/signup">
                <Button className="h-11 min-w-[118px] rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-7 font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90">
                  Register
                </Button>
              </NextLink>
            </>
          )}
        </div>

        {/* MOBILE / TABLET MENU BUTTON */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsUserMenuOpen(false);
          }}
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

      {/* MOBILE / TABLET MENU */}
      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white px-4 py-5 lg:hidden dark:border-white/10 dark:bg-[#070b14]">
          <div className="mx-auto flex max-w-md flex-col gap-4">
            {/* USER INFO MOBILE */}
            {user && (
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#0c1220]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    {user?.image ? (
                      <Avatar.Image alt={userName} src={user.image} />
                    ) : null}
                    <Avatar.Fallback>{userInitial}</Avatar.Fallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                      Hi, {userName}!
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NAV LINKS MOBILE */}
            <div className="space-y-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? "border border-pink-500/20 bg-pink-500/10 text-pink-500"
                        : "border border-black/10 text-slate-700 hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:text-neutral-300"
                    }`}
                  >
                    {link.label}
                  </NextLink>
                );
              })}
            </div>

            {/* AUTH ACTIONS MOBILE */}
            {user ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <NextLink
                  href={dashboardHref}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-pink-500/30 bg-pink-500/10 text-sm font-bold text-pink-600 transition hover:bg-pink-500 hover:text-white dark:text-pink-300"
                >
                  Dashboard
                </NextLink>

                <Button
                  variant="bordered"
                  onClick={handleLogout}
                  className="h-11 w-full rounded-xl border-red-500/30 bg-red-500/10 text-sm font-bold text-red-500 transition hover:bg-red-500 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <NextLink
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-black/10 text-sm font-semibold text-slate-900 transition hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:text-white"
                >
                  Login
                </NextLink>

                <NextLink
                  href="/auth/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full"
                >
                  <Button className="h-11 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-7 font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90">
                    Register
                  </Button>
                </NextLink>
              </div>
            )}

            {/* THEME BUTTON MOBILE */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-semibold text-slate-900 transition hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:text-white"
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
          </div>
        </div>
      )}
    </nav>
  );
}
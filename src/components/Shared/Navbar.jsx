"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Button } from "@heroui/react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/classes" },
  { label: "Community Forum", href: "/community-forum" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <NextLink href="/" className="flex items-center gap-3">
          <div className="relative h-14 w-14 transition-transform duration-300 hover:scale-105">
            <Image
              src="/assets/logof.png"
              alt="GymNest Logo"
              fill
              sizes="56px"
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-black">
            Gym<span className="text-lime-400">Nest</span>
          </h1>
        </NextLink>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NextLink
                href={link.href}
                className="relative text-sm font-semibold text-neutral-300 transition hover:text-lime-400"
              >
                {link.label}
              </NextLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0c1220] text-lime-400 transition hover:bg-lime-400 hover:text-black"
            aria-label="Toggle theme"
          >
            ☀
          </button>

          <NextLink
            href="/login"
            className="text-sm font-semibold text-white transition hover:text-lime-400"
          >
            Login
          </NextLink>

          <Button
            as={NextLink}
            href="/register"
            className="h-11 rounded-2xl bg-lime-400 px-7 font-bold text-black shadow-lg shadow-lime-400/30 hover:bg-lime-300"
          >
            Register
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0c1220] text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <span className="text-2xl leading-none">×</span>
          ) : (
            <span className="text-2xl leading-none">☰</span>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#070b14] px-4 py-5 lg:hidden">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NextLink
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-neutral-300 transition hover:bg-white/5 hover:text-lime-400"
                >
                  {link.label}
                </NextLink>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5">
            <NextLink
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Login
            </NextLink>

            <Button
              as={NextLink}
              href="/register"
              onClick={() => setIsMenuOpen(false)}
              className="h-12 rounded-2xl bg-lime-400 font-bold text-black shadow-lg shadow-lime-400/30 hover:bg-lime-300"
            >
              Register
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
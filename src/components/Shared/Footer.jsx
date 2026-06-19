"use client";

import NextLink from "next/link";
import Image from "next/image";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const  pathname = usePathname();
  if(pathname.includes("/dashboard")) {
    return null; // Don't render the Navbar on dashboard routes
  }

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-[#0c1220] dark:text-slate-300">
      {/* Container: Properly scales padding and max-width across all screens */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-14 lg:px-12">
        
        {/* 
          Grid Breakpoints:
          - Mobile (default): 1 Column, centered text
          - Tablet (sm): 2 Columns, left-aligned text
          - Medium Desktop (md): 3 Columns
          - Large Desktop (lg): 4 Columns
        */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-2 sm:text-left md:grid-cols-3 lg:grid-cols-4">
          
          {/* Section 1: Brand Logo & About */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
              <div className="transition-transform duration-300 hover:scale-105 shrink-0">
                <Image
                  src="/assets/logox.png"
                  alt="GymNest Logo"
                  width={52}
                  height={52}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Gym<span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Nest</span>
              </span>
            </div>
            <p className="text-sm mt-2 leading-relaxed max-w-sm mx-auto sm:mx-0 text-slate-600 dark:text-slate-400">
              Join GymNest and start your ultimate fitness journey today. Achieve your goals with expert guidance.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <NextLink href="/" className="hover:text-pink-500 dark:hover:text-orange-400 transition-colors block py-0.5">Home</NextLink>
              </li>
              <li>
                <NextLink href="/about" className="hover:text-pink-500 dark:hover:text-orange-400 transition-colors block py-0.5">About Us</NextLink>
              </li>
              <li>
                <NextLink href="/classes" className="hover:text-pink-500 dark:hover:text-orange-400 transition-colors block py-0.5">Classes</NextLink>
              </li>
              <li>
                <NextLink href="/pricing" className="hover:text-pink-500 dark:hover:text-orange-400 transition-colors block py-0.5">Pricing</NextLink>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm w-full max-w-xs sm:max-w-none flex flex-col items-center sm:items-start">
              <li className="flex items-start gap-2.5 text-left">
                <MapPinIcon className="h-5 w-5 text-pink-500 dark:text-orange-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">123 Fitness Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5 text-left">
                <PhoneIcon className="h-5 w-5 text-pink-500 dark:text-orange-400 shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2.5 text-left w-full justify-center sm:justify-start">
                <EnvelopeIcon className="h-5 w-5 text-pink-500 dark:text-orange-400 shrink-0" />
                <span className="break-all">support@gymnest.com</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Social Media Icons */}
          <div className="sm:col-span-2 md:col-span-full lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Follow Us
            </h3>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              {/* X / Twitter */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-pink-500 hover:text-pink-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400 transition-all shadow-sm"
                aria-label="X (formerly Twitter)"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-pink-500 hover:text-pink-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400 transition-all shadow-sm"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-pink-500 hover:text-pink-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-orange-400 dark:hover:text-orange-400 transition-all shadow-sm"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-xs dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <p>© {currentYear} GymNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
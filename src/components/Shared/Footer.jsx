"use client";

import NextLink from "next/link";
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from "@heroicons/react/24/outline";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-100 bg-white text-slate-600 dark:border-white/5 dark:bg-[#0c1220] dark:text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Section 1: Brand Logo & Short About Description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-950 dark:text-white">
              {/* Decorative dynamic background container for custom brand representation */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white">
                <span className="font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Gym<span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">Nest</span>
              </span>
            </div>
            <p className="text-sm mt-2 leading-relaxed">
              Join GymNest and start your ultimate fitness journey today. Achieve your goals with expert guidance.
            </p>
          </div>

          {/* Section 2: Internal Application Navigation Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NextLink href="/" className="hover:text-pink-500 transition-colors">Home</NextLink>
              </li>
              <li>
                <NextLink href="/about" className="hover:text-pink-500 transition-colors">About Us</NextLink>
              </li>
              <li>
                <NextLink href="/classes" className="hover:text-pink-500 transition-colors">Classes</NextLink>
              </li>
              <li>
                <NextLink href="/pricing" className="hover:text-pink-500 transition-colors">Pricing</NextLink>
              </li>
            </ul>
          </div>

          {/* Section 3: Gym Location and Communication Details */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPinIcon className="h-5 w-5 text-slate-400 dark:text-neutral-500 mt-0.5 shrink-0" />
                <span>123 Fitness Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-slate-400 dark:text-neutral-500 shrink-0" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-slate-400 dark:text-neutral-500 shrink-0" />
                <span>support@gymnest.com</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Social Media Integrations */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">
              Follow Us
            </h3>
            <div className="flex items-center gap-4">
              {/* X / Twitter Platform Integration */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:border-pink-500 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-pink-500 transition-all"
                aria-label="X (formerly Twitter)"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook Platform Integration */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:border-pink-500 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-pink-500 transition-all"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              {/* Instagram Platform Integration */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:border-pink-500 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-pink-500 transition-all"
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

        {/* Bottom Bar: Copyright Information Banner */}
        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-xs dark:border-white/5">
          <p>© {currentYear} GymNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
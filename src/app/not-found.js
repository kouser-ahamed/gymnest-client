"use client";

import React from "react";
import { Button } from "@heroui/react";
import {
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineSparkles,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-pink-50/50 to-orange-50/40 px-4 py-12 dark:from-[#050914] dark:via-[#101624] dark:to-[#261425]">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-36 -right-32 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-44 w-44 rounded-full bg-fuchsia-400/10 blur-2xl animate-bounce" />

      {/* Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ec489920_1px,transparent_1px),linear-gradient(to_bottom,#ec489920_1px,transparent_1px)] bg-[size:50px_50px] opacity-40" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-pink-200/70 bg-white/80 p-8 shadow-[0_20px_80px_rgba(236,72,153,0.15)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#101624]/90 dark:shadow-black/30 sm:p-12">
        {/* Decorative Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-orange-400/15 blur-3xl" />

        {/* Top Badge */}
        <div className="relative z-10 mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-pink-600 shadow-sm dark:text-pink-300">
            <HiOutlineSparkles className="text-sm" />
            Error 404
          </div>
        </div>

        {/* Illustration */}
        <div className="relative z-10 text-center">
          <div className="relative mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 shadow-2xl shadow-pink-500/30 sm:h-48 sm:w-48">
            <div className="absolute -left-6 top-1/2 h-5 w-12 -translate-y-1/2 rounded-full bg-white/90 shadow-md" />
            <div className="absolute -right-6 top-1/2 h-5 w-12 -translate-y-1/2 rounded-full bg-white/90 shadow-md" />
            <div className="absolute -left-9 top-1/2 h-12 w-5 -translate-y-1/2 rounded-xl bg-white shadow-md" />
            <div className="absolute -right-9 top-1/2 h-12 w-5 -translate-y-1/2 rounded-xl bg-white shadow-md" />

            <span className="text-5xl font-black text-white sm:text-6xl">
              404
            </span>
          </div>

          <div className="absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/20 blur-3xl" />
        </div>

        {/* Message */}
        <div className="relative z-10 mx-auto mt-6 max-w-xl text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Oops! Page Not Found
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            The page you are trying to access may have been removed, renamed, or
            temporarily unavailable. Let’s get you back to GymNest and continue
            your fitness journey.
          </p>
        </div>

        {/* Divider */}
        <div className="relative z-10 my-8 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-pink-200 dark:to-white/10" />
          <div className="h-2 w-2 animate-ping rounded-full bg-pink-500" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-orange-200 dark:to-white/10" />
        </div>

        {/* Buttons */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => router.back()}
            variant="bordered"
            className="h-12 w-full rounded-2xl border-pink-200 bg-white px-7 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-pink-50 dark:border-white/10 dark:bg-[#070b14] dark:text-white dark:hover:bg-white/10 sm:w-auto"
            startContent={<HiOutlineArrowLeft className="text-lg" />}
          >
            Go Back
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-7 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30 sm:w-auto"
              startContent={<HiOutlineHome className="text-lg" />}
            >
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Bottom Tiny Text */}
        <p className="relative z-10 mt-10 text-center text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500">
          Lost between workout pages? GymNest will guide you back.
        </p>
      </div>
    </section>
  );
}
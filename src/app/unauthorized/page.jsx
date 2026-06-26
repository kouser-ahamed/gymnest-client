"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Lock, House, ArrowLeft,FromSquare } from "@gravity-ui/icons";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-pink-50 to-orange-50 px-4 py-16 dark:from-[#050914] dark:via-[#101624] dark:to-[#261425]">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-2xl shadow-pink-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-12">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 shadow-xl shadow-pink-500/30">
          <Lock className="h-12 w-12 text-white" />
        </div>

        <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-pink-500 dark:text-pink-300">
          Access Restricted
        </p>

        <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Unauthorized Access
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Sorry, you do not have permission to view this page. Your account role
          or access permission may have been changed by the admin.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            as={Link}
            href="/"
            size="lg"
            className="w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/25 sm:w-auto"
          >
            <House className="h-5 w-5" />
            Back to Home
          </Button>

          <Button
            size="lg"
            variant="bordered"
            onPress={() => router.back()}
            className="w-full border-pink-200 font-bold text-pink-600 dark:border-white/15 dark:text-pink-300 sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>

          <Button
            as={Link}
            href="/auth/signin"
            size="lg"
            variant="flat"
            className="w-full font-bold text-slate-700 dark:text-slate-200 sm:w-auto"
          >
            Login Again
          </Button>
        </div>

        <div className="mt-8 rounded-2xl border border-pink-100 bg-pink-50/70 px-5 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          If you think this is a mistake, please contact the admin.
        </div>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
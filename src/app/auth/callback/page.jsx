"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { resolvePostLoginRedirect } from "@/lib/demoMode";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Securing session and resolving role...");
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    async function handleAuthCallback() {
      if (hasRedirectedRef.current) return;

      try {
        // Attempt 1: Fetch session from Better Auth client
        const sessionRes = await authClient.getSession();
        const user = sessionRes?.data?.user;

        if (user && !isCancelled) {
          hasRedirectedRef.current = true;
          const role = user?.role || "member";
          const targetRoute = resolvePostLoginRedirect(searchParams, role);
          setStatusText("Redirecting to destination...");
          router.replace(targetRoute);
          router.refresh();
          return;
        }

        // Retry polling (up to 4 attempts) to allow fresh cookie session propagation
        for (let attempt = 1; attempt <= 4; attempt++) {
          await new Promise((res) => setTimeout(res, 350));
          if (isCancelled || hasRedirectedRef.current) return;

          const retryRes = await authClient.getSession();
          const retryUser = retryRes?.data?.user;

          if (retryUser) {
            hasRedirectedRef.current = true;
            const role = retryUser?.role || "member";
            const targetRoute = resolvePostLoginRedirect(searchParams, role);
            setStatusText("Redirecting to destination...");
            router.replace(targetRoute);
            router.refresh();
            return;
          }
        }

        // Fallback default redirection
        if (!isCancelled && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          setStatusText("Redirecting to dashboard...");
          const targetRoute = resolvePostLoginRedirect(searchParams, "member");
          router.replace(targetRoute);
          router.refresh();
        }
      } catch (err) {
        if (!isCancelled && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          router.replace("/dashboard/member");
          router.refresh();
        }
      }
    }

    handleAuthCallback();

    return () => {
      isCancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 dark:bg-[#0c1220]">
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#070b14]/90 sm:p-12">
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500 dark:border-pink-400/20 dark:border-t-pink-400" />
          <div className="absolute h-7 w-7 rounded-full bg-pink-500/10" />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Authenticating
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {statusText}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-[#0c1220]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500 dark:border-pink-400/20 dark:border-t-pink-400" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

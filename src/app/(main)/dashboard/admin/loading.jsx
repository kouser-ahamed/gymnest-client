import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-pink-50/60 to-orange-50 px-4 py-8 dark:from-[#050914] dark:via-[#101624] dark:to-[#261425] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#101624]/90 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="relative z-10 animate-pulse space-y-4">
            <div className="h-4 w-40 rounded-full bg-gradient-to-r from-fuchsia-200 via-pink-200 to-orange-200 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

            <div className="h-11 w-96 max-w-full rounded-2xl bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

            <div className="h-4 w-full max-w-2xl rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-pink-500/20 bg-white/80 px-5 py-3 shadow-lg shadow-pink-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500 dark:border-white/10 dark:border-t-pink-400" />

            <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
              Loading Admin Panel
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#101624]"
            >
              <div className="flex animate-pulse items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-100 via-pink-100 to-orange-100 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

                <div className="flex-1 space-y-3">
                  <div className="h-7 w-20 rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

                  <div className="h-4 w-32 rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#101624]/90 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="h-14 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-pink-50 to-orange-50 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

            <div className="flex gap-3">
              <div className="h-11 w-32 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-100 via-pink-100 to-orange-100 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

              <div className="h-11 w-28 animate-pulse rounded-full bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-500/20 dark:to-orange-400/20" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#101624]/90"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

              <div className="relative z-10 animate-pulse space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-fuchsia-100 via-pink-100 to-orange-100 dark:border-pink-500/40 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-48 max-w-full rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

                    <div className="h-4 w-32 rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

                  <div className="h-4 w-11/12 rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

                  <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />
                </div>

                <div className="flex gap-3">
                  <div className="h-10 flex-1 rounded-full bg-gradient-to-r from-fuchsia-100 via-pink-100 to-orange-100 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

                  <div className="h-10 flex-1 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-500/20 dark:to-orange-400/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
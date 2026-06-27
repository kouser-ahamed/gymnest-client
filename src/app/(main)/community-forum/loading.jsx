import React from "react";

const CommunityForumLoading = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 via-pink-50/60 to-orange-50 px-4 py-10 dark:from-[#050914] dark:via-[#101624] dark:to-[#261425] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#101624]/90 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

          <div className="relative z-10 animate-pulse space-y-4">
            <div className="h-4 w-40 rounded-full bg-gradient-to-r from-fuchsia-200 via-pink-200 to-orange-200 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

            <div className="h-12 w-96 max-w-full rounded-2xl bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

            <div className="h-4 w-full max-w-3xl rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

            <div className="h-4 w-full max-w-xl rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#101624]/90 sm:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="h-14 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-pink-50 to-orange-50 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

            <div className="h-12 w-36 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-100 via-pink-100 to-orange-100 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />
          </div>
        </div>

        {/* Loading Small Spinner */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-pink-500/20 bg-white/80 px-5 py-3 shadow-lg shadow-pink-500/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500 dark:border-white/10 dark:border-t-pink-400" />

            <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
              Loading Forum
            </span>
          </div>
        </div>

        {/* Forum Post Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-[#101624]/90"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

              <div className="relative z-10 animate-pulse">
                {/* Author Row */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-fuchsia-200 via-pink-200 to-orange-200 dark:from-fuchsia-500/20 dark:via-pink-500/20 dark:to-orange-400/20" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-white/10" />
                    <div className="h-3 w-24 rounded-full bg-slate-100 dark:bg-white/10" />
                  </div>

                  <div className="h-8 w-20 rounded-full bg-pink-100 dark:bg-pink-500/20" />
                </div>

                {/* Title */}
                <div className="mb-3 h-7 w-4/5 rounded-full bg-gradient-to-r from-slate-200 via-pink-100 to-orange-100 dark:from-white/10 dark:via-pink-500/10 dark:to-orange-400/10" />

                {/* Description Lines */}
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-white/10" />
                  <div className="h-4 w-11/12 rounded-full bg-slate-100 dark:bg-white/10" />
                  <div className="h-4 w-2/3 rounded-full bg-slate-100 dark:bg-white/10" />
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <div className="h-9 w-20 rounded-full bg-gradient-to-r from-fuchsia-100 to-pink-100 dark:from-fuchsia-500/20 dark:to-pink-500/20" />
                    <div className="h-9 w-24 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-500/20 dark:to-orange-400/20" />
                  </div>

                  <div className="h-9 w-24 rounded-full bg-slate-100 dark:bg-white/10" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityForumLoading;
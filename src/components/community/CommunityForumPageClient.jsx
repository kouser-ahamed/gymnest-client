"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Comments,
  Magnifier,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  PersonWorker,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

const getPostId = (item) => {
  if (item?.postId) return item.postId;
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const truncateText = (text = "", limit = 130) => {
  if (!text) return "No description available.";

  if (text.length <= limit) return text;

  return `${text.slice(0, limit)}...`;
};

const formatDate = (value) => {
  const date = new Date(value || Date.now());

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CommunityForumPageClient = ({
  posts = [],
  searchText = "",
  currentPage = 1,
  totalPages = 1,
  totalPosts = 0,
  limit = 9,
}) => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchText);

  const createUrl = ({ page = 1, search = searchValue }) => {
    const queryParams = new URLSearchParams();

    if (search.trim()) {
      queryParams.set("search", search.trim());
    }

    queryParams.set("page", String(page));

    const queryString = queryParams.toString();

    return queryString
      ? `/community-forum?${queryString}`
      : "/community-forum";
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;

    router.push(
      createUrl({
        page: pageNumber,
        search: searchValue,
      }),
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setSearchValue(searchText);
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchText.trim();
      const newSearch = searchValue.trim();

      if (currentSearch !== newSearch) {
        router.replace(
          createUrl({
            page: 1,
            search: searchValue,
          }),
          {
            scroll: false,
          },
        );
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-[#050914] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 text-center shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] dark:shadow-black/20 sm:p-9 lg:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-pink-600 dark:text-pink-300">
              GymNest Community
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              GymNest{" "}
              <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Community Forum
              </span>
            </h1>

            <p className="mx-auto max-w-7xl text-sm leading-7 text-slate-600 mt-2 dark:text-slate-400">
              The GymNest Community Forum is a dedicated space where admins and
              trainers can share fitness tips, workout guidance, class updates,
              motivation, healthy lifestyle advice, and important gym
              announcements. Members can explore full post details, react with
              likes or dislikes, join discussions through comments, and reply to
              others to stay connected with the GymNest fitness community.
            </p>

            <div className="relative mx-auto mt-2 max-w-xl">
              <Magnifier className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search posts, authors, topics..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Showing {posts.length} posts on this page from {totalPosts} matched
            posts
          </p>

          <p className="text-sm font-bold text-pink-600 dark:text-pink-300">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] dark:shadow-black/20">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              No posts found
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try searching with another keyword.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const postId = getPostId(post);

                return (
                  <article
                    key={postId}
                    className="group flex min-h-[470px] flex-col overflow-hidden rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/50 to-orange-50/40 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/15 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] dark:shadow-black/20 dark:hover:border-pink-500/40 dark:hover:shadow-pink-500/20"
                  >
                    <div className="relative mx-3 mt-3 h-64 overflow-hidden rounded-[1.25rem] bg-pink-50 dark:bg-[#070b14]">
                      {post?.image ? (
                        <img
                          src={post.image}
                          alt={post?.title || "Forum post"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-pink-500">
                          No Image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-pink-500/25">
                          {post?.authorRole || "Author"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-900 dark:text-white">
                        {post?.title || "Untitled Post"}
                      </h2>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-2xl border border-pink-100/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-[#070b14]/80">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                            <PersonWorker className="h-4 w-4" />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              Author
                            </p>

                            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                              {post?.authorName || "Author"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl border border-pink-100/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-[#070b14]/80">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-300">
                            <Calendar className="h-4 w-4" />
                          </span>

                          <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                              Published
                            </p>

                            <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                              {formatDate(post?.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <div className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-pink-500/20 bg-pink-500/10 text-xs font-bold text-pink-600 dark:text-pink-300">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post?.likeCount || 0}</span>
                          </div>

                          <div className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-300">
                            <ThumbsDown className="h-4 w-4" />
                            <span>{post?.dislikeCount || 0}</span>
                          </div>

                          <div className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-orange-400/20 bg-orange-400/10 text-xs font-bold text-orange-600 dark:text-orange-300">
                            <Comments className="h-4 w-4" />
                            <span>{post?.commentCount || 0}</span>
                          </div>
                        </div>

                        <Link
                          href={`/community-forum/${postId}`}
                          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30"
                        >
                          Read More
                          <ArrowRightFromSquare className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:flex-row">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 sm:w-auto"
                >
                  Previous
                </button>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    const isActive = currentPage === pageNumber;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => goToPage(pageNumber)}
                        className={`h-10 w-10 rounded-xl border text-sm font-black transition ${
                          isActive
                            ? "border-pink-500/30 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/20"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 sm:w-auto"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CommunityForumPageClient;
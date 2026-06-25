"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Magnifier } from "@gravity-ui/icons";

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

const CommunityForumPageClient = ({ posts = [] }) => {
  const [searchText, setSearchText] = useState("");

  const filteredPosts = useMemo(() => {
    const text = searchText.toLowerCase();

    return posts.filter((post) => {
      const title = post?.title?.toLowerCase() || "";
      const description = post?.description?.toLowerCase() || "";
      const author = post?.authorName?.toLowerCase() || "";
      const role = post?.authorRole?.toLowerCase() || "";

      return (
        title.includes(text) ||
        description.includes(text) ||
        author.includes(text) ||
        role.includes(text)
      );
    });
  }, [posts, searchText]);

  return (
    <section className="min-h-screen bg-[#050914] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto w-fit rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-1 text-xs font-bold text-lime-300">
            IronPulse Community
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Community{" "}
            <span className="bg-gradient-to-r from-lime-300 to-green-400 bg-clip-text text-transparent">
              Forum
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Connect with trainers, share your fitness journey, and learn from
            the IronPulse community.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <Magnifier className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search posts, authors..."
              className="w-full rounded-xl border border-white/10 bg-[#101624] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime-400/40 focus:ring-2 focus:ring-lime-400/10"
            />
          </div>
        </div>

        <p className="mt-12 text-sm font-semibold text-slate-400">
          Showing {filteredPosts.length} of {posts.length} posts
        </p>

        {filteredPosts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#101624] p-10 text-center">
            <h2 className="text-xl font-bold text-white">No posts found</h2>

            <p className="mt-2 text-sm text-slate-400">
              Try searching with another keyword.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => {
              const postId = getPostId(post);

              return (
                <article
                  key={postId}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#101624] shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-lime-400/30"
                >
                  <div className="h-52 overflow-hidden bg-[#070b14]">
                    {post?.image ? (
                      <img
                        src={post.image}
                        alt={post?.title || "Forum post"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-300">
                        {post?.authorRole || "Author"}
                      </span>

                      <span className="text-xs text-slate-500">
                        {new Date(
                          post?.createdAt || Date.now(),
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h2 className="line-clamp-2 text-lg font-black text-white">
                      {post?.title || "Untitled Post"}
                    </h2>

                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      By {post?.authorName || "Author"}
                    </p>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                      {truncateText(post?.description)}
                    </p>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>👍 {post?.likeCount || 0}</span>
                        <span>👎 {post?.dislikeCount || 0}</span>
                        <span>💬 {post?.commentCount || 0}</span>
                      </div>

                      <Link
                        href={`/community-forum/${postId}`}
                        className="rounded-xl border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-bold text-lime-300 transition hover:bg-lime-400/15"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CommunityForumPageClient;
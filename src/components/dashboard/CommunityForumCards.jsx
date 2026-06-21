"use client";

import React from "react";
import { Button, Card } from "@heroui/react";
import Image from "next/image";
import { Comment, Picture } from "@gravity-ui/icons";
import { FiCalendar, FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";

const getPostId = (post) => {
  if (typeof post?._id === "string") return post._id;
  if (post?._id?.$oid) return post._id.$oid;
  return post?._id?.toString?.();
};

const formatDate = (date) => {
  if (!date) return "No date";

  return new Date(date).toLocaleString("en-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const CommunityForumCards = ({ posts = [], onDelete }) => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-[#101624] sm:flex-row sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-400">
            <Comment className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              My Forum Posts
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View and manage your community forum posts.
            </p>
          </div>
        </div>

        <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          Total Posts: {posts.length}
        </div>
      </div>

      {/* Empty State */}
      {posts.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#101624]">
          <Picture className="mb-4 h-12 w-12 text-pink-500" />

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No posts found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You have not created any community forum post yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => {
            const postId = getPostId(post);

            return (
              <Card
                key={postId}
                className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624] dark:hover:shadow-pink-500/20"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl">
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-[#070b14]">
                    {post?.image ? (
                      <Image
                        src={post.image}
                        alt={post.title || "Forum post image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-pink-500">
                        <Picture className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-slate-900/20">
                      {post.authorRole}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {/* Title */}
                  <h2 className="line-clamp-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {post.description}
                  </p>

                <div className="flex items-center justify-between gap-3">
                      {/* Date */}
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-400">
                    <FiCalendar className="h-4 w-4 text-pink-500" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>

                  {/* Like Comment Static */}
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-pink-50/40 p-4 dark:border-white/10 dark:from-[#070b14] dark:via-[#070b14] dark:to-pink-500/5">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiHeart className="h-4 w-4 text-pink-500" />
                        0 Like
                      </span>

                      <span className="flex items-center gap-1.5">
                        <FiMessageCircle className="h-4 w-4 text-orange-400" />
                        0 Comment
                      </span>
                    </div>
                  </div>
                </div>

                  {/* Delete Button */}
                  <Button
                    type="button"
                    onClick={() => onDelete?.(postId)}
                    className="h-12 w-full rounded-full border border-red-500/20 bg-red-500/10 font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/15 dark:text-red-400"
                  >
                    <FiTrash2 className="mr-2 h-4 w-4" />
                    Delete Post
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CommunityForumCards;
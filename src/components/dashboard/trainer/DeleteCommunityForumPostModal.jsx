"use client";

import { Button } from "@heroui/react";

const DeleteCommunityForumPostModal = ({
  post,
  isDeleting,
  onClose,
  onConfirmDelete,
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#101624] dark:text-white">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

        <h2 className="mt-5 text-xl font-black text-red-600 dark:text-red-300">
          Delete Forum Post?
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Are you sure you want to permanently delete this forum post? This will
          also remove all likes and comments related to this post.
        </p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
          <p className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
            {post?.title || "Untitled Post"}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Posted by {post?.authorName || "You"} •{" "}
            {post?.authorRole || "trainer"}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="h-11 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommunityForumPostModal;
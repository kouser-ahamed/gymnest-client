"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getCommentId = (item) => {
  if (item?.commentId) return item.commentId;
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const formatDateTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const EditCommentModal = ({ comment, user, onClose, onUpdated }) => {
  const [text, setText] = useState(comment?.comment || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    if (!text.trim()) {
      toast.error("Comment is required.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        `${apiBaseUrl}/api/forum/comments/${getCommentId(comment)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            userEmail: user?.email,
            comment: text.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update comment.");
      }

      toast.success(result?.message || "Comment updated successfully.");
      onUpdated?.();
      onClose?.();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101624] p-5 text-white shadow-2xl">
        <h2 className="text-lg font-black">Update Comment</h2>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          placeholder="Update your comment..."
          className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-lime-400/40 focus:ring-2 focus:ring-lime-400/10"
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-slate-200"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isSaving}
            onClick={handleUpdate}
            className="h-11 rounded-xl border border-lime-400/20 bg-lime-400/10 text-sm font-bold text-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const DeleteCommentModal = ({ comment, user, onClose, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(
        `${apiBaseUrl}/api/forum/comments/${getCommentId(
          comment,
        )}?userId=${encodeURIComponent(
          user?.id || "",
        )}&userEmail=${encodeURIComponent(user?.email || "")}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete comment.");
      }

      toast.success(result?.message || "Comment deleted successfully.");
      onDeleted?.(result);
      onClose?.();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#101624] p-5 text-white shadow-2xl">
        <h2 className="text-lg font-black text-red-300">Delete Comment?</h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Are you sure you want to delete this comment? This action will hide
          the comment from the discussion.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-slate-200"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-11 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const CommentItem = ({
  comment,
  user,
  onRefresh,
  onCommentCountChange,
  level = 0,
}) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);

  const isOwner =
    comment?.userId === user?.id || comment?.userEmail === user?.email;

  const ensureActive = () => {
    if (user?.status === "blocked") {
      toast.error("You Resticted by admin");
      return false;
    }

    return true;
  };

  const handleReply = async () => {
    if (!ensureActive()) return;

    if (!replyText.trim()) {
      toast.error("Reply is required.");
      return;
    }

    try {
      setIsReplying(true);

      const response = await fetch(
        `${apiBaseUrl}/api/forum/posts/${comment.postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            userEmail: user?.email,
            userName: user?.name,
            userImage: user?.image,
            parentCommentId: getCommentId(comment),
            comment: replyText.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to reply.");
      }

      toast.success(result?.message || "Reply posted successfully.");
      setReplyText("");
      setShowReplyBox(false);

      if (typeof result?.commentCount === "number") {
        onCommentCountChange?.(result.commentCount);
      }

      onRefresh?.();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#101624] p-4 ${
        level > 0 ? "ml-4 border-lime-400/20 md:ml-8" : ""
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400">
            {comment?.userImage && !comment?.isDeleted ? (
              <img
                src={comment.userImage}
                alt={comment?.userName || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-black text-white">
                {(comment?.userName || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-black text-white">
              {comment?.isDeleted ? "Deleted User" : comment?.userName || "User"}
            </h4>

            <p className="text-xs text-slate-500">
              {formatDateTime(comment?.createdAt)}
            </p>
          </div>
        </div>

        {!comment?.isDeleted && isOwner && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (ensureActive()) setEditingComment(comment);
              }}
              className="rounded-lg border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-300"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => {
                if (ensureActive()) setDeletingComment(comment);
              }}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p
        className={`mt-4 whitespace-pre-wrap break-words text-sm leading-6 ${
          comment?.isDeleted ? "italic text-slate-500" : "text-slate-300"
        }`}
      >
        {comment?.comment}
      </p>

      {!comment?.isDeleted && (
        <button
          type="button"
          onClick={() => {
            if (ensureActive()) setShowReplyBox((prev) => !prev);
          }}
          className="mt-3 text-xs font-bold text-lime-300"
        >
          Reply
        </button>
      )}

      {showReplyBox && (
        <div className="mt-4">
          <textarea
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            rows={3}
            placeholder="Write your reply..."
            className="w-full resize-none rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-lime-400/40 focus:ring-2 focus:ring-lime-400/10"
          />

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              disabled={isReplying}
              onClick={handleReply}
              className="h-10 rounded-xl border border-lime-400/20 bg-lime-400/10 px-4 text-xs font-bold text-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isReplying ? "Replying..." : "Post Reply"}
            </Button>
          </div>
        </div>
      )}

      {comment?.replies?.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={getCommentId(reply)}
              comment={reply}
              user={user}
              onRefresh={onRefresh}
              onCommentCountChange={onCommentCountChange}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {editingComment && (
        <EditCommentModal
          comment={editingComment}
          user={user}
          onClose={() => setEditingComment(null)}
          onUpdated={onRefresh}
        />
      )}

      {deletingComment && (
        <DeleteCommentModal
          comment={deletingComment}
          user={user}
          onClose={() => setDeletingComment(null)}
          onDeleted={(result) => {
            if (typeof result?.commentCount === "number") {
              onCommentCountChange?.(result.commentCount);
            }

            onRefresh?.();
          }}
        />
      )}
    </div>
  );
};

const CommunityForumDetailsClient = ({
  user,
  post,
  initialComments = [],
  initialCommentCount = 0,
  initialVoteType = null,
}) => {
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(post?.dislikeCount || 0);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [voteType, setVoteType] = useState(initialVoteType);
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isVoting, setIsVoting] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const postId = post?.postId || post?._id?.toString?.() || post?._id;

  const ensureActive = () => {
    if (user?.status === "blocked") {
      toast.error("You Resticted by admin");
      return false;
    }

    return true;
  };

  const refreshComments = async () => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/forum/posts/${postId}/comments`,
      );

      const data = await response.json();

      if (response.ok) {
        setComments(data?.comments || []);
        setCommentCount(data?.totalComments || 0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (type) => {
    if (!ensureActive()) return;

    try {
      setIsVoting(type);

      const response = await fetch(
        `${apiBaseUrl}/api/forum/posts/${postId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            userEmail: user?.email,
            userName: user?.name,
            type,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to vote.");
      }

      setLikeCount(result?.likeCount || 0);
      setDislikeCount(result?.dislikeCount || 0);
      setVoteType(result?.voteType || type);

      toast.success(result?.message || "Vote updated.");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsVoting("");
    }
  };

  const handleComment = async () => {
    if (!ensureActive()) return;

    if (!commentText.trim()) {
      toast.error("Comment is required.");
      return;
    }

    try {
      setIsCommenting(true);

      const response = await fetch(
        `${apiBaseUrl}/api/forum/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            userEmail: user?.email,
            userName: user?.name,
            userImage: user?.image,
            comment: commentText.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to post comment.");
      }

      toast.success(result?.message || "Comment posted successfully.");
      setCommentText("");

      if (typeof result?.commentCount === "number") {
        setCommentCount(result.commentCount);
      } else {
        setCommentCount((prev) => prev + 1);
      }

      refreshComments();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050914] px-4 py-8 text-white sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />

      <div className="mx-auto max-w-5xl">
        <Link
          href="/community-forum"
          className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
        >
          ← Back to Forum
        </Link>

        <article className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101624] shadow-xl shadow-black/20">
          <div className="max-h-[480px] overflow-hidden bg-[#070b14]">
            {post?.image ? (
              <img
                src={post.image}
                alt={post?.title || "Forum post"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center text-slate-500">
                No Image
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-300">
                {post?.authorRole || "Author"}
              </span>

              <span className="text-xs text-slate-500">
                By {post?.authorName || "Author"}
              </span>

              <span className="text-xs text-slate-500">
                {formatDateTime(post?.createdAt)}
              </span>
            </div>

            <h1 className="break-words text-3xl font-black tracking-tight sm:text-4xl">
              {post?.title || "Untitled Post"}
            </h1>

            <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300 sm:text-base">
              {post?.description || "No description available."}
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button
                type="button"
                disabled={isVoting === "like"}
                onClick={() => handleVote("like")}
                className={`h-11 rounded-xl border text-sm font-bold ${
                  voteType === "like"
                    ? "border-lime-400/30 bg-lime-400/20 text-lime-300"
                    : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                👍 Like {likeCount}
              </Button>

              <Button
                type="button"
                disabled={isVoting === "dislike"}
                onClick={() => handleVote("dislike")}
                className={`h-11 rounded-xl border text-sm font-bold ${
                  voteType === "dislike"
                    ? "border-red-500/30 bg-red-500/20 text-red-300"
                    : "border-white/10 bg-white/5 text-slate-300"
                }`}
              >
                👎 Dislike {dislikeCount}
              </Button>

              <div className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-slate-300">
                💬 Comments {commentCount}
              </div>
            </div>
          </div>
        </article>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#101624] p-5 sm:p-6">
          <h2 className="text-2xl font-black">Comments</h2>

          <div className="mt-5">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rows={4}
              placeholder="Write your comment..."
              className="w-full resize-none rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-lime-400/40 focus:ring-2 focus:ring-lime-400/10"
            />

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                disabled={isCommenting}
                onClick={handleComment}
                className="h-11 rounded-xl border border-lime-400/20 bg-lime-400/10 px-5 text-sm font-bold text-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCommenting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {comments.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#070b14] p-6 text-center">
                <p className="text-sm text-slate-400">
                  No comments yet. Be the first to comment.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={getCommentId(comment)}
                  comment={comment}
                  user={user}
                  onRefresh={refreshComments}
                  onCommentCountChange={(count) => {
                    if (typeof count === "number") {
                      setCommentCount(count);
                    }
                  }}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default CommunityForumDetailsClient;
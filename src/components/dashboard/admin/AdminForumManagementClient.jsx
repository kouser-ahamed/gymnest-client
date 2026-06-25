"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  Comments,
  Magnifier,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "@gravity-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteForumPostModal from "./DeleteForumPostModal";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getPostId = (item) => {
  if (item?.postId) return item.postId;
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
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

const getRoleClass = (role) => {
  if (role === "admin") {
    return "border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-300";
  }

  if (role === "trainer") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";
};

const getStatusClass = (status) => {
  if (status === "Published") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";
  }

  if (status === "Pending") {
    return "border-orange-400/20 bg-orange-400/10 text-orange-600 dark:text-orange-300";
  }

  if (status === "Rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300";
  }

  return "border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300";
};

const AdminForumManagementClient = ({ currentUser, posts = [] }) => {
  const [postList, setPostList] = useState(posts);
  const [searchText, setSearchText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredPosts = useMemo(() => {
    const text = searchText.toLowerCase();

    return postList.filter((post) => {
      const title = post?.title?.toLowerCase() || "";
      const authorName = post?.authorName?.toLowerCase() || "";
      const authorRole = post?.authorRole?.toLowerCase() || "";
      const status = post?.status?.toLowerCase() || "";

      return (
        title.includes(text) ||
        authorName.includes(text) ||
        authorRole.includes(text) ||
        status.includes(text)
      );
    });
  }, [postList, searchText]);

  const handleDeletePost = async () => {
    if (!selectedPost) return;

    const postId = getPostId(selectedPost);

    try {
      setIsDeleting(true);

      const queryParams = new URLSearchParams({
        actorId: currentUser?.id || "",
        actorEmail: currentUser?.email || "",
      });

      const response = await fetch(
        `${apiBaseUrl}/api/admin/forum-posts/${postId}?${queryParams.toString()}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete forum post.");
      }

      setPostList((prev) => prev.filter((item) => getPostId(item) !== postId));
      setSelectedPost(null);

      toast.success(result?.message || "Forum post deleted successfully.", {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1800,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="min-h-screen px-4 py-8 text-slate-900 dark:text-white sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="light"
        toastClassName="!rounded-2xl !border !border-slate-200 !bg-white !text-slate-900 !shadow-lg !shadow-pink-500/10 dark:!border-white/10 dark:!bg-[#101624] dark:!text-white dark:!shadow-pink-500/20"
        bodyClassName="!text-sm !font-semibold !text-slate-900 dark:!text-white"
        progressClassName="!bg-gradient-to-r !from-fuchsia-500 !via-pink-500 !to-orange-400"
      />

      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-[#101624] lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-300">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Admin Forum Management
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Moderate all community posts and remove inappropriate content.
              </p>
            </div>
          </div>

          <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-bold text-pink-600 dark:text-pink-300">
            Total Posts: {postList.length}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
          <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

          <div className="border-b border-slate-200 p-4 dark:border-white/10">
            <div className="relative">
              <Magnifier className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by title, author, role, or status..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
              />
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center p-8 text-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  No forum posts found
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  No community forum posts are available right now.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
                {filteredPosts.map((post) => {
                  const postId = getPostId(post);

                  return (
                    <div
                      key={postId}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]"
                    >
                      <div className="h-44 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#101624]">
                        {post?.image ? (
                          <img
                            src={post.image}
                            alt={post?.title || "Forum post"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="line-clamp-2 text-base font-black text-slate-900 dark:text-white">
                          {post?.title || "Untitled Post"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          By {post?.authorName || "Author"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getRoleClass(
                              post?.authorRole,
                            )}`}
                          >
                            {post?.authorRole || "role"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                              post?.status,
                            )}`}
                          >
                            {post?.status || "N/A"}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            {formatDate(post?.createdAt)}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                            <ThumbsUp className="h-4 w-4" />
                            {post?.likeCount || 0}
                          </div>

                          <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-600 dark:text-red-300">
                            <ThumbsDown className="h-4 w-4" />
                            {post?.dislikeCount || 0}
                          </div>

                          <div className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-orange-400/20 bg-orange-400/10 text-xs font-bold text-orange-600 dark:text-orange-300">
                            <Comments className="h-4 w-4" />
                            {post?.commentCount || 0}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Link
                            href={`/community-forum/${postId}`}
                            className="flex h-10 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-sm font-bold text-pink-600 dark:text-pink-300"
                          >
                            View Post
                          </Link>

                          <Button
                            type="button"
                            onClick={() => setSelectedPost(post)}
                            className="h-10 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-600 dark:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1250px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#070b14]">
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Image
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Title
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Post Date
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Author
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Role
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Likes
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Comments
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPosts.map((post) => {
                      const postId = getPostId(post);

                      return (
                        <tr
                          key={postId}
                          className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                        >
                          <td className="px-5 py-4">
                            <div className="h-14 w-24 overflow-hidden rounded-xl bg-slate-100 dark:bg-[#070b14]">
                              {post?.image ? (
                                <img
                                  src={post.image}
                                  alt={post?.title || "Forum post"}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                                  No Image
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="max-w-[320px] px-5 py-4">
                            <p className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                              {post?.title || "Untitled Post"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                            {formatDate(post?.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white">
                            {post?.authorName || "Author"}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getRoleClass(
                                post?.authorRole,
                              )}`}
                            >
                              {post?.authorRole || "role"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300">
                              <ThumbsUp className="h-4 w-4" />
                              {post?.likeCount || 0}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-xs font-bold text-orange-600 dark:text-orange-300">
                              <Comments className="h-4 w-4" />
                              {post?.commentCount || 0}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/community-forum/${postId}`}
                                className="flex h-10 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 text-xs font-bold text-pink-600 transition hover:bg-pink-500/15 dark:text-pink-300"
                              >
                                View Post
                              </Link>

                              <Button
                                type="button"
                                onClick={() => setSelectedPost(post)}
                                className="h-10 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-xs font-bold text-red-600 transition hover:bg-red-500/15 dark:text-red-300"
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      <DeleteForumPostModal
        post={selectedPost}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setSelectedPost(null);
          }
        }}
        onConfirmDelete={handleDeletePost}
      />
    </section>
  );
};

export default AdminForumManagementClient;
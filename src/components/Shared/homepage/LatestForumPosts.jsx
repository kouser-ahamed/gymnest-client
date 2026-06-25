import Link from "next/link";
import {
  Comments,
  ThumbsUp,
  ThumbsDown,
  ArrowRightFromSquare,
  Calendar,
  PersonWorker,
} from "@gravity-ui/icons";

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

const getResponseData = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  throw new Error(
    `API did not return JSON. Check backend route /api/forum/posts/public. Response: ${text.slice(
      0,
      120,
    )}`,
  );
};

const getLatestForumPosts = async () => {
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "3",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/posts/public?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await getResponseData(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch latest forum posts.");
  }

  const posts = Array.isArray(data) ? data : data?.posts || [];

  return posts
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime();
      const dateB = new Date(b?.createdAt || 0).getTime();

      return dateB - dateA;
    })
    .slice(0, 3);
};

const LatestForumPosts = async () => {
  const posts = await getLatestForumPosts();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-pink-500">
            Latest Forum Posts
          </p>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Fresh From{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              GymNest Community
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Read the newest fitness tips, workout updates, trainer advice, and
            community discussions from GymNest.
          </p>
        </div>

        <Link
          href="/community-forum"
          className="inline-flex h-11 items-center justify-center rounded-full border border-pink-500/20 bg-pink-500/10 px-6 text-sm font-bold text-pink-600 transition-all hover:bg-pink-500/15 dark:text-pink-300"
        >
          View All Posts
          <ArrowRightFromSquare className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-8 text-center dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425]">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No latest posts found
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Latest forum posts will appear here once they are published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="line-clamp-2 min-h-[56px] text-xl font-black leading-7 text-slate-900 dark:text-white">
                    {post?.title || "Untitled Post"}
                  </h3>

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
      )}
    </section>
  );
};

export default LatestForumPosts;
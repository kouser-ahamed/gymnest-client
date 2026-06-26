import CommunityForumDetailsClient from "@/components/community/CommunityForumDetailsClient";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import { getTokenServer } from "@/lib/getTokenServer";


const CommunityForumDetailsPage = async ({ params }) => {
  const user = await getUserSession();
  const { id } = await params;
   const token = await getTokenServer();

  const postId = id;

  if (!user?.id) {
    redirect(
      `/auth/signin?redirect=${encodeURIComponent(
        `/community-forum/${postId}`,
      )}`,
    );
  }

  const postResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/posts/${encodeURIComponent(
      postId,
    )}`,
    {
     method: "GET",
     cache: "no-store",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   },
  );

  const postData = await postResponse.json();

  if (!postResponse.ok) {
    return (
      <section className="min-h-screen bg-[#050914] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h1 className="text-xl font-bold text-red-300">
            Failed to load post.
          </h1>

          <p className="mt-3 text-sm text-red-200">
            {postData?.message || "Something went wrong."}
          </p>

          <p className="mt-2 break-all text-xs text-red-200/80">
            Post ID: {postId}
          </p>
        </div>
      </section>
    );
  }

  const commentsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/posts/${encodeURIComponent(
      postId,
    )}/comments`,
    // {
    //   cache: "no-store",
    // },
    {
     method: "GET",
     cache: "no-store",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   },
  );

  const commentsData = commentsResponse.ok
    ? await commentsResponse.json()
    : { comments: [], totalComments: 0 };

  const voteResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/posts/${encodeURIComponent(
      postId,
    )}/my-vote?userId=${encodeURIComponent(
      user?.id || "",
    )}&email=${encodeURIComponent(user?.email || "")}`,
    {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
  );

  const voteData = voteResponse.ok ? await voteResponse.json() : null;

  return (
    <CommunityForumDetailsClient
      user={user}
      post={postData}
      initialComments={commentsData?.comments || []}
      initialCommentCount={commentsData?.totalComments || 0}
      initialVoteType={voteData?.voteType || null}
    />
  );
};

export default CommunityForumDetailsPage;
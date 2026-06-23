import CommunityForumCards from "@/components/dashboard/CommunityForumCards";
import { getUserSession } from "@/lib/core/session";

const TrainerCommunityAllForumPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    return <CommunityForumCards posts={[]} />;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/community-forum-posts?authorId=${user.id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const communityPost = await response.json();

  if (!response.ok) {
    throw new Error(
      communityPost?.message || "Failed to fetch community forum posts.",
    );
  }

  return <CommunityForumCards posts={communityPost} />;
};

export default TrainerCommunityAllForumPage;

// import CommunityForumCards from "@/components/dashboard/CommunityForumCards";
// //import { getCommunityForumPosts } from "@/lib/api/community-forum-post";
// import { getUserSession } from "@/lib/core/session";

// const TrainerCommunityAllForumPage = async () => {
//   const user = await getUserSession();
//   //const communityPost = await getCommunityForumPosts(user?.id);

//   return <CommunityForumCards posts={communityPost} />;
// };

// export default TrainerCommunityAllForumPage;

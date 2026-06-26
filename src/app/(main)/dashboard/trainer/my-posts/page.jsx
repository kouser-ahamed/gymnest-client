import TrainerCommunityForumCards from "@/components/dashboard/trainer/TrainerCommunityForumCards";
import { getUserSession } from "@/lib/core/session";
import { getTokenServer } from "@/lib/getTokenServer";

const TrainerCommunityAllForumPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    return <TrainerCommunityForumCards posts={[]} currentUser={null} />;
  }

  const queryParams = new URLSearchParams({
    trainerId: user.id,
    trainerEmail: user.email || "",
    
  });

  const token = await getTokenServer();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/trainer/community-forum-posts?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const communityPost = await response.json();

  if (!response.ok) {
    throw new Error(
      communityPost?.message || "Failed to fetch community forum posts.",
    );
  }

  return <TrainerCommunityForumCards posts={communityPost} currentUser={user} />;
};

export default TrainerCommunityAllForumPage;
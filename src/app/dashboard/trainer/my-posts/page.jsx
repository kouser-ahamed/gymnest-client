import CommunityForumCards from "@/components/dashboard/CommunityForumCards";
import { getCommunityForumPosts } from "@/lib/api/community-forum-post";
import { getUserSession } from "@/lib/core/session";

const TrainerCommunityAllForumPage = async () => {
  const user = await getUserSession();
  const communityPost = await getCommunityForumPosts(user?.id);

  return <CommunityForumCards posts={communityPost} />;
};

export default TrainerCommunityAllForumPage;

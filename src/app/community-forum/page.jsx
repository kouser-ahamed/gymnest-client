import CommunityForumPageClient from "@/components/community/CommunityForumPageClient";

const CommunityForumPage = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/posts/public`,
    {
      cache: "no-store",
    },
  );

  const data = await response.json();

  const posts = Array.isArray(data) ? data : [];

  return <CommunityForumPageClient posts={posts} />;
};

export default CommunityForumPage;
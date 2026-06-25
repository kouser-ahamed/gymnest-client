import CommunityForumPageClient from "@/components/community/CommunityForumPageClient";

const getSingleValue = (value) => {
  if (Array.isArray(value)) return value[0];
  return value;
};

const getValidPage = (value) => {
  const pageNumber = Number.parseInt(value || "1", 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return 1;
  }

  return pageNumber;
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

const CommunityForumPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;

  const page = getValidPage(getSingleValue(resolvedSearchParams?.page));
  const search = getSingleValue(resolvedSearchParams?.search)?.trim() || "";

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: "9",
  });

  if (search) {
    queryParams.set("search", search);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/forum/posts/public?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await getResponseData(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch forum posts.");
  }

  const posts = Array.isArray(data) ? data : data?.posts || [];

  return (
    <CommunityForumPageClient
      posts={posts}
      searchText={data?.search || search}
      currentPage={data?.currentPage || page}
      totalPages={data?.totalPages || 1}
      totalPosts={data?.totalPosts ?? posts.length}
      limit={data?.limit || 9}
    />
  );
};

export default CommunityForumPage;
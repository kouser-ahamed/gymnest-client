import ClassesGrid from "@/components/classes/ClassesGrid";

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
    `API did not return JSON. Check backend route /api/classes/browse. Response: ${text.slice(
      0,
      120,
    )}`,
  );
};

const AllClassesPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;

  const page = getValidPage(getSingleValue(resolvedSearchParams?.page));
  const search = getSingleValue(resolvedSearchParams?.search)?.trim() || "";
  const categories =
    getSingleValue(resolvedSearchParams?.categories)?.trim() || "";

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: "9",
  });

  if (search) {
    queryParams.set("search", search);
  }

  if (categories) {
    queryParams.set("categories", categories);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/browse?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await getResponseData(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch classes.");
  }

  return (
    <ClassesGrid
      classes={data?.classes || []}
      searchText={data?.search || search}
      selectedCategories={data?.selectedCategories || []}
      currentPage={data?.currentPage || page}
      totalPages={data?.totalPages || 1}
      totalClasses={data?.totalClasses || 0}
    />
  );
};

export default AllClassesPage;
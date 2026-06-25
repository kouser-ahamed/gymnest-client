import ClassDetailsClient from "@/components/classes/ClassDetailsClient";
import { getUserSession } from "@/lib/core/session";

const getResponseData = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  throw new Error(
    `API did not return JSON. Check backend route /api/classes/:id. Response: ${text.slice(
      0,
      120,
    )}`,
  );
};

const ClassDetailsPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/${id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const classDetails = await getResponseData(response);

  if (!response.ok) {
    throw new Error(classDetails?.message || "Failed to fetch class details.");
  }

  return <ClassDetailsClient classDetails={classDetails} user={user} />;
};

export default ClassDetailsPage;
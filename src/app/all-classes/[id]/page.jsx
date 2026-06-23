//import { getClassById } from "@/lib/api/classes";
import ClassDetailsClient from "@/components/classes/ClassDetailsClient";
import { getUserSession } from "@/lib/core/session";

const ClassDetailsPage = async ({ params }) => {
  const { id } = await params;
  // const classDetails = await getClassById(id);
  const user = await getUserSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/${id}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const classDetails = await response.json();

  if (!response.ok) {
    throw new Error(classDetails?.message || "Failed to fetch class details.");
  }

  return <ClassDetailsClient classDetails={classDetails} user={user} />;
};

export default ClassDetailsPage;

import { getClassById } from "@/lib/api/classes";
import ClassDetailsClient from "@/components/classes/ClassDetailsClient";
import { getUserSession } from "@/lib/core/session";


const ClassDetailsPage = async ({ params }) => {
  const { id } = await params;
  const classDetails = await getClassById(id);
  const user = await getUserSession();

  return <ClassDetailsClient classDetails={classDetails} user={user} />;
};

export default ClassDetailsPage;
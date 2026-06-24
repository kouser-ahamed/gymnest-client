import ApplyTrainerForm from "@/components/dashboard/member/ApplyTrainerForm";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";


const ApplyTrainerPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect(
      `/auth/signin?redirect=${encodeURIComponent(
        "/dashboard/member/apply-trainer"
      )}`
    );
  }

  return <ApplyTrainerForm user={user} />;
};

export default ApplyTrainerPage;
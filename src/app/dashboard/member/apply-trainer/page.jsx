import ApplyTrainerForm from "@/components/dashboard/trainer/ApplyTrainerForm";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

const ApplyTrainerPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect(
      `/auth/signin?redirect=${encodeURIComponent("/dashboard/apply-trainer")}`
    );
  }

  return <ApplyTrainerForm user={user} />;
};

export default ApplyTrainerPage;
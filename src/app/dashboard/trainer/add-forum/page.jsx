import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ForumPostForm from "@/components/dashboard/ForumPostForm";

const TrainerAddForumPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <ForumPostForm
      user={user}
      role="trainer"
      redirectPath="/dashboard/trainer/my-posts"
    />
  );
};

export default TrainerAddForumPage;
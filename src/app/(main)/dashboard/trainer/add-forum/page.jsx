import ForumPostForm from "@/components/dashboard/ForumPostForm";
import { getUserSession } from "@/lib/core/session";

const TrainerAddForumPage = async () => {
  const user = await getUserSession();

  return (
    <ForumPostForm
      user={user}
      role={user.role}
      redirectPath={`/dashboard/${user.role}/my-posts`}
    />
  );
};

export default TrainerAddForumPage;

import ForumPostForm from "@/components/dashboard/ForumPostForm";
import { getUserSession } from "@/lib/core/session";

const adminAddForumPage = async () => {
  const user = await getUserSession();

  return (
    <ForumPostForm
      user={user}
      role={user.role}
      redirectPath={`/dashboard/${user.role}/forum-management`}
    />
  );
};

export default adminAddForumPage;

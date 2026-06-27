import AdminForumManagementClient from "@/components/dashboard/admin/AdminForumManagementClient";
import { getUserSession } from "@/lib/core/session";
import { getTokenServer } from "@/lib/getTokenServer";
import { redirect } from "next/navigation";

const AdminForumManagemenPage = async () => {
  const currentUser = await getUserSession();

  if (!currentUser?.id) {
    redirect("/auth/signin");
  }

  if (currentUser?.role !== "admin") {
    redirect("/");
  }

  const queryParams = new URLSearchParams({
    actorId: currentUser?.id || "",
    actorEmail: currentUser?.email || "",
  });
  const token = await getTokenServer(); // Replace with your method to retrieve the token

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/forum-posts?${queryParams.toString()}`,
    {
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();

  const posts = Array.isArray(data) ? data : [];

  return <AdminForumManagementClient currentUser={currentUser} posts={posts} />;
};

export default AdminForumManagemenPage;
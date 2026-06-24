import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ManageUsersTable from "@/components/dashboard/admin/ManageUsersTable";

const ManageUsersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  if (!user?.id) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-white/10 dark:bg-[#101624]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          User not found
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please login again to manage users.
        </p>
      </section>
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return (
      <section className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
          Failed to load users
        </h2>

        <p className="mt-2 text-sm text-red-500 dark:text-red-300">
          {data?.message || "Something went wrong."}
        </p>
      </section>
    );
  }

  const users = Array.isArray(data) ? data : [];

  return <ManageUsersTable currentUser={user} users={users} />;
};

export default ManageUsersPage;
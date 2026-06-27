import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TrainerOverview from "@/components/dashboard/trainer/TrainerOverview";
import { getTokenServer } from "@/lib/getTokenServer";

const TrainerDashboardPage = async () => {
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
          Please login again to view your dashboard.
        </p>
      </section>
    );
  }

  const token = await getTokenServer();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/trainer-overview?trainerId=${user.id}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  const trainerOverviewData = await response.json();

  // if (!response.ok) {
  //   throw new Error(
  //     trainerOverviewData?.message || "Failed to load trainer dashboard.",
  //   );
  // }

  return (
    <TrainerOverview user={user} trainerOverviewData={trainerOverviewData} />
  );
};

export default TrainerDashboardPage;

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTrainerClasses } from "@/lib/api/classes";
import TrainerClassesTable from "@/components/dashboard/TrainerClassesTable";

const TrainerClassesManagePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const trainerId = session?.user?.id;

  if (!trainerId) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-white/10 dark:bg-[#101624]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          User not found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please login again to view your classes.
        </p>
      </section>
    );
  }

  const classes = await getTrainerClasses(trainerId);

  return <TrainerClassesTable classes={classes} />;
};

export default TrainerClassesManagePage;
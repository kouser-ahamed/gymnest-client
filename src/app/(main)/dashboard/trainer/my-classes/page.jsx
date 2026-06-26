import { auth } from "@/lib/auth";
import { headers } from "next/headers";
//import { getTrainerClasses } from "@/lib/api/classes";
import TrainerClassesTable from "@/components/dashboard/trainer/TrainerClassesTable";

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

  //const classes = await getTrainerClasses(trainerId);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes?trainerId=${trainerId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const classes = await response.json();

  if (!response.ok) {
    throw new Error(classes?.message || "Failed to fetch trainer classes.");
  }
  console.log("Trainer Classes:", classes);

  return <TrainerClassesTable classes={classes} />;
};

export default TrainerClassesManagePage;

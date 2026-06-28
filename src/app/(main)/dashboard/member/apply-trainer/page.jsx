// import ApplyTrainerForm from "@/components/dashboard/member/ApplyTrainerForm";
// import { getUserSession } from "@/lib/core/session";
// import { redirect } from "next/navigation";


// const ApplyTrainerPage = async () => {
//   const user = await getUserSession();

//   if (!user?.id) {
//     redirect(
//       `/auth/signin?redirect=${encodeURIComponent(
//         "/dashboard/member/apply-trainer"
//       )}`
//     );
//   }

//   return <ApplyTrainerForm user={user} />;
// };

// export default ApplyTrainerPage;


//new=========================new Code====28/06/2026



import ApplyTrainerForm from "@/components/dashboard/member/ApplyTrainerForm";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

const ApplyTrainerPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect(
      `/auth/signin?redirect=${encodeURIComponent(
        "/dashboard/member/apply-trainer",
      )}`,
    );
  }

  const userStatus = user?.status?.toLowerCase?.() || "active";

  if (userStatus !== "active") {
    return (
      <section className="min-h-screen bg-white px-4 py-8 dark:bg-[#050914] sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[2rem] border border-red-500/20 bg-white p-8 text-center shadow-2xl shadow-red-500/10 dark:border-red-500/20 dark:bg-[#101624] sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-red-500/25 bg-red-500/10 text-4xl font-black text-red-600 shadow-lg shadow-red-500/10 dark:text-red-400">
                !
              </div>

              <div className="mx-auto mt-6 w-fit rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-red-600 dark:text-red-400">
                Restricted by Admin
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Trainer Application Not Available
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                Your account is currently restricted by admin. You cannot apply
                as a trainer until your account status becomes active again.
                Please contact the admin if you think this is a mistake.
              </p>

              <div className="mx-auto mt-7 grid max-w-xl gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Account Status
                  </p>

                  <p className="mt-2 font-black capitalize text-red-600 dark:text-red-400">
                    {user?.status || "Restricted"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Access
                  </p>

                  <p className="mt-2 font-black text-slate-900 dark:text-white">
                    Application Blocked
                  </p>
                </div>
              </div>

              <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
                <p className="text-sm font-semibold leading-6 text-orange-700 dark:text-orange-300">
                  You can still use your dashboard, but trainer application is
                  disabled while your account is restricted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <ApplyTrainerForm user={user} />;
};

export default ApplyTrainerPage;


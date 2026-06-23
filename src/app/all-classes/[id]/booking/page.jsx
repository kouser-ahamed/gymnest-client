import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import { getClassById } from "@/lib/api/classes";
import ClassBookingApply from "./ClassBookingApply";

const BookingPage = async ({ params }) => {
  const { id } = await params;

  const user = await getUserSession();

  if (!user?.id) {
    redirect(`/auth/signin?redirect=${encodeURIComponent("/")}`);
  }

  if (user?.role !== "member") {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-[2rem] border border-pink-500/20 bg-white p-8 text-center shadow-xl shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-2xl font-black text-white shadow-lg shadow-pink-500/30">
            !
          </div>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Members Only
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Only GymNest members can book fitness classes. Please login with a
            member account to continue your booking.
          </p>

          <div className="mt-6 rounded-2xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm font-bold text-pink-600 dark:text-pink-300">
            Booking access is available for members only.
          </div>
        </div>
      </section>
    );
  }

  const classDetails = await getClassById(id);

  return <ClassBookingApply classDetails={classDetails} />;
};

export default BookingPage;
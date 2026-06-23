import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { paymentDataSave } from "@/lib/actions/payment";
import Link from "next/link";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const res = await paymentDataSave({
      ...metadata,
      sessionId: session_id,
    });

    return (
      <section className="min-h-screen bg-white px-4 py-10 dark:bg-[#050914] sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[2.2rem] border border-emerald-500/20 bg-white p-6 text-center shadow-2xl shadow-emerald-500/10 dark:border-white/10 dark:bg-[#101624] sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-4xl font-black text-white shadow-xl shadow-pink-500/30 sm:h-24 sm:w-24 sm:text-5xl">
                ✓
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-pink-500 dark:text-pink-300">
                Payment Successful
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Your Class Booking is Confirmed!
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                Thank you for booking with GymNest. Your payment has been
                completed successfully, and your selected fitness class is now
                added to your booking list.
              </p>

              <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Class Name
                  </p>
                  <p className="mt-2 text-base font-black text-slate-900 dark:text-white">
                    {metadata?.className || "GymNest Class"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Paid Amount
                  </p>
                  <p className="mt-2 text-base font-black text-pink-500 dark:text-pink-300">
                    ${metadata?.price || 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="mt-2 break-all text-base font-black text-slate-900 dark:text-white">
                    {customerEmail || metadata?.userEmail || "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    Transaction ID
                  </p>
                  <p className="mt-2 break-all text-base font-black text-slate-900 dark:text-white">
                    {metadata?.transactionId || session_id}
                  </p>
                </div>
              </div>

              <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-pink-500/20 bg-pink-500/10 px-5 py-4 text-sm font-semibold leading-6 text-pink-600 dark:text-pink-300">
                A confirmation email will be sent to{" "}
                <span className="font-black">
                  {customerEmail || metadata?.userEmail || "your email"}
                </span>
                . You can now check your booked classes from your member
                dashboard.
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/dashboard/member/booked-classes"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-6 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5 sm:w-auto"
                >
                  Go to My Bookings
                </Link>

                <Link
                  href="/all-classes"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-pink-500/20 bg-pink-500/10 px-6 text-sm font-black text-pink-600 transition hover:-translate-y-0.5 hover:bg-pink-500/15 dark:text-pink-300 sm:w-auto"
                >
                  Browse More Classes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
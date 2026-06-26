import { getUserSession } from "@/lib/core/session";
import { getTokenServer } from "@/lib/getTokenServer";


const getItemId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.() || item?.transactionId || item?.sessionId;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const TransactionMobileCard = ({ item }) => {
  return (
    <div className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-pink-500/30 hover:bg-pink-500/5 dark:border-white/10 dark:bg-[#070b14]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-500 dark:text-pink-300">
            User Email
          </p>

          <p className="mt-1 break-all text-sm font-black text-slate-900 dark:text-white">
            {item?.userEmail || "N/A"}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-sm font-black text-pink-600 dark:text-pink-300">
          {formatCurrency(item?.price)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#101624]">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Class ID
          </p>

          <p className="mt-1 break-all text-sm font-bold text-slate-700 dark:text-slate-200">
            {item?.classId || "N/A"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#101624]">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Amount
            </p>

            <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              {formatCurrency(item?.price)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/5 dark:bg-[#101624]">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Date
            </p>

            <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">
              {formatDate(item?.createdAt)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-orange-600 dark:text-orange-300">
            Transaction ID
          </p>

          <p className="mt-1 break-all text-xs font-bold text-orange-700 dark:text-orange-200">
            {item?.transactionId || item?.sessionId || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

const TransactionsPage = async () => {
  const user = await getUserSession();
  const token = await getTokenServer(); // Replace with your method to retrieve the token

  let transactions = [];

  if (user?.role === "admin") {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking-history?role=${user?.role}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const transactionsResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        transactionsResponse?.message || "Failed to fetch transactions.",
      );
    }

    transactions = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : [];
  }

  const totalRevenue = transactions.reduce((total, item) => {
    return total + Number(item?.price || 0);
  }, 0);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
          Admin Panel
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Read-only data table showing all Stripe payment histories across
              the platform.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:items-center">
            <div className="w-fit rounded-2xl border border-pink-500/20 bg-pink-500/10 px-5 py-3 text-sm font-black text-pink-600 dark:text-pink-300">
              Total Transactions: {transactions.length}
            </div>

            <div className="w-fit rounded-2xl border border-orange-400/20 bg-orange-400/10 px-5 py-3 text-sm font-black text-orange-600 dark:text-orange-300">
              Total Revenue: {formatCurrency(totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6">
        {user?.role !== "admin" ? (
          <div className="flex min-h-[300px] items-center justify-center text-center">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-2xl font-black text-white shadow-lg shadow-pink-500/30">
                !
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Admin Only
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Only admin can view all transaction histories.
              </p>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-4 py-14 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            No transactions found.
          </div>
        ) : (
          <>
            {/* Small & Medium Device Card View */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {transactions.map((item) => (
                <TransactionMobileCard key={getItemId(item)} item={item} />
              ))}
            </div>

            {/* Large Device Table View */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      User Email
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Class ID
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Amount
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Date
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Transaction ID
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((item) => (
                    <tr
                      key={getItemId(item)}
                      className="border-b border-slate-100 transition hover:bg-pink-500/5 dark:border-white/5"
                    >
                      <td className="px-4 py-5">
                        <p className="break-all text-sm font-bold text-slate-800 dark:text-slate-100">
                          {item?.userEmail || "N/A"}
                        </p>
                      </td>

                      <td className="px-4 py-5">
                        <span className="inline-flex max-w-[220px] rounded-xl border border-pink-500/20 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 px-3 py-1.5 text-xs font-black text-pink-700 shadow-sm shadow-pink-500/5 dark:border-pink-400/20 dark:from-fuchsia-500/15 dark:via-pink-500/15 dark:to-orange-400/15 dark:text-pink-200">
                          <span className="truncate">
                            {item?.classId || "N/A"}
                          </span>
                        </span>
                      </td>

                      <td className="px-4 py-5">
                        <span className="inline-flex rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-black text-pink-600 dark:text-pink-300">
                          {formatCurrency(item?.price)}
                        </span>
                      </td>

                      <td className="px-4 py-5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {formatDate(item?.createdAt)}
                      </td>

                      <td className="px-4 py-5">
                        <span className="inline-flex max-w-[260px] rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-300">
                          <span className="truncate">
                            {item?.transactionId || item?.sessionId || "N/A"}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TransactionsPage;
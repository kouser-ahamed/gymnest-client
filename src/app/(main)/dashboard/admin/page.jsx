// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import AdminOverview from "@/components/dashboard/admin/AdminOverview";
// import { getTokenServer } from "@/lib/getTokenServer";


// const AdminDashboardPage = async () => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   const user = session?.user;

//   if (!user?.id) {
//     return (
//       <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-white/10 dark:bg-[#101624]">
//         <h2 className="text-lg font-bold text-slate-900 dark:text-white">
//           User not found
//         </h2>

//         <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
//           Please login again to view your dashboard.
//         </p>
//       </section>
//     );
//   }

//   const token = await getTokenServer();

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin-overview`,
//     {
//       method: "GET",
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     }
//   );

//   const adminOverviewData = await response.json();

//   // if (!response.ok) {
//   //   throw new Error(
//   //     adminOverviewData?.message || "Failed to load admin dashboard."
//   //   );
//   // }

//   return <AdminOverview user={user} adminOverviewData={adminOverviewData} />;
// };

// export default AdminDashboardPage;


















//====================New Code====================










import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenServer } from "@/lib/getTokenServer";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";

const AdminDashboardPage = async () => {
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
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin-overview`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const analyticsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/analytics-overview`,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const adminOverviewData = await response.json();

  const adminAnalyticsData = analyticsResponse.ok
    ? await analyticsResponse.json()
    : {
        categoryBookingStats: [],
        userRoleStats: [],
        totalSales: 0,
        totalBookings: 0,
      };

  return (
    <AdminOverview
      user={user}
      adminOverviewData={{
        ...adminOverviewData,
        ...adminAnalyticsData,
      }}
    />
  );
};

export default AdminDashboardPage;
// "use client";

// import { Card } from "@heroui/react";
// import {
//   ShieldCheck,
//   Calendar,
//   Person,
//   BookOpen,
//   CircleCheck,
// } from "@gravity-ui/icons";
// import Image from "next/image";

// const AdminOverview = ({ user, adminOverviewData }) => {
//   const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "A";

//   const adminStats = [
//     {
//       title: "Total Users",
//       value: adminOverviewData?.totalUsers || 0,
//       icon: Person,
//       iconBox: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
//       glow: "hover:border-fuchsia-500/40",
//     },
//     {
//       title: "Total Classes",
//       value: adminOverviewData?.totalClasses || 0,
//       icon: BookOpen,
//       iconBox: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
//       glow: "hover:border-pink-500/40",
//     },
//     {
//       title: "Total Booked Classes",
//       value: adminOverviewData?.totalBookedClasses || 0,
//       icon: CircleCheck,
//       iconBox: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
//       glow: "hover:border-orange-500/40",
//     },
//   ];

//   return (
//     <section className="space-y-6">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         {adminStats.map((item) => {
//           const Icon = item.icon;

//           return (
//             <Card
//               key={item.title}
//               className={`border border-slate-200 bg-white shadow-sm transition dark:border-white/10 dark:bg-[#101624] ${item.glow}`}
//             >
//               <div className="flex items-center gap-4 p-5">
//                 <div
//                   className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBox}`}
//                 >
//                   <Icon className="h-6 w-6" />
//                 </div>

//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//                     {item.value}
//                   </h2>

//                   <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//                     {item.title}
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       <Card className="border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
//         <div className="p-6">
//           <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h2 className="text-xl font-bold text-slate-900 dark:text-white">
//                 Profile Details
//               </h2>

//               <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                 Admin account information
//               </p>
//             </div>

//             <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
//               <ShieldCheck className="h-4 w-4" />
//               Admin
//             </div>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-[#070b14]">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//               <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
//                 {user?.image ? (
//                   <Image
//                     src={user.image}
//                     alt={user.name || "Admin"}
//                     width={88}
//                     height={88}
//                     className="h-[88px] w-[88px] rounded-xl border-2 border-pink-500 object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-3xl font-bold text-white">
//                     {avatarLetter}
//                   </div>
//                 )}

//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">
//                     {user?.name || "Admin Name"}
//                   </h3>

//                   <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//                     {user?.email || "admin@example.com"}
//                   </p>
//                 </div>
//               </div>

//               <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#101624] lg:w-[260px]">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
//                     <Calendar className="h-5 w-5" />
//                   </div>

//                   <div>
//                     <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
//                       Account Created
//                     </p>

//                     <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
//                       {user?.createdAt
//                         ? new Date(user.createdAt).toLocaleDateString(
//                             "en-BD",
//                             {
//                               year: "numeric",
//                               month: "long",
//                               day: "numeric",
//                               timeZone: "Asia/Dhaka",
//                             }
//                           )
//                         : "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </section>
//   );
// };

// export default AdminOverview;







//====================New Code====================




"use client";

import { Card } from "@heroui/react";
import {
  ShieldCheck,
  Calendar,
  Person,
  BookOpen,
  CircleCheck,
} from "@gravity-ui/icons";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const roleColors = ["#ec4899", "#f97316", "#a855f7", "#22c55e", "#06b6d4"];

const AdminOverview = ({ user, adminOverviewData }) => {
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "A";

  const categoryBookingStats = adminOverviewData?.categoryBookingStats || [];
  const userRoleStats = adminOverviewData?.userRoleStats || [];

  const adminStats = [
    {
      title: "Total Users",
      value: adminOverviewData?.totalUsers || 0,
      icon: Person,
      iconBox: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
      glow: "hover:border-fuchsia-500/40",
    },
    {
      title: "Total Classes",
      value: adminOverviewData?.totalClasses || 0,
      icon: BookOpen,
      iconBox: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      glow: "hover:border-pink-500/40",
    },
    {
      title: "Total Booked Classes",
      value: adminOverviewData?.totalBookedClasses || 0,
      icon: CircleCheck,
      iconBox: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      glow: "hover:border-orange-500/40",
    },
  ];

  const CategoryTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length < 1) return null;

    return (
      <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#101624]">
        <p className="mb-2 text-sm font-black text-slate-900 dark:text-white">
          {label}
        </p>

        {payload.map((item) => (
          <p
            key={item.dataKey}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
            {item.name}:{" "}
            <span className="font-black">
              {item.dataKey === "totalSales" ? `৳${item.value}` : item.value}
            </span>
          </p>
        ))}
      </div>
    );
  };

  const RoleTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length < 1) return null;

    const item = payload[0];

    return (
      <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#101624]">
        <p className="text-sm font-black text-slate-900 dark:text-white">
          {item.name}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Users: <span className="font-black">{item.value}</span>
        </p>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {adminStats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className={`border border-slate-200 bg-white shadow-sm transition dark:border-white/10 dark:bg-[#101624] ${item.glow}`}
            >
              <div className="flex items-center gap-4 p-5">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBox}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </h2>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Profile Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Admin account information
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
              <ShieldCheck className="h-4 w-4" />
              Admin
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-[#070b14]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "Admin"}
                    width={88}
                    height={88}
                    className="h-[88px] w-[88px] rounded-xl border-2 border-pink-500 object-cover"
                  />
                ) : (
                  <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-3xl font-bold text-white">
                    {avatarLetter}
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {user?.name || "Admin Name"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {user?.email || "admin@example.com"}
                  </p>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#101624] lg:w-[260px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Calendar className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Account Created
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            "en-BD",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              timeZone: "Asia/Dhaka",
                            },
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
          <div className="p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Category-wise Booking & Sales
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Total bookings and sales amount grouped by class category
                </p>
              </div>

              <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-sm font-bold text-orange-600 dark:text-orange-300">
                ৳{adminOverviewData?.totalSales || 0} Sales
              </div>
            </div>

            {categoryBookingStats.length === 0 ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No category booking data found.
                </p>
              </div>
            ) : (
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryBookingStats}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-slate-200 dark:stroke-white/10"
                    />

                    <XAxis
                      dataKey="category"
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      yAxisId="left"
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                      }}
                    />

                    <Tooltip content={<CategoryTooltip />} />
                    <Legend />

                    <Bar
                      yAxisId="left"
                      dataKey="totalBookings"
                      name="Bookings"
                      fill="#ec4899"
                      radius={[10, 10, 0, 0]}
                      barSize={28}
                    />

                    <Bar
                      yAxisId="right"
                      dataKey="totalSales"
                      name="Total Sales"
                      fill="#f97316"
                      radius={[10, 10, 0, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
          <div className="p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  User Role Distribution
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Total users grouped by role
                </p>
              </div>

              <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-bold text-pink-600 dark:text-pink-300">
                {adminOverviewData?.totalUsers || 0} Users
              </div>
            </div>

            {userRoleStats.length === 0 ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  No role data found.
                </p>
              </div>
            ) : (
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRoleStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={115}
                      innerRadius={55}
                      paddingAngle={4}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {userRoleStats.map((entry, index) => (
                        <Cell
                          key={entry.role}
                          fill={roleColors[index % roleColors.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip content={<RoleTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminOverview;






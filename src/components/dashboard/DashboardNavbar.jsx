// "use client";

// const DashboardNavbar = ({ user }) => {
//   const currentHour = new Date().getHours();

//   const greeting =
//     currentHour < 12
//       ? "Good Morning"
//       : currentHour < 18
//       ? "Good Afternoon"
//       : "Good Evening";

//   const role = user?.role || "member";

//   const roleTitle =
//     role === "admin"
//       ? "Admin"
//       : role === "trainer"
//       ? "Trainer"
//       : "Member";

//   return (
//     <header className="border-b border-slate-200 bg-white px-6 py-6 dark:border-white/10 dark:bg-[#070b14]">
//       <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
        
//         {/* Small Greeting */}
//         <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
//           {greeting}, {user?.name || "User"}!
//         </p>

//         {/* Big Dashboard Title */}
//         <h1 className="mt-2 text-md font-extrabold tracking-tight text-slate-900 dark:text-white md:text-xl">
//           {roleTitle}{" "}
//           <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
//             Dashboard
//           </span>
//         </h1>

//         {/* Small Subtitle */}
//         <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-neutral-300">
//           Here's what's happening in your dashboard today.
//         </p>

//         {/* Small Role Badge */}
//         <div className="mt-4 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-400">
//           {role} panel
//         </div>
//       </div>
//     </header>
//   );
// };

// export default DashboardNavbar;



//====================New Code==================== 27/06/2024


"use client";

const DashboardNavbar = ({ user }) => {
  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const role = ["admin", "trainer", "member"].includes(user?.role)
    ? user.role
    : "member";

  const roleTitle =
    role === "admin" ? "Admin" : role === "trainer" ? "Trainer" : "Member";

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-6 dark:border-white/10 dark:bg-[#070b14]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {greeting}, {user?.name || "User"}!
        </p>

        <h1 className="mt-2 text-md font-extrabold tracking-tight text-slate-900 dark:text-white md:text-xl">
          {roleTitle}{" "}
          <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-neutral-300">
          Here's what's happening in your dashboard today.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-400">
            {role} panel
          </div>

          {user?.status === "blocked" && (
            <div className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              blocked
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
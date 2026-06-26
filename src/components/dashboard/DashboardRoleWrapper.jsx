"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

const getDashboardByRole = (role) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "trainer") return "/dashboard/trainer";
  return "/dashboard/member";
};

export default function DashboardRoleWrapper({ initialUser, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [latestUser, setLatestUser] = useState(initialUser);
  const [syncingRole, setSyncingRole] = useState(false);

  useEffect(() => {
    const checkLatestRole = async () => {
      try {
        if (!initialUser?.id && !initialUser?.email) {
          return;
        }

        setSyncingRole(true);

        const queryParams = new URLSearchParams();

        if (initialUser?.id) {
          queryParams.set("id", initialUser.id);
        }

        if (initialUser?.email) {
          queryParams.set("email", initialUser.email);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/current?${queryParams.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const freshUser = await response.json();

        if (!response.ok) {
          return;
        }

        setLatestUser(freshUser);

        if (freshUser?.status === "blocked") {
          router.replace("/unauthorized");
          return;
        }

        const targetDashboard = getDashboardByRole(freshUser?.role);
        const isCorrectDashboard = pathname.startsWith(targetDashboard);

        if (!isCorrectDashboard) {
          router.replace(targetDashboard);
        }
      } catch (error) {
        console.error("Dashboard role sync error:", error);
      } finally {
        setSyncingRole(false);
      }
    };

    checkLatestRole();
  }, [initialUser?.id, initialUser?.email, pathname, router]);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-1 overflow-hidden">
        <DashboardSideBar user={latestUser} />

        <div className="relative flex-1 overflow-y-auto">
          {syncingRole && (
            <div className="pointer-events-none absolute left-0 top-0 z-50 h-1 w-full overflow-hidden bg-pink-100 dark:bg-white/10">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />
            </div>
          )}

          <DashboardNavbar user={latestUser} />

          <main className="p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import { useEffect, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

// const getDashboardByRole = (role) => {
//   if (role === "admin") return "/dashboard/admin";
//   if (role === "trainer") return "/dashboard/trainer";
//   return "/dashboard/member";
// };

// export default function DashboardRoleWrapper({ initialUser, children }) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [latestUser, setLatestUser] = useState(initialUser);
//   const [syncingRole, setSyncingRole] = useState(false);

//   useEffect(() => {
//     const checkLatestRole = async () => {
//       try {
//         if (!initialUser?.id && !initialUser?.email) {
//           return;
//         }

//         setSyncingRole(true);

//         const queryParams = new URLSearchParams();

//         if (initialUser?.id) {
//           queryParams.set("id", initialUser.id);
//         }

//         if (initialUser?.email) {
//           queryParams.set("email", initialUser.email);
//         }

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/current?${queryParams.toString()}`,
//           {
//             method: "GET",
//             cache: "no-store",
//           },
//         );

//         const freshUser = await response.json();

//         if (!response.ok) {
//           return;
//         }

//         setLatestUser(freshUser);

//         if (freshUser?.status === "blocked") {
//           router.replace("/unauthorized");
//           return;
//         }

//         const targetDashboard = getDashboardByRole(freshUser?.role);
//         const isCorrectDashboard = pathname.startsWith(targetDashboard);

//         if (!isCorrectDashboard) {
//           router.replace(targetDashboard);
//         }
//       } catch (error) {
//         console.error("Dashboard role sync error:", error);
//       } finally {
//         setSyncingRole(false);
//       }
//     };

//     checkLatestRole();
//   }, [initialUser?.id, initialUser?.email, pathname, router]);

//   return (
//     <div className="flex h-screen bg-background">
//       <div className="flex flex-1 overflow-hidden">
//         <DashboardSideBar user={latestUser} />

//         <div className="relative flex-1 overflow-y-auto">
//           {syncingRole && (
//             <div className="pointer-events-none absolute left-0 top-0 z-50 h-1 w-full overflow-hidden bg-pink-100 dark:bg-white/10">
//               <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />
//             </div>
//           )}

//           <DashboardNavbar user={latestUser} />

//           <main className="p-5">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }
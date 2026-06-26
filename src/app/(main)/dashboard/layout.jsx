//=====dashboard layout er jonno add krrci cache problem er jonno

import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import DashboardRoleWrapper from "@/components/dashboard/DashboardRoleWrapper";

const DashboardLayout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user || null;

  return (
    <DashboardRoleWrapper initialUser={user}>
      {children}
    </DashboardRoleWrapper>
  );
};

export default DashboardLayout;



//=====orginal code=====

// import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
// import React from "react";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import DashboardSideBar from "@/components/dashboard/DashboardSideBar";
// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

// const DashboardLayout = async ({ children }) => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   const user = session?.user || null;

//   return (
//     <div className="flex h-screen bg-background">
//       <div className="flex flex-1 overflow-hidden">
//         <DashboardSideBar user={user} />
//         <div className="flex-1 overflow-y-auto">
//           <DashboardNavbar user={user} />

//           <main className="p-5">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

// import React from "react";
// import { requireRole } from "@/lib/core/session";

// const AdminLayout = async ({ children }) => {
//   await requireRole("admin");

//   return <>{children}</>;
// };

// export default AdminLayout;




import React from "react";
import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const AdminLayout = async ({ children }) => {
  await requireRole("admin");

  return <>{children}</>;
};

export default AdminLayout;
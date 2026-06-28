// import React from "react";
// import { requireRole } from "@/lib/core/session";

// const MemberLayout = async ({ children }) => {
//   await requireRole("member");

//   return <>{children}</>;
// };

// export default MemberLayout;



import React from "react";
import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MemberLayout = async ({ children }) => {
  await requireRole("member");

  return <>{children}</>;
};

export default MemberLayout;
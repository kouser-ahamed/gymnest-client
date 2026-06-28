// import React from "react";
// import { requireRole } from "@/lib/core/session";

// const TrainerLayout = async ({ children }) => {
//   await requireRole("trainer");

//   return <>{children}</>;
// };

// export default TrainerLayout;



import React from "react";
import { requireRole } from "@/lib/core/session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TrainerLayout = async ({ children }) => {
  await requireRole("trainer");

  return <>{children}</>;
};

export default TrainerLayout;
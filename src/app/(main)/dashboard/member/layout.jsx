import React from "react";
import { requireRole } from "@/lib/core/session";

const MemberLayout = async ({ children }) => {
  await requireRole("member");

  return <>{children}</>;
};

export default MemberLayout;
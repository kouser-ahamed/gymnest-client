import React from "react";
import { requireRole } from "@/lib/core/session";

const TrainerLayout = async ({ children }) => {
  await requireRole("trainer");

  return <>{children}</>;
};

export default TrainerLayout;
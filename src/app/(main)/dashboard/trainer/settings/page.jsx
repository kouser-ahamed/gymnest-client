import React from "react";
import SettingsView from "@/components/dashboard/settings/SettingsView";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Trainer Settings | GymNest",
  description: "Manage your trainer account profile, credentials, and settings on GymNest.",
};

const TrainerSettingsPage = async () => {
  const user = await getUserSession();
  return <SettingsView initialUser={user} role="trainer" />;
};

export default TrainerSettingsPage;

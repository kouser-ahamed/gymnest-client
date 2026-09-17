import React from "react";
import SettingsView from "@/components/dashboard/settings/SettingsView";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Admin Settings | GymNest",
  description: "Manage your administrator account settings, security, and profile on GymNest.",
};

const AdminSettingsPage = async () => {
  const user = await getUserSession();
  return <SettingsView initialUser={user} role="admin" />;
};

export default AdminSettingsPage;
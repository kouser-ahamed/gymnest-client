import React from "react";
import SettingsView from "@/components/dashboard/settings/SettingsView";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "Member Settings | GymNest",
  description: "Manage your member account profile, password, and email on GymNest.",
};

const MemberSettingsPage = async () => {
  const user = await getUserSession();
  return <SettingsView initialUser={user} role="member" />;
};

export default MemberSettingsPage;

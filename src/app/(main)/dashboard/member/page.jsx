import MemberOverview from "@/components/dashboard/member/MemberOverview";
import { getUserSession } from "@/lib/core/session";
import { getTokenServer } from "@/lib/getTokenServer";
import { redirect } from "next/navigation";
import React from "react";

const MemberDashboard = async () => {
  const user = await getUserSession();
  const token = await getTokenServer();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/member-overview?userId=${user?.id}&email=${user?.email}`,
    {
     method: "GET",
     cache: "no-store",
     headers: {
       Authorization: `Bearer ${token}`,
     },
   },

  );

  if (!response.ok) {
    return <div>Failed to load member dashboard.</div>;
  }

  const overviewData = await response.json();

  return <MemberOverview user={user} overviewData={overviewData} />;
};

export default MemberDashboard;
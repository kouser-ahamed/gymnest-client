import MemberOverview from "@/components/dashboard/member/MemberOverview";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";

const MemberDashboard = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/member-overview?userId=${user?.id}&email=${user?.email}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return <div>Failed to load member dashboard.</div>;
  }

  const overviewData = await response.json();

  return <MemberOverview user={user} overviewData={overviewData} />;
};

export default MemberDashboard;
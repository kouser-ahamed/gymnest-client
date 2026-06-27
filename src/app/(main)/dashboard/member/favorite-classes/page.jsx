import FavoriteClassesGrid from "@/components/dashboard/member/FavoriteClassesGrid";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";
import { getTokenServer } from "@/lib/getTokenServer";

const FavoriteClassesPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");

    
  }

  const token = await getTokenServer();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite-classes?userId=${user?.id}&email=${user?.email}`,
    {
     method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  }
  );

  if (!response.ok) {
    return <div>Failed to load favorite classes.</div>;
  }

  const favoriteClasses = await response.json();

  return <FavoriteClassesGrid favoriteClasses={favoriteClasses} user={user} />;
};

export default FavoriteClassesPage;

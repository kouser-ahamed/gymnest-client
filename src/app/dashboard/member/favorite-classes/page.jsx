import FavoriteClassesGrid from "@/components/dashboard/member/FavoriteClassesGrid";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";

const FavoriteClassesPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite-classes?userId=${user?.id}&email=${user?.email}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return <div>Failed to load favorite classes.</div>;
  }

  const favoriteClasses = await response.json();

  return <FavoriteClassesGrid favoriteClasses={favoriteClasses} user={user} />;
};

export default FavoriteClassesPage;

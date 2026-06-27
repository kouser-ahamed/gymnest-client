import BookedClassesTable from "@/components/dashboard/member/BookedClassesTable";
import { getUserSession } from "@/lib/core/session";
import { getTokenServer } from "@/lib/getTokenServer";
import { redirect } from "next/navigation";
import React from "react";

const BookedClassPage = async () => {
  const user = await getUserSession();
  const token = await getTokenServer();
  if (!user?.id) {
    redirect("/auth/signin");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/booking-classes?userId=${user?.id}&email=${user?.email}`,
    {
     method: "GET",
     cache: "no-store",
     headers: {
       authorization: `Bearer ${token}`,
     },
   },

  );

  if (!response.ok) {
    return <div>Failed to load booked classes.</div>;
  }

  const bookedClasses = await response.json();

  return <BookedClassesTable bookedClasses={bookedClasses} />;
};

export default BookedClassPage;
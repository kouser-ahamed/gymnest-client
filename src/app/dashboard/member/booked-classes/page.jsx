import BookedClassesTable from "@/components/dashboard/member/BookedClassesTable";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import React from "react";

const BookedClassPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/booking-classes?userId=${user?.id}&email=${user?.email}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return <div>Failed to load booked classes.</div>;
  }

  const bookedClasses = await response.json();

  return <BookedClassesTable bookedClasses={bookedClasses} />;
};

export default BookedClassPage;

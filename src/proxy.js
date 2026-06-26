import { NextResponse } from "next/server";
import { getUserSession } from "./lib/core/session";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers";

export async function proxy(request) {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

const session = await getUserSession();
console.log("session", session);

  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
//   matcher: ['/add-facility','/all-facilities/:path','/my-bookings','/manage-my-facilities'],

matcher: ['/all-classes/:path','/all-classes/:path/booking','/payment/success','/community-forum/:path','/dashboard/member',],
};
import { NextResponse } from "next/server";
import { getUserSession } from "./lib/core/session";
// import { auth } from "./lib/auth";
// import { headers } from "next/headers";

export async function proxy(request) {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  const session = await getUserSession();
  const pathname = request.nextUrl.pathname;

  console.log("session", session);

  if (!session) {
    // Dashboard er sob route login na thakle home page e jabe
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Baki protected route gula login page e jabe
    const loginUrl = new URL("/auth/signin", request.url);

    loginUrl.searchParams.set(
      "redirect",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ['/add-facility','/all-facilities/:path','/my-bookings','/manage-my-facilities'],

  matcher: [
    "/all-classes/:path",
    "/all-classes/:path/booking",
    "/payment/success",
    "/community-forum/:path",

    "/dashboard/member",
    "/dashboard/member/booked-classes",
    "/dashboard/member/apply-trainer",
    "/dashboard/member/favorite-classes",

    "/dashboard/trainer",
    "/dashboard/trainer/add-class",
    "/dashboard/trainer/my-classes",
    "/dashboard/trainer/add-forum",
    "/dashboard/trainer/my-posts",

    "/dashboard/admin",
    "/dashboard/admin/users",
    "/dashboard/admin/applied-trainers",
    "/dashboard/admin/trainers",
    "/dashboard/admin/classes",
    "/dashboard/admin/add-forum",
    "/dashboard/admin/transactions",
    "/dashboard/admin/forum-management",
    "/dashboard/admin/settings",
  ],
};

// import { NextResponse } from "next/server";
// import { getUserSession } from "./lib/core/session";
// // import { auth } from "./lib/auth";
// // import { headers } from "next/headers";

// export async function proxy(request) {
// //   const session = await auth.api.getSession({
// //     headers: await headers(),
// //   });

// const session = await getUserSession();
// console.log("session", session);

//   if (!session) {
//     return NextResponse.redirect(new URL("/auth/signin", request.url));
//   }
// }

// export const config = {
// //   matcher: ['/add-facility','/all-facilities/:path','/my-bookings','/manage-my-facilities'],

// matcher: ['/all-classes/:path','/all-classes/:path/booking','/payment/success','/community-forum/:path','/dashboard/member','/dashboard/member/booked-classes','/dashboard/member/apply-trainer','/dashboard/member/favorite-classes','/dashboard/trainer','/dashboard/trainer/add-class','/dashboard/trainer/my-classes','/dashboard/trainer/add-forum','/dashboard/trainer/my-posts','/dashboard/admin','/dashboard/admin/users','/dashboard/admin/applied-trainers','/dashboard/admin/trainers','/dashboard/admin/classes','/dashboard/admin/add-forum','/dashboard/admin/transactions','/dashboard/admin/forum-management','/dashboard/admin/settings'],
// };

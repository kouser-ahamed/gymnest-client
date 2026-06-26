// //===jwt cache problem er jonno add krrci


// import { NextResponse } from "next/server";
// import { getUserSession } from "./lib/core/session";

// const getDashboardByRole = (role) => {
//   if (role === "admin") return "/dashboard/admin";
//   if (role === "trainer") return "/dashboard/trainer";
//   return "/dashboard/member";
// };

// export async function proxy(request) {
//   const session = await getUserSession();
//   const pathname = request.nextUrl.pathname;

//   if (!session) {
//     // Dashboard er sob route login na thakle home page e jabe
//     if (pathname.startsWith("/dashboard")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     // Baki protected route gula login page e jabe
//     const loginUrl = new URL("/auth/signin", request.url);

//     loginUrl.searchParams.set(
//       "redirect",
//       request.nextUrl.pathname + request.nextUrl.search,
//     );

//     return NextResponse.redirect(loginUrl);
//   }

//   const sessionUser = session?.user || session;

//   // Dashboard role auto check
//   if (pathname.startsWith("/dashboard")) {
//     try {
//       const queryParams = new URLSearchParams();

//       if (sessionUser?.id) {
//         queryParams.set("id", sessionUser.id);
//       }

//       if (sessionUser?.email) {
//         queryParams.set("email", sessionUser.email);
//       }

//       if (!queryParams.toString()) {
//         return NextResponse.redirect(new URL("/", request.url));
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/current?${queryParams.toString()}`,
//         {
//           method: "GET",
//           cache: "no-store",
//         },
//       );

//       if (!response.ok) {
//         return NextResponse.redirect(new URL("/", request.url));
//       }

//       const freshUser = await response.json();

//       if (freshUser?.status === "blocked") {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }

//       const targetDashboard = getDashboardByRole(freshUser?.role);

//       if (!pathname.startsWith(targetDashboard)) {
//         return NextResponse.redirect(new URL(targetDashboard, request.url));
//       }
//     } catch (error) {
//       console.error("Proxy dashboard role check error:", error);

//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/all-classes/:path",
//     "/all-classes/:path/booking",
//     "/payment/success",
//     "/community-forum/:path",

//     "/dashboard/member",
//     "/dashboard/member/booked-classes",
//     "/dashboard/member/apply-trainer",
//     "/dashboard/member/favorite-classes",

//     "/dashboard/trainer",
//     "/dashboard/trainer/add-class",
//     "/dashboard/trainer/my-classes",
//     "/dashboard/trainer/add-forum",
//     "/dashboard/trainer/my-posts",

//     "/dashboard/admin",
//     "/dashboard/admin/users",
//     "/dashboard/admin/applied-trainers",
//     "/dashboard/admin/trainers",
//     "/dashboard/admin/classes",
//     "/dashboard/admin/add-forum",
//     "/dashboard/admin/transactions",
//     "/dashboard/admin/forum-management",
//     "/dashboard/admin/settings",

//     // Extra safety
//     "/dashboard",
//     "/dashboard/:path*",
//   ],
// };














//====problem er jonno add krrci

// import { NextResponse } from "next/server";
// import { getUserSession } from "./lib/core/session";

// const getDashboardByRole = (role) => {
//   if (role === "admin") return "/dashboard/admin";
//   if (role === "trainer") return "/dashboard/trainer";
//   return "/dashboard/member";
// };

// export async function proxy(request) {
//   const session = await getUserSession();
//   const pathname = request.nextUrl.pathname;

//   if (!session) {
//     // Dashboard er sob route login na thakle home page e jabe
//     if (pathname.startsWith("/dashboard")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     // Baki protected route gula login page e jabe
//     const loginUrl = new URL("/auth/signin", request.url);

//     loginUrl.searchParams.set(
//       "redirect",
//       request.nextUrl.pathname + request.nextUrl.search,
//     );

//     return NextResponse.redirect(loginUrl);
//   }

//   const sessionUser = session?.user || session;

//   // Dashboard role auto check
//   if (pathname.startsWith("/dashboard")) {
//     try {
//       const queryParams = new URLSearchParams();

//       if (sessionUser?.id) {
//         queryParams.set("id", sessionUser.id);
//       }

//       if (sessionUser?.email) {
//         queryParams.set("email", sessionUser.email);
//       }

//       if (!queryParams.toString()) {
//         return NextResponse.redirect(new URL("/", request.url));
//       }

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/current?${queryParams.toString()}`,
//         {
//           method: "GET",
//           cache: "no-store",
//         },
//       );

//       if (!response.ok) {
//         return NextResponse.redirect(new URL("/", request.url));
//       }

//       const freshUser = await response.json();

//       if (freshUser?.status === "blocked") {
//         return NextResponse.redirect(new URL("/unauthorized", request.url));
//       }

//       const targetDashboard = getDashboardByRole(freshUser?.role);

//       if (!pathname.startsWith(targetDashboard)) {
//         return NextResponse.redirect(new URL(targetDashboard, request.url));
//       }
//     } catch (error) {
//       console.error("Proxy dashboard role check error:", error);

//       return NextResponse.redirect(new URL("/unauthorized", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/all-classes/:path",
//     "/all-classes/:path/booking",
//     "/payment/success",
//     "/community-forum/:path",

//     "/dashboard/member",
//     "/dashboard/member/booked-classes",
//     "/dashboard/member/apply-trainer",
//     "/dashboard/member/favorite-classes",

//     "/dashboard/trainer",
//     "/dashboard/trainer/add-class",
//     "/dashboard/trainer/my-classes",
//     "/dashboard/trainer/add-forum",
//     "/dashboard/trainer/my-posts",

//     "/dashboard/admin",
//     "/dashboard/admin/users",
//     "/dashboard/admin/applied-trainers",
//     "/dashboard/admin/trainers",
//     "/dashboard/admin/classes",
//     "/dashboard/admin/add-forum",
//     "/dashboard/admin/transactions",
//     "/dashboard/admin/forum-management",
//     "/dashboard/admin/settings",

//     // Extra safety: dashboard er future/new route gulo private thakbe
//     "/dashboard/:path*",
//   ],
// };



//============2nd old main code=================


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














//=================old code=================

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

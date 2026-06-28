// import { headers } from "next/headers";
// import { auth } from "../auth";
// import { redirect } from "next/navigation";


// // server side function to get the user session
// export const getUserSession = async () => {
//     const session = await auth.api.getSession({
//         headers: await headers(),
//     });

//     return session?.user || null;
// }

// export const requireRole = async(role)=> {
//     const user = await getUserSession();

//     if(user.role !== role) {
//        return redirect("/unauthorized");
//     }

    

// }




///====================New Code==================== 27/06/2024



// import { headers } from "next/headers";
// import { auth } from "../auth";
// import { redirect } from "next/navigation";
// import { unstable_noStore as noStore } from "next/cache";
// import { getTokenServer } from "../getTokenServer";

// // server side function to get fresh user session from database
// export const getUserSession = async () => {
//   noStore();

//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     const sessionUser = session?.user || null;

//     if (!sessionUser?.id && !sessionUser?.email) {
//       return null;
//     }

//     const token = await getTokenServer();

//     if (!token) {
//       return sessionUser;
//     }

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/current`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         cache: "no-store",
//         next: {
//           revalidate: 0,
//         },
//       },
//     );

//     if (!response.ok) {
//       return sessionUser;
//     }

//     const freshUser = await response.json();

//     return {
//       ...sessionUser,
//       ...freshUser,
//       id: freshUser?.id || freshUser?._id || sessionUser?.id,
//       _id: freshUser?._id || freshUser?.id || sessionUser?.id,
//       role: freshUser?.role || sessionUser?.role || "member",
//       status: freshUser?.status || sessionUser?.status || "active",
//     };
//   } catch (error) {
//     return null;
//   }
// };

// export const requireRole = async (role) => {
//   const user = await getUserSession();

//   if (!user?.id) {
//     redirect("/auth/signin");
//   }

//   if (user?.status === "blocked") {
//     redirect("/unauthorized");
//   }

//   if (user?.role !== role) {
//     if (["admin", "trainer", "member"].includes(user?.role)) {
//       redirect(`/dashboard/${user.role}`);
//     }

//     redirect("/unauthorized");
//   }

//   return user;
// };





//====================New Code==================== 27/06/2024

import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { getTokenServer } from "../getTokenServer";

// server side function to get fresh user from database
export const getUserSession = async () => {
  noStore();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const sessionUser = session?.user || null;

    if (!sessionUser?.id && !sessionUser?.email) {
      return null;
    }

    const token = await getTokenServer();

    if (!token) {
      return sessionUser;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/current`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
        cache: "no-store",
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      return sessionUser;
    }

    const freshUser = await response.json();

    return {
      ...sessionUser,
      ...freshUser,
      id: freshUser?.id || freshUser?._id || sessionUser?.id,
      _id: freshUser?._id || freshUser?.id || sessionUser?.id,
      role: freshUser?.role || sessionUser?.role || "member",
      status: freshUser?.status || sessionUser?.status || "active",
    };
  } catch (error) {
    return null;
  }
};

export const requireRole = async (role) => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  if (user?.role !== role) {
    if (["admin", "trainer", "member"].includes(user?.role)) {
      redirect(`/dashboard/${user.role}`);
    }

    redirect("/unauthorized");
  }

  return user;
};
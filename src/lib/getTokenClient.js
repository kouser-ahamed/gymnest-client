// "use client";

// import { authClient } from "@/lib/auth-client";

// export const getTokenClient = async () => {
//   const token = await authClient.token();
//   if (!token) {
//     return null;
//   }
//   return token;
// };

//== main




//====new code





"use client";

import { authClient } from "@/lib/auth-client";

export const getTokenClient = async () => {
  try {
    const result = await authClient.token();

    if (!result?.data?.token) {
      return {
        data: null,
        error: result?.error || null,
      };
    }

    return {
      data: result.data,
      error: null,
    };
  } catch (error) {
    console.error("Get token client error:", error);

    return {
      data: null,
      error,
    };
  }
};







// import { authClient } from "@/lib/auth-client";

// export const getSessionClient = async () => {
//   const { data: session, error } = await authClient.getSession();

//   if (error) {
//     return null;
//   }

//   return session || null;
// };

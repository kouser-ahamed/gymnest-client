// import { headers } from "next/headers";
// import { auth } from "./auth";

// export const getTokenServer = async () => {
//   const { token } = await auth.api.getToken({
//     headers: await headers(),
//   });
//   return token || null;
// };






//=========Nwe Code====================



import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenServer = async () => {
  try {
    const result = await auth.api.getToken({
      headers: await headers(),
    });

    return result?.token || null;
  } catch (error) {
    console.error("Get token server error:", error);
    return null;
  }
};
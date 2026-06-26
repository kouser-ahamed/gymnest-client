"use client";

import { authClient } from "@/lib/auth-client";

export const getTokenClient = async () => {
  const token = await authClient.token();
  if (!token) {
    return null;
  }
  return token;
};

// import { authClient } from "@/lib/auth-client";

// export const getSessionClient = async () => {
//   const { data: session, error } = await authClient.getSession();

//   if (error) {
//     return null;
//   }

//   return session || null;
// };

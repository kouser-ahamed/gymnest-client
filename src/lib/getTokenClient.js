"use client";

import { authClient } from "@/lib/auth-client";

export const getSessionClient = async () => {
  const { data: session, error } = await authClient.getSession();

  if (error) {
    return null;
  }

  return session || null;
};
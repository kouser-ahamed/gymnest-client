import { headers } from "next/headers";
import { auth } from "../auth";


// server side function to get the user session
export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user || null;
}
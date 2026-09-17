import { getUserSession } from "@/lib/core/session";
import { getDashboardRouteByRole } from "@/lib/demoMode";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardRootPage() {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const role = user?.role || "member";
  redirect(getDashboardRouteByRole(role));
}

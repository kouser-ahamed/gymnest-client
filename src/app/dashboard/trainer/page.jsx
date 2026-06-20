"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import TrainerOverview from "@/components/dashboard/TrainerOverview";

const TrainerDashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const user = session?.user || null;

  return (
    <div>
      <TrainerOverview user={user} />
    </div>
  );
};

export default TrainerDashboardPage;
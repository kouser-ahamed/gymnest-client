"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { BookOpen, PersonPlus, Comment } from "@gravity-ui/icons";
import TrainerOverview from "@/components/dashboard/trainer/TrainerOverview";

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

  const trainerStats = [
    {
      title: "Total Classes Created",
      value: 5,
      icon: BookOpen,
      iconBox: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
      glow: "hover:border-fuchsia-500/40",
    },
    {
      title: "Total Students Enrolled",
      value: 2,
      icon: PersonPlus,
      iconBox: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
      glow: "hover:border-pink-500/40",
    },
    {
      title: "Forum Posts",
      value: 3,
      icon: Comment,
      iconBox: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      glow: "hover:border-orange-500/40",
    },
  ];

  const user = session?.user || null;

  return (
    <div>
      <TrainerOverview user={user} trainerStats={trainerStats} />
    </div>
  );
};

export default TrainerDashboardPage;

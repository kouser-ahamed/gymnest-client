"use client";

import { Card } from "@heroui/react";
import {
  BookOpen,
  PersonPlus,
  Comment,
  ShieldCheck,
} from "@gravity-ui/icons";
import Image from "next/image";

const TrainerOverview = ({ user }) => {
  const stats = [
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

  return (
    <section className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className={`border border-slate-200 bg-white shadow-sm transition dark:border-white/10 dark:bg-[#101624] ${item.glow}`}
            >
              <div className="flex items-center gap-4 p-5">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBox}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </h2>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.title}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Profile Details */}
      <Card className="border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Profile Details
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Trainer account information
              </p>
            </div>

            {/* Trainer Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
              <ShieldCheck className="h-4 w-4" />
              Trainer
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-[#070b14] sm:flex-row sm:text-left">
            <Image
              src={user?.image || "/assets/default-user.png"}
              alt={user?.name || "Trainer"}
              width={88}
              height={88}
              className="h-[88px] w-[88px] rounded-full border-2 border-pink-500 object-cover"
            />

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {user?.name || "Trainer Name"}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {user?.email || "trainer@example.com"}
              </p>

              <div className="mt-3 inline-flex rounded-full bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-400">
                Trainer Profile
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default TrainerOverview;
"use client";

import { Card } from "@heroui/react";
import { ShieldCheck, Calendar } from "@gravity-ui/icons";
import Image from "next/image";

const TrainerOverview = ({ user, trainerStats }) => {
  return (
    <section className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {trainerStats.map((item) => {
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-[#070b14]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Profile Info */}
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={88}
                    height={88}
                    className="h-[88px] w-[88px] rounded-xl border-2 border-pink-500 object-cover"
                  />
                ) : (
                  <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-3xl font-bold text-white">
                    {avatarLetter}
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {user?.name || "Trainer Name"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {user?.email || "trainer@example.com"}
                  </p>
                </div>
              </div>

              {/* Right Account Created Date */}
              <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#101624] lg:w-[260px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Calendar className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Account Created
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            timeZone: "Asia/Dhaka",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default TrainerOverview;

"use client";

import Link from "next/link";
import { Card } from "@heroui/react";
import {
  Calendar,
  CircleCheck,
  CircleXmark,
  Clock,
  DatabaseMagnifier,
  Heart,
  PersonWorker,
  Star,
} from "@gravity-ui/icons";

const getStatusStyle = (status) => {
  if (status === "Approved") {
    return {
      icon: <CircleCheck className="h-5 w-5" />,
      badge:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      title: "Approved",
    };
  }

  if (status === "Rejected") {
    return {
      icon: <CircleXmark className="h-5 w-5" />,
      badge:
        "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      title: "Rejected",
    };
  }

  if (status === "Demoted" || status === "Demote") {
    return {
      icon: <CircleXmark className="h-5 w-5" />,
      badge:
        "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      title: "Demoted",
    };
  }

  return {
    icon: <Clock className="h-5 w-5" />,
    badge:
      "border-orange-400/20 bg-orange-400/10 text-orange-600 dark:text-orange-300",
    title: "Pending",
  };
};

const formatSchedule = (schedule) => {
  if (!schedule) return "Schedule not added";

  if (typeof schedule === "string") return schedule;

  const days = Array.isArray(schedule?.days) ? schedule.days.join(", ") : "";
  const time = schedule?.time || "";

  if (days && time) return `${days} at ${time}`;
  if (days) return days;
  if (time) return time;

  return "Schedule not added";
};

const StatCard = ({ icon, label, value, hint }) => {
  return (
    <Card className="relative overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-pink-500/15 blur-2xl" />

      <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/15 via-pink-500/15 to-orange-400/15 text-pink-500 dark:text-pink-300">
          {icon}
        </div>

        <div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {label}
          </p>

          {hint && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hint}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

const MemberOverview = ({ user, overviewData }) => {
  const {
    totalBookedClasses = 0,
    totalFavorites = 0,
    trainerApplication,
    recentBookings = [],
  } = overviewData || {};

  const applicationStatus = trainerApplication?.status || "Not Applied";
  const statusStyle = getStatusStyle(applicationStatus);

  const feedback =
    trainerApplication?.feedback ||
    trainerApplication?.demoteFeedback ||
    trainerApplication?.adminFeedback ||
    trainerApplication?.rejectionReason ||
    "";

  const isRejected = applicationStatus === "Rejected";
  const isDemoted =
    applicationStatus === "Demoted" || applicationStatus === "Demote";

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
            Member Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Track your booked classes, favorites, profile details, and trainer
            application status from one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label="Booked Classes"
          value={totalBookedClasses}
          hint="Paid class bookings"
        />

        <StatCard
          icon={<Heart className="h-6 w-6" />}
          label="Favorites"
          value={totalFavorites}
          hint="Saved classes"
        />

        <StatCard
          icon={<Star className="h-6 w-6" />}
          label="Role"
          value={user?.role || "member"}
          hint="Current account role"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[2rem] border border-slate-200 bg-white p-5 text-center shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6 sm:text-left">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
              Profile
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              Your Information
            </h2>
          </div>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-pink-500/20 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-pink-500">
                  <PersonWorker className="h-9 w-9" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="break-words text-xl font-black text-slate-900 dark:text-white">
                {user?.name || "User"}
              </h3>

              <p className="mt-1 break-all text-sm font-semibold text-slate-500 dark:text-slate-400">
                {user?.email || "No email"}
              </p>

              <div className="mx-auto mt-3 w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-pink-600 dark:text-pink-300 sm:mx-0">
                {user?.role || "member"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-slate-200 bg-white p-5 text-center shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6 sm:text-left">
          <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
                Trainer Application
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                Application Status
              </h2>
            </div>

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] ${statusStyle.badge}`}
            >
              {statusStyle.icon}
              {statusStyle.title}
            </div>
          </div>

          {trainerApplication?._id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-[#070b14] sm:text-left">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Specialty
                  </p>

                  <p className="mt-1 break-words font-black text-slate-900 dark:text-white">
                    {trainerApplication?.specialty || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-[#070b14] sm:text-left">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Experience
                  </p>

                  <p className="mt-1 font-black text-slate-900 dark:text-white">
                    {trainerApplication?.experience || 0} Years
                  </p>
                </div>
              </div>

              {(isRejected || isDemoted) && feedback && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center sm:text-left">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-red-600 dark:text-red-300">
                    {isDemoted ? "Demote Feedback" : "Admin Feedback"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-300">
                    {feedback}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-white/10 dark:bg-[#070b14]">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                You have not applied as a trainer yet.
              </p>
            </div>
          )}
        </Card>
      </div>

      <Card className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
              Recent Bookings
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              Latest Booked Classes
            </h2>
          </div>

          <Link
            href="/dashboard/member/booked-classes"
            className="w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-xs font-black text-pink-600 transition hover:bg-pink-500/15 dark:text-pink-300"
          >
            View All
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-center dark:border-white/10 dark:bg-[#070b14]">
            <div>
              <DatabaseMagnifier className="mx-auto mb-3 h-10 w-10 text-pink-500" />

              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                No recent bookings found.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((item) => (
              <Link
                key={item?._id?.toString?.() || item?.classId}
                href={`/all-classes/${item?.classId}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:-translate-y-0.5 hover:border-pink-500/30 hover:bg-pink-500/5 dark:border-white/10 dark:bg-[#070b14] dark:hover:bg-pink-500/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-200 dark:bg-[#101624] sm:h-14 sm:w-14">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.className || "Class"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-pink-500">
                        <Star className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="break-words font-black text-slate-900 dark:text-white sm:truncate">
                      {item?.className || "Class Name"}
                    </p>

                    <p className="mt-1 break-words text-xs font-semibold text-slate-500 dark:text-slate-400 sm:truncate">
                      {item?.trainerName || "Trainer"} •{" "}
                      {formatSchedule(item?.schedule)}
                    </p>
                  </div>
                </div>

                <p className="shrink-0 text-sm font-black text-orange-500 dark:text-orange-300">
                  ${item?.price || 0}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
};

export default MemberOverview;
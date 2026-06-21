"use client";

import React from "react";
import { Button, Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CircleDollar,
  Clock,
  PersonWorker,
  DatabaseMagnifier,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getBookingCount = (item) => {
  if (typeof item?.bookingCount === "number") return item.bookingCount;
  if (typeof item?.totalBookings === "number") return item.totalBookings;
  if (Array.isArray(item?.bookings)) return item.bookings.length;
  if (Array.isArray(item?.bookedUsers)) return item.bookedUsers.length;
  if (Array.isArray(item?.students)) return item.students.length;
  if (Array.isArray(item?.enrolledStudents)) return item.enrolledStudents.length;

  return 0;
};

const getDifficultyClass = (difficulty) => {
  const value = difficulty?.toLowerCase();

  if (value === "beginner") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (value === "intermediate") {
    return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-300";
  }

  return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
};

const ClassCard = ({ classItem }) => {
  const classId = getClassId(classItem);
  const bookingCount = getBookingCount(classItem);

  const {
    className,
    image,
    category,
    difficultyLevel,
    duration,
    schedule,
    price,
    description,
    trainerName,
  } = classItem || {};

  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624] dark:hover:shadow-pink-500/20">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-[#070b14]">
        {image ? (
          <Image
            src={image}
            alt={className || "Class image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pink-500">
            <DatabaseMagnifier className="h-12 w-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
            {category || "Fitness"}
          </span>
        </div>

        {/* Price */}
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-3 py-1 text-xs font-black text-slate-950 shadow-lg shadow-lime-500/20">
            <CircleDollar className="h-4 w-4" />
            {price || 0}
          </span>
        </div>

        {/* Trainer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-white backdrop-blur">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lime-300">
              <PersonWorker className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-white/60">by Trainer</p>
              <p className="truncate text-sm font-bold">
                {trainerName || "Trainer Name"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card.Header className="p-5 pb-0">
        <div className="w-full space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Card.Title className="line-clamp-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {className || "Class Name"}
              </Card.Title>

              <Card.Description className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description || "No description available."}
              </Card.Description>
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold capitalize ${getDifficultyClass(
                difficultyLevel
              )}`}
            >
              {difficultyLevel || "Beginner"}
            </span>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14]">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 text-pink-500" />
              Duration
            </div>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {duration || 0} mins
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14]">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <PersonWorker className="h-4 w-4 text-pink-500" />
              Booked
            </div>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {bookingCount} students
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-pink-50/40 p-4 dark:border-white/10 dark:from-[#070b14] dark:via-[#070b14] dark:to-pink-500/5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 text-pink-500" />
            Schedule
          </div>

          <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
            {schedule?.days?.join(", ") || "No days"} at{" "}
            {schedule?.time || "No time"}
          </p>
        </div>
      </Card.Content>

      <Card.Footer className="border-t border-slate-200 p-5 dark:border-white/10">
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Price
            </p>

            <p className="mt-1 flex items-center gap-1 text-2xl font-black text-lime-600 dark:text-lime-400">
              <CircleDollar className="h-5 w-5" />
              {price || 0}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                /session
              </span>
            </p>
          </div>

          <Link href={`/classes/${classId}`} className="shrink-0">
            <Button className="h-11 rounded-full border border-lime-500/20 bg-lime-500/10 px-5 text-sm font-bold text-lime-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-lime-500/20 dark:text-lime-300">
              View Details
              <ArrowRightFromSquare className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
};

const ClassesGrid = ({ classes = [] }) => {
  const sortedClasses = [...classes].sort(
    (a, b) => getBookingCount(b) - getBookingCount(a)
  );

  return (
    <section className="space-y-6">
      {sortedClasses.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#101624]">
          <DatabaseMagnifier className="mb-4 h-12 w-12 text-pink-500" />

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No classes found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No fitness classes are available right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedClasses.map((item) => (
            <ClassCard key={getClassId(item)} classItem={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ClassesGrid;
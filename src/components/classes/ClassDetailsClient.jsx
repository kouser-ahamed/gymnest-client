"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Calendar,
  CircleDollar,
  Clock,
  Heart,
  PersonWorker,
  Star,
  Tag,
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
    return "border-pink-500/20 bg-pink-500/10 text-pink-500 dark:text-pink-300";
  }

  if (value === "intermediate") {
    return "border-orange-400/25 bg-orange-400/10 text-orange-500 dark:text-orange-300";
  }

  if (value === "advanced") {
    return "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-500 dark:text-fuchsia-300";
  }

  return "border-slate-400/20 bg-slate-400/10 text-slate-300";
};

const DetailCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/15 via-pink-500/15 to-orange-400/15 text-pink-500 dark:text-pink-300">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 truncate text-base font-black text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const ScheduleDays = ({ days = [] }) => {
  return (
    <div className="rounded-[1.7rem] border border-pink-500/25 bg-pink-500/10 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-pink-500 dark:text-pink-300" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-600 dark:text-pink-300">
          Training Days
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {days.length > 0 ? (
          days.map((day) => (
            <span
              key={day}
              className="rounded-full border border-pink-500/30 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm shadow-pink-500/20"
            >
              {day}
            </span>
          ))
        ) : (
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            No days selected
          </span>
        )}
      </div>
    </div>
  );
};

const ClassDetailsClient = ({ classDetails }) => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const classId = getClassId(classDetails);
  const bookingCount = getBookingCount(classDetails);

  const [isBooked, setIsBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
  } = classDetails || {};

  const handleBookNow = () => {
    if (!user?.id) {
      toast.error("Please login first to book this class.");
      router.push(`/login?redirect=/classes/${classId}`);
      return;
    }

    if (isBooked) {
      toast.error("You have already booked this class.");
      return;
    }

    router.push(`/payment/${classId}`);
  };

  const handleAddFavorite = () => {
    if (!user?.id) {
      toast.error("Please login first to add favorite.");
      router.push(`/login?redirect=/classes/${classId}`);
      return;
    }

    if (isFavorite) {
      toast.error("This class is already saved to your favorites.");
      return;
    }

    setIsFavorite(true);
    toast.success("Successfully added to your favorites!");
  };

  if (!classDetails) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-10">
        <Card className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-[#101624]">
          <DatabaseMagnifier className="mx-auto mb-4 h-12 w-12 text-pink-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Class not found
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            The class details could not be loaded.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen overflow-hidden bg-white px-4 py-8 dark:bg-[#050914] sm:px-6 lg:px-8">
      <ToastContainer />

      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-[520px] h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />

        <button
          type="button"
          onClick={() => router.back()}
          className="relative z-10 mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-500/30 hover:text-pink-600 dark:border-white/10 dark:bg-[#101624] dark:text-slate-300 dark:hover:text-pink-300"
        >
          ← Back
        </button>

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_430px]">
          <Card className="rounded-[2.2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
            <div className="relative h-[360px] w-full overflow-hidden rounded-[1.8rem] bg-slate-100 dark:bg-[#070b14] sm:h-[500px] lg:h-[620px]">
              {image ? (
                <Image
                  src={image}
                  alt={className || "Class image"}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-pink-500">
                  <Star className="h-16 w-16" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050914]/70 via-transparent to-transparent" />

              <div className="absolute left-5 top-5 flex flex-wrap gap-3 sm:left-8 sm:top-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-pink-500/20">
                  <Tag className="h-4 w-4" />
                  {category || "Fitness"}
                </span>

                <span
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] backdrop-blur ${getDifficultyClass(
                    difficultyLevel
                  )}`}
                >
                  {difficultyLevel || "Beginner"}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                  <PersonWorker className="h-4 w-4 text-pink-300" />
                  by {trainerName || "Trainer"}
                </p>

                <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {className || "Class Name"}
                </h1>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[2rem] border border-pink-500/25 bg-gradient-to-br from-fuchsia-500/20 via-pink-500/10 to-orange-400/10 p-6">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Price per session
              </p>

              <div className="mt-2 flex items-end gap-2">
                <p className="flex items-center text-6xl font-black text-pink-500 dark:text-pink-300">
                  <CircleDollar className="mr-1 h-10 w-10" />
                  {price || 0}
                </p>
                <span className="pb-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                  /session
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Booked
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {bookingCount}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  students
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Duration
                </p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  {duration || 0}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  minutes
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <ScheduleDays days={schedule?.days || []} />

              <div className="rounded-[1.7rem] border border-orange-400/25 bg-orange-400/10 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500 dark:text-orange-300" />
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600 dark:text-orange-300">
                    Class Time
                  </p>
                </div>

                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {schedule?.time || "No time"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button
                onClick={handleBookNow}
                disabled={isPending || isBooked}
                className={`h-12 w-full rounded-full text-sm font-black text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${
                  isBooked
                    ? "bg-slate-400"
                    : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 shadow-pink-500/20"
                }`}
              >
                {isPending
                  ? "Loading..."
                  : isBooked
                  ? "Already Booked"
                  : `Book Now - $${price || 0}`}
                {!isBooked && <ArrowRightFromSquare className="ml-2 h-4 w-4" />}
              </Button>

              <Button
                onClick={handleAddFavorite}
                disabled={isPending || isFavorite}
                className={`h-12 w-full rounded-full border text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                  isFavorite
                    ? "border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-300"
                    : "border-pink-500/20 bg-pink-500/10 text-pink-600 hover:bg-pink-500/15 dark:text-pink-300"
                }`}
              >
                <Heart className="mr-2 h-4 w-4" />
                {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </Card>
        </div>

        <div className="relative z-10 mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Card className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#101624] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white">
                <DatabaseMagnifier className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
                  About This Class
                </p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Full Description
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
              {description || "No description available."}
            </p>
          </Card>

          <Card className="rounded-[2.2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#101624] sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
                Class Details
              </p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Complete Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailCard
                icon={<Clock className="h-5 w-5" />}
                label="Duration"
                value={`${duration || 0} mins`}
              />

              <DetailCard
                icon={<Calendar className="h-5 w-5" />}
                label="Days"
                value={schedule?.days?.join(", ") || "No days"}
              />

              <DetailCard
                icon={<Clock className="h-5 w-5" />}
                label="Time"
                value={schedule?.time || "No time"}
              />

              <DetailCard
                icon={<PersonWorker className="h-5 w-5" />}
                label="Booked"
                value={`${bookingCount} students`}
              />

              <DetailCard
                icon={<Tag className="h-5 w-5" />}
                label="Category"
                value={category || "Fitness"}
              />

              <DetailCard
                icon={<Star className="h-5 w-5" />}
                label="Difficulty"
                value={difficultyLevel || "Beginner"}
              />

              <DetailCard
                icon={<PersonWorker className="h-5 w-5" />}
                label="Trainer"
                value={trainerName || "Trainer"}
              />

              <DetailCard
                icon={<CircleDollar className="h-5 w-5" />}
                label="Price"
                value={`$${price || 0} /session`}
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ClassDetailsClient;
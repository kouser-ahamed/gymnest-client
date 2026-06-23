"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import {
  Calendar,
  CircleDollar,
  Clock,
  CreditCard,
  PersonWorker,
  ShieldCheck,
  Tag,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const ClassBookingPayment = ({ classDetails, user }) => {
  const classId = getClassId(classDetails);

  const {
    className,
    image,
    category,
    difficultyLevel,
    duration,
    schedule,
    price,
    trainerName,
  } = classDetails || {};

  if (!classDetails) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg rounded-[2rem] border border-pink-500/20 bg-white p-8 text-center shadow-xl shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624]">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Booking data not found
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Please go back and select a class again.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-4 py-10 dark:bg-[#050914] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/all-classes/${classId}`}
          className="inline-flex items-center text-sm font-bold text-slate-500 transition hover:text-pink-500 dark:text-slate-400 dark:hover:text-pink-300"
        >
          ← Back to Class
        </Link>

        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
            Booking Checkout
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Complete Your Booking
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Review your class and continue to secure checkout.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Class Summary */}
          <Card className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
            <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
              {/* Image */}
              <div className="relative h-72 overflow-hidden rounded-[1.6rem] bg-slate-100 dark:bg-[#070b14] md:h-full md:min-h-[420px]">
                {image ? (
                  <Image
                    src={image}
                    alt={className || "Class image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-pink-500">
                    <Tag className="h-16 w-16" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/85 via-transparent to-transparent" />

                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-pink-500/20">
                    {category || "Fitness"}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                    <h2 className="line-clamp-2 text-2xl font-black text-white">
                      {className || "Class Name"}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                      <PersonWorker className="h-4 w-4 text-pink-300" />
                      {trainerName || "Trainer"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Details Only */}
              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-pink-600 dark:text-pink-300">
                    {difficultyLevel || "Beginner"}
                  </span>

                  <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-orange-600 dark:text-orange-300">
                    {duration || 0} mins
                  </span>
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
                  Booking Summary
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4 text-pink-500" />
                      Class Days
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {schedule?.days?.length > 0 ? (
                        schedule.days.map((day) => (
                          <span
                            key={day}
                            className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1.5 text-xs font-black text-white"
                          >
                            {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                          No days
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-orange-600 dark:text-orange-300">
                        <Clock className="h-4 w-4" />
                        Time
                      </div>

                      <p className="mt-3 text-xl font-black text-slate-900 dark:text-white">
                        {schedule?.time || "No time"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-pink-600 dark:text-pink-300">
                        <CircleDollar className="h-4 w-4" />
                        Total Due
                      </div>

                      <p className="mt-3 text-xl font-black text-slate-900 dark:text-white">
                        ${price || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Short Card */}
          <Card className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] lg:h-fit">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500 dark:text-pink-300">
                  Payment
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                  Checkout
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-500 dark:text-pink-300">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-pink-500/25 bg-gradient-to-br from-fuchsia-500/20 via-pink-500/10 to-orange-400/10 p-6">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Total Amount
              </p>

              <p className="mt-2 flex items-center text-6xl font-black text-pink-500 dark:text-pink-300">
                <CircleDollar className="mr-1 h-10 w-10" />
                {price || 0}
              </p>
            </div>
            <form action="/api/payment" method="POST">
              <input type="hidden" name="price" defaultValue={price || 0} />
              <input
                type="hidden"
                name="className"
                defaultValue={className || ""}
              />
              <input
                type="hidden"
                name="classId"
                defaultValue={classId || ""}
              />

              <Button
                type="submit"
                className="mt-7 h-12 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRightFromSquare className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-5 flex gap-3 rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-orange-500 dark:text-orange-300" />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Secure checkout powered by Stripe. Your payment information is
                not stored by GymNest.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ClassBookingPayment;

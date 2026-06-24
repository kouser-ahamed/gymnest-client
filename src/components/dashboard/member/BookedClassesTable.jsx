"use client";

import Link from "next/link";
import { Button, Card, Table } from "@heroui/react";
import { Calendar, Eye, PersonWorker, Star } from "@gravity-ui/icons";

const getItemId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.() || item?.transactionId || item?.classId;
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

const BookedClassMobileCard = ({ item }) => {
  return (
    <Card className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624]">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-pink-500/20 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-500 dark:text-pink-300">
          <Star className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-500 dark:text-pink-300">
            Class Name
          </p>

          <h3 className="mt-1 break-words text-base font-black text-slate-900 dark:text-white">
            {item?.className || "Class Name"}
          </h3>

          <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Transaction: {item?.transactionId || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-600 dark:text-pink-300">
            Trainer
          </p>

          <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-white">
            <PersonWorker className="h-4 w-4 text-pink-500" />
            {item?.trainerName || "Trainer"}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600 dark:text-orange-300">
            Schedule
          </p>

          <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-white">
            <Calendar className="h-4 w-4 text-orange-500" />
            {formatSchedule(item?.schedule)}
          </p>
        </div>
      </div>

      <Button
        as={Link}
        href={`/all-classes/${item?.classId}`}
        className="mt-5 h-11 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5"
      >
        <Eye className="h-4 w-4" />
        View Class Details
      </Button>
    </Card>
  );
};

const BookedClassesTable = ({ bookedClasses = [] }) => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
              Member Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Booked Classes
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              All classes you have successfully registered and paid for.
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-pink-500/20 bg-pink-500/10 px-5 py-3 text-sm font-black text-pink-600 dark:text-pink-300">
            Total Bookings: {bookedClasses.length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6">
        {bookedClasses.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center text-center">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-500">
                <Star className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                No Booked Classes Found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You have not booked any class yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile & Medium Card View */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {bookedClasses.map((item) => (
                <BookedClassMobileCard key={getItemId(item)} item={item} />
              ))}
            </div>

            {/* Large Device Table View */}
            <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-white/10 lg:block">
              <Table>
                <Table.ScrollContainer>
                  <Table.Content
                    aria-label="Booked classes table"
                    className="min-w-[850px]"
                  >
                    <Table.Header>
                      <Table.Column isRowHeader>Class Name</Table.Column>
                      <Table.Column>Trainer Name</Table.Column>
                      <Table.Column>Schedule</Table.Column>
                      <Table.Column>Action</Table.Column>
                    </Table.Header>

                    <Table.Body>
                      {bookedClasses.map((item) => (
                        <Table.Row key={getItemId(item)}>
                          <Table.Cell>
                            <div className="flex items-center gap-3 py-2">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pink-500/20 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-500 dark:text-pink-300">
                                <Star className="h-5 w-5" />
                              </div>

                              <div>
                                <p className="font-black text-slate-900 dark:text-white">
                                  {item?.className || "Class Name"}
                                </p>

                                <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                  Transaction: {item?.transactionId || "N/A"}
                                </p>
                              </div>
                            </div>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="inline-flex rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-black text-pink-600 dark:text-pink-300">
                              {item?.trainerName || "Trainer"}
                            </span>
                          </Table.Cell>

                          <Table.Cell>
                            <span className="inline-flex max-w-[320px] rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-sm font-bold text-orange-700 dark:text-orange-300">
                              <span className="truncate">
                                {formatSchedule(item?.schedule)}
                              </span>
                            </span>
                          </Table.Cell>

                          <Table.Cell>
                            <Button
                              as={Link}
                              href={`/all-classes/${item?.classId}`}
                              className="h-10 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-5 text-xs font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5"
                            >
                              View Class
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </>
        )}
      </Card>
    </section>
  );
};

export default BookedClassesTable;

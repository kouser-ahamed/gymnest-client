"use client";

import React, { useState } from "react";
import { Button, Table } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiEye,
  FiTag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteClassAlert from "./DeleteClassAlert";

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getStudents = (item) =>
  item?.students || item?.bookedStudents || item?.enrolledStudents || [];

const getStatusClass = (status) => {
  const value = status?.toLowerCase();

  if (value === "approved") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (value === "rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-300";
};

const TrainerClassesTable = ({ classes = [] }) => {
  const router = useRouter();
  const [classList, setClassList] = useState(classes);
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassDeleted = (deletedClassId) => {
    setClassList((prev) =>
      prev.filter((item) => getClassId(item) !== deletedClassId)
    );

    router.refresh();
  };

  const selectedStudents = getStudents(selectedClass);

  return (
    <section className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName="!rounded-2xl !border !border-slate-200 !bg-white !text-slate-900 !shadow-lg !shadow-pink-500/10 dark:!border-white/10 dark:!bg-[#101624] dark:!text-white dark:!shadow-pink-500/20"
        bodyClassName="!text-sm !font-semibold !text-slate-900 dark:!text-white"
        progressClassName="!bg-gradient-to-r !from-fuchsia-500 !via-pink-500 !to-orange-400"
      />

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-[#101624] sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-400">
            <FiTag className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              My Classes
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage all classes created by you.
            </p>
          </div>
        </div>

        <div className="w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          Total Classes: {classList.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

        {classList.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <FiTag className="h-7 w-7" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              No classes found
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              You have not created any pending class yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:hidden">
              {classList.map((item) => {
                const classId = getClassId(item);
                const classStudents = getStudents(item);

                return (
                  <div
                    key={classId}
                    className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-center dark:border-white/10 dark:bg-[#070b14]"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-[#101624] sm:h-48">
                      {item?.image ? (
                        <Image
                          src={item.image}
                          alt={item.className || "Class image"}
                          fill
                          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-pink-500">
                          <FiTag className="h-10 w-10" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="flex flex-col items-center gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {item.className}
                          </h3>

                          <p className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-400">
                            {item.category} • {item.difficultyLevel}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                          <FiClock className="h-4 w-4 text-pink-500" />
                          {item.duration} mins
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                          <FiDollarSign className="h-4 w-4 text-emerald-500" />
                          ${item.price}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                          <FiCalendar className="h-4 w-4 text-pink-500" />
                          {item.schedule?.time}
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
                          <FiUsers className="h-4 w-4 text-pink-500" />
                          {classStudents.length || 0} students
                        </div>
                      </div>

                      <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-[#101624] dark:text-slate-400">
                        Days: {item.schedule?.days?.join(", ")}
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Button
                          type="button"
                          onClick={() => setSelectedClass(item)}
                          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#101624] dark:text-slate-200 dark:hover:bg-white/5"
                        >
                          <FiEye className="mr-1 h-4 w-4" />
                          Students
                        </Button>

                        <Link
                          href={`/dashboard/trainer/my-classes/${classId}/edit`}
                          className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 px-3 text-xs font-semibold text-pink-600 transition hover:bg-pink-500/15 dark:text-pink-400"
                        >
                          <FiEdit3 className="mr-1 h-4 w-4" />
                          Update
                        </Link>

                        <DeleteClassAlert
                          classItem={item}
                          onDeleted={handleClassDeleted}
                          buttonClassName="h-10 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-500/15 dark:text-red-400"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block">
              <Table className="bg-transparent">
                <Table.ScrollContainer>
                  <Table.Content
                    aria-label="Trainer classes table"
                    className="min-w-[950px]"
                  >
                    <Table.Header>
                      <Table.Column isRowHeader>Class</Table.Column>
                      <Table.Column>Category</Table.Column>
                      <Table.Column>Schedule</Table.Column>
                      <Table.Column>Price</Table.Column>
                      <Table.Column>Status</Table.Column>
                      <Table.Column>Actions</Table.Column>
                    </Table.Header>

                    <Table.Body>
                      {classList.map((item) => {
                        const classId = getClassId(item);
                        const classStudents = getStudents(item);

                        return (
                          <Table.Row
                            key={classId}
                            className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                          >
                            <Table.Cell>
                              <div className="flex items-center gap-4 py-2">
                                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-[#070b14]">
                                  {item?.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.className || "Class image"}
                                      fill
                                      sizes="80px"
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-pink-500">
                                      <FiTag className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <h3 className="font-bold text-slate-900 dark:text-white">
                                    {item.className}
                                  </h3>

                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="inline-flex items-center gap-1">
                                      <FiClock className="h-3.5 w-3.5" />
                                      {item.duration} mins
                                    </span>

                                    <span className="inline-flex items-center gap-1">
                                      <FiUsers className="h-3.5 w-3.5" />
                                      {classStudents.length || 0} students
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <div>
                                <p className="font-semibold capitalize text-slate-800 dark:text-slate-100">
                                  {item.category}
                                </p>

                                <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                                  {item.difficultyLevel}
                                </p>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <div className="space-y-1">
                                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  <FiClock className="h-4 w-4 text-pink-500" />
                                  {item.schedule?.time}
                                </p>

                                <p className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <FiCalendar className="h-3.5 w-3.5" />
                                  {item.schedule?.days?.join(", ")}
                                </p>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <p className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                <FiDollarSign className="h-4 w-4" />
                                {item.price}
                              </p>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <div className="flex flex-wrap items-center gap-2">
                                <Button
                                  type="button"
                                  onClick={() => setSelectedClass(item)}
                                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-200 dark:hover:bg-white/5"
                                >
                                  <FiEye className="mr-1 h-4 w-4" />
                                  View Students
                                </Button>

                                <Link
                                  href={`/dashboard/trainer/my-classes/${classId}/edit`}
                                  className="inline-flex h-9 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 px-3 text-xs font-semibold text-pink-600 transition hover:bg-pink-500/15 dark:text-pink-400"
                                >
                                  <FiEdit3 className="mr-1 h-4 w-4" />
                                  Update
                                </Link>

                                <DeleteClassAlert
                                  classItem={item}
                                  onDeleted={handleClassDeleted}
                                  buttonClassName="h-9 rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-500/15 dark:text-red-400"
                                />
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </>
        )}
      </div>

      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-2xl shadow-pink-500/10 dark:border-white/10 dark:bg-[#101624] sm:text-left">
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

            <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 p-4 dark:border-white/10 sm:flex-row sm:p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Enrolled Students
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedClass.className}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-5">
              {selectedStudents.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-[#070b14]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                    <FiUsers className="h-6 w-6" />
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white">
                    No students found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    No booking data is available for this class yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedStudents.map((student, index) => (
                    <div
                      key={student.userEmail || student.email || index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-[#070b14] sm:text-left"
                    >
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {student.userName || student.name || "Student Name"}
                      </h4>

                      <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                        {student.userEmail ||
                          student.email ||
                          "student@email.com"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrainerClassesTable;
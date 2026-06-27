"use client";

import React, { useMemo, useState } from "react";
import { Button, Table } from "@heroui/react";
import Image from "next/image";
import { Check, Xmark, Magnifier } from "@gravity-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDeleteClassAlert from "@/components/dashboard/admin/AdminDeleteClassAlert";
import { getTokenClient } from "@/lib/getTokenClient";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const formatText = (value) => {
  if (!value) return "N/A";

  return value
    .toString()
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatPrice = (price) => {
  const value = Number(price || 0);

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatSchedule = (schedule) => {
  if (!schedule) return "No schedule";

  const days = Array.isArray(schedule?.days) ? schedule.days.join(", ") : "";
  const time = schedule?.time || "";

  if (days && time) return `${days} · ${time}`;
  if (days) return days;
  if (time) return time;

  return "No schedule";
};

const getStatusClass = (status) => {
  const currentStatus = status || "Pending";

  if (currentStatus === "Approved") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (currentStatus === "Rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400";
};

const ManageClassesTable = ({ classes = [] }) => {
  const [classList, setClassList] = useState(classes);
  const [searchText, setSearchText] = useState("");
  const [loadingId, setLoadingId] = useState("");

  const filteredClasses = useMemo(() => {
    const text = searchText.toLowerCase();

    return classList.filter((item) => {
      const className = item?.className?.toLowerCase() || "";
      const trainerName = item?.trainerName?.toLowerCase() || "";
      const category = item?.category?.toLowerCase() || "";
      const status = item?.status?.toLowerCase() || "";

      return (
        className.includes(text) ||
        trainerName.includes(text) ||
        category.includes(text) ||
        status.includes(text)
      );
    });
  }, [classList, searchText]);

  const updateClassInState = (classId, updateData) => {
    setClassList((prev) =>
      prev.map((item) =>
        getClassId(item) === classId ? { ...item, ...updateData } : item,
      ),
    );
  };

  const removeClassFromState = (classId) => {
    setClassList((prev) => prev.filter((item) => getClassId(item) !== classId));
  };

  const handleStatusChange = async (classItem, nextStatus) => {
    const classId = getClassId(classItem);
    const { data: tokenData } = await getTokenClient();

    try {
      setLoadingId(`${classId}-${nextStatus}`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/classes/${classId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update class status.");
      }

      const isUpdated =
        result?.result?.modifiedCount > 0 ||
        result?.result?.matchedCount > 0 ||
        result?.modifiedCount > 0 ||
        result?.matchedCount > 0;

      if (!isUpdated) {
        throw new Error("Class was not updated.");
      }

      updateClassInState(classId, {
        status: result?.updatedStatus || nextStatus,
      });

      let successMessage = "Class status updated successfully.";

      if (nextStatus === "Approved") {
        successMessage = "Class approved successfully.";
      }

      if (nextStatus === "Pending") {
        successMessage = "Class approval cancelled successfully.";
      }

      if (nextStatus === "Rejected") {
        successMessage = "Class rejected successfully.";
      }

      toast.success(successMessage, {
        position: "top-right",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1800,
      });
    } finally {
      setLoadingId("");
    }
  };

  const renderActions = (item) => {
    const classId = getClassId(item);
    const currentStatus = item?.status || "Pending";

    const approveNextStatus =
      currentStatus === "Approved" ? "Pending" : "Approved";

    const approveButtonText =
      currentStatus === "Approved" ? "Cancel Approve" : "Approve";

    return (
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-end">
        <Button
          type="button"
          disabled={loadingId === `${classId}-${approveNextStatus}`}
          onClick={() => handleStatusChange(item, approveNextStatus)}
          className={`flex h-10 w-full items-center justify-center rounded-xl border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 lg:h-9 lg:w-auto ${
            currentStatus === "Approved"
              ? "border-orange-500/20 bg-orange-500/10 text-orange-600 hover:bg-orange-500/15 dark:text-orange-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400"
          }`}
        >
          <Check className="mr-1 h-4 w-4" />
          {loadingId === `${classId}-${approveNextStatus}`
            ? "Saving..."
            : approveButtonText}
        </Button>

        <Button
          type="button"
          disabled={
            currentStatus === "Rejected" ||
            loadingId === `${classId}-Rejected`
          }
          onClick={() => handleStatusChange(item, "Rejected")}
          className="flex h-10 w-full items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 px-3 text-xs font-bold text-pink-600 transition hover:bg-pink-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:text-pink-400 lg:h-9 lg:w-auto"
        >
          <Xmark className="mr-1 h-4 w-4" />
          {loadingId === `${classId}-Rejected` ? "Saving..." : "Reject"}
        </Button>

        <AdminDeleteClassAlert
          classItem={item}
          loadingId={loadingId}
          setLoadingId={setLoadingId}
          onDeleted={removeClassFromState}
        />
      </div>
    );
  };

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
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            Manage Classes
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review trainer submitted classes and update their approval status.
          </p>
        </div>

        <div className="w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          Total Classes: {classList.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

        <div className="border-b border-slate-200 p-4 dark:border-white/10">
          <div className="relative">
            <Magnifier className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search by class, trainer, category or status..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
            />
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No classes found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No trainer submitted classes are available right now.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
              {filteredClasses.map((item) => {
                const classId = getClassId(item);
                const currentStatus = item?.status || "Pending";

                return (
                  <div
                    key={classId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Image
                        src={item?.image || "/placeholder.png"}
                        alt={item?.className || "Class"}
                        width={96}
                        height={72}
                        className="h-44 w-full rounded-xl object-cover sm:h-[72px] sm:w-24"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                          {item?.className || "Class Name"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {item?.trainerName || "Trainer"} ·{" "}
                          {formatText(item?.category)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {formatSchedule(item?.schedule)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Level: {formatText(item?.difficultyLevel)} ·{" "}
                          {item?.duration || 0} min
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <span
                        className={`flex justify-center rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                          currentStatus,
                        )}`}
                      >
                        {currentStatus}
                      </span>

                      <span className="flex justify-center rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1 text-sm font-bold text-lime-600 dark:text-lime-300">
                        {formatPrice(item?.price)}
                      </span>
                    </div>

                    <div className="mt-4">{renderActions(item)}</div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block">
              <Table className="bg-transparent">
                <Table.ScrollContainer>
                  <Table.Content
                    aria-label="Manage classes table"
                    className="min-w-[1000px]"
                  >
                    <Table.Header>
                      <Table.Column isRowHeader>Class</Table.Column>
                      <Table.Column>Schedule</Table.Column>
                      <Table.Column>Status</Table.Column>
                      <Table.Column>Price</Table.Column>
                      <Table.Column>Actions</Table.Column>
                    </Table.Header>

                    <Table.Body>
                      {filteredClasses.map((item) => {
                        const classId = getClassId(item);
                        const currentStatus = item?.status || "Pending";

                        return (
                          <Table.Row
                            key={classId}
                            className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                          >
                            <Table.Cell>
                              <div className="flex items-center gap-4 py-3">
                                <Image
                                  src={item?.image || "/placeholder.png"}
                                  alt={item?.className || "Class"}
                                  width={86}
                                  height={58}
                                  className="h-[58px] w-[86px] rounded-xl object-cover"
                                />

                                <div className="min-w-0">
                                  <h3 className="max-w-[280px] truncate font-bold text-slate-900 dark:text-white">
                                    {item?.className || "Class Name"}
                                  </h3>

                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {item?.trainerName || "Trainer"} ·{" "}
                                    {formatText(item?.category)}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Level: {formatText(item?.difficultyLevel)} ·{" "}
                                    {item?.duration || 0} min
                                  </p>
                                </div>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {formatSchedule(item?.schedule)}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                                  currentStatus,
                                )}`}
                              >
                                {currentStatus}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span className="text-sm font-bold text-lime-600 dark:text-lime-300">
                                {formatPrice(item?.price)}
                              </span>
                            </Table.Cell>

                            <Table.Cell>{renderActions(item)}</Table.Cell>
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
    </section>
  );
};

export default ManageClassesTable;
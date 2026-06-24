"use client";

import React, { useMemo, useState } from "react";
import { Table } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TrainerApplicationDetailsModal from "@/components/dashboard/admin/TrainerApplicationDetailsModal";

const getApplicationId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getStatusClass = (status) => {
  if (status === "Approved") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (status === "Rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400";
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const AppliedTrainersTable = ({ currentUser, applications = [] }) => {
  const [applicationList, setApplicationList] = useState(applications);
  const [searchText, setSearchText] = useState("");
  const [loadingId, setLoadingId] = useState("");

  const filteredApplications = useMemo(() => {
    const text = searchText.toLowerCase();

    return applicationList.filter((item) => {
      const name = item?.name?.toLowerCase() || "";
      const email = item?.email?.toLowerCase() || "";
      const specialty = item?.specialty?.toLowerCase() || "";
      const status = item?.status?.toLowerCase() || "";

      return (
        name.includes(text) ||
        email.includes(text) ||
        specialty.includes(text) ||
        status.includes(text)
      );
    });
  }, [applicationList, searchText]);

  const removeApplicationFromState = (applicationId) => {
    setApplicationList((prev) =>
      prev.filter((item) => getApplicationId(item) !== applicationId),
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
            Applied Trainers
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review pending trainer applications and approve or reject them.
          </p>
        </div>

        <div className="w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          Pending Applications: {applicationList.length}
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
              placeholder="Search by name, email, specialty or status..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
            />
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No pending applications
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No trainer applications are pending right now.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:hidden">
              {filteredApplications.map((item) => {
                const applicationId = getApplicationId(item);

                return (
                  <div
                    key={applicationId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]"
                  >
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {item?.name || "Applicant Name"}
                      </h3>

                      <p className="break-all text-sm text-slate-500 dark:text-slate-400">
                        {item?.email || "applicant@example.com"}
                      </p>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#101624]">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Specialty
                          </p>
                          <p className="mt-1 font-bold text-slate-900 dark:text-white">
                            {item?.specialty || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#101624]">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Applied
                          </p>
                          <p className="mt-1 font-bold text-slate-900 dark:text-white">
                            {formatDate(item?.createdAt)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                          item?.status,
                        )}`}
                      >
                        {item?.status || "Pending"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <TrainerApplicationDetailsModal
                        application={item}
                        currentUser={currentUser}
                        loadingId={loadingId}
                        setLoadingId={setLoadingId}
                        onCompleted={removeApplicationFromState}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block">
              <Table className="bg-transparent">
                <Table.ScrollContainer>
                  <Table.Content
                    aria-label="Applied trainers table"
                    className="min-w-[900px]"
                  >
                    <Table.Header>
                      <Table.Column isRowHeader>Applicant</Table.Column>
                      <Table.Column>Specialty</Table.Column>
                      <Table.Column>Experience</Table.Column>
                      <Table.Column>Status</Table.Column>
                      <Table.Column>Applied</Table.Column>
                      <Table.Column>Action</Table.Column>
                    </Table.Header>

                    <Table.Body>
                      {filteredApplications.map((item) => {
                        const applicationId = getApplicationId(item);

                        return (
                          <Table.Row
                            key={applicationId}
                            className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                          >
                            <Table.Cell>
                              <div className="py-2">
                                <h3 className="font-bold text-slate-900 dark:text-white">
                                  {item?.name || "Applicant Name"}
                                </h3>

                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                  {item?.email || "applicant@example.com"}
                                </p>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {item?.specialty || "N/A"}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {item?.experience || 0} years
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                                  item?.status,
                                )}`}
                              >
                                {item?.status || "Pending"}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {formatDate(item?.createdAt)}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <TrainerApplicationDetailsModal
                                application={item}
                                currentUser={currentUser}
                                loadingId={loadingId}
                                setLoadingId={setLoadingId}
                                onCompleted={removeApplicationFromState}
                              />
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
    </section>
  );
};

export default AppliedTrainersTable;
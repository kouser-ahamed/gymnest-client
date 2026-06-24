"use client";

import React, { useMemo, useState } from "react";
import { Table } from "@heroui/react";
import Image from "next/image";
import { Magnifier } from "@gravity-ui/icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DemoteTrainerAlert from "@/components/dashboard/admin/DemoteTrainerAlert";

const getUserId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getStatusClass = (status) => {
  if (status === "active") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (status === "blocked") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  return "border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400";
};

const getRoleClass = (role) => {
  if (role === "trainer") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
};

const TrainerManageTable = ({ currentUser, trainers = [] }) => {
  const [trainerList, setTrainerList] = useState(trainers);
  const [searchText, setSearchText] = useState("");
  const [loadingId, setLoadingId] = useState("");

  const filteredTrainers = useMemo(() => {
    const text = searchText.toLowerCase();

    return trainerList.filter((item) => {
      const name = item?.name?.toLowerCase() || "";
      const email = item?.email?.toLowerCase() || "";
      const role = item?.role?.toLowerCase() || "";
      const status = item?.status?.toLowerCase() || "";

      return (
        name.includes(text) ||
        email.includes(text) ||
        role.includes(text) ||
        status.includes(text)
      );
    });
  }, [trainerList, searchText]);

  const removeTrainerFromState = (trainerId) => {
    setTrainerList((prev) =>
      prev.filter((item) => getUserId(item) !== trainerId),
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
            Trainer Manage
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View all active trainers and remove trainer privileges when needed.
          </p>
        </div>

        <div className="w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          Active Trainers: {trainerList.length}
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
              placeholder="Search by name, email, role or status..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
            />
          </div>
        </div>

        {filteredTrainers.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No active trainer found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Kono active trainer pawa jayni.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:hidden">
              {filteredTrainers.map((item) => {
                const trainerId = getUserId(item);
                const avatarLetter =
                  item?.name?.charAt(0)?.toUpperCase() || "T";

                return (
                  <div
                    key={trainerId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]"
                  >
                    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                      {item?.image ? (
                        <Image
                          src={item.image}
                          alt={item?.name || "Trainer"}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-lg font-bold text-white">
                          {avatarLetter}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {item?.name || "Trainer Name"}
                        </h3>

                        <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                          {item?.email || "trainer@example.com"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <span
                        className={`flex justify-center rounded-full border px-3 py-1 text-xs font-bold capitalize ${getRoleClass(
                          item?.role,
                        )}`}
                      >
                        {item?.role || "trainer"}
                      </span>

                      <span
                        className={`flex justify-center rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                          item?.status,
                        )}`}
                      >
                        {item?.status || "active"}
                      </span>
                    </div>

                    <div className="mt-4">
                      <DemoteTrainerAlert
                        trainer={item}
                        currentUser={currentUser}
                        loadingId={loadingId}
                        setLoadingId={setLoadingId}
                        onDemoted={removeTrainerFromState}
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
                    aria-label="Active trainers table"
                    className="min-w-[900px]"
                  >
                    <Table.Header>
                      <Table.Column isRowHeader>Trainer</Table.Column>
                      <Table.Column>Email</Table.Column>
                      <Table.Column>Current Role</Table.Column>
                      <Table.Column>Status</Table.Column>
                      <Table.Column>Action</Table.Column>
                    </Table.Header>

                    <Table.Body>
                      {filteredTrainers.map((item) => {
                        const trainerId = getUserId(item);
                        const avatarLetter =
                          item?.name?.charAt(0)?.toUpperCase() || "T";

                        return (
                          <Table.Row
                            key={trainerId}
                            className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                          >
                            <Table.Cell>
                              <div className="flex items-center gap-3 py-2">
                                {item?.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item?.name || "Trainer"}
                                    width={46}
                                    height={46}
                                    className="h-[46px] w-[46px] rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-bold text-white">
                                    {avatarLetter}
                                  </div>
                                )}

                                <div>
                                  <h3 className="font-bold text-slate-900 dark:text-white">
                                    {item?.name || "Trainer Name"}
                                  </h3>
                                </div>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                {item?.email || "trainer@example.com"}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getRoleClass(
                                  item?.role,
                                )}`}
                              >
                                {item?.role || "trainer"}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                                  item?.status,
                                )}`}
                              >
                                {item?.status || "active"}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <DemoteTrainerAlert
                                trainer={item}
                                currentUser={currentUser}
                                loadingId={loadingId}
                                setLoadingId={setLoadingId}
                                onDemoted={removeTrainerFromState}
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

export default TrainerManageTable;
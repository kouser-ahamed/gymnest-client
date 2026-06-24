"use client";

import React, { useMemo, useState } from "react";
import { Button, Table } from "@heroui/react";
import Image from "next/image";
import { ShieldCheck, PersonPlus } from "@gravity-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getUserId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getRoleClass = (role) => {
  if (role === "admin") {
    return "border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-400";
  }

  if (role === "trainer") {
    return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
};

const getStatusClass = (status) => {
  if (status === "blocked") {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
};

const getPreviousRole = (item) => {
  if (item?.previousRole === "trainer") return "trainer";
  if (item?.previousRole === "member") return "member";

  return "member";
};

const ManageUsersTable = ({ currentUser, users = [] }) => {
  const [userList, setUserList] = useState(users);
  const [searchText, setSearchText] = useState("");
  const [loadingId, setLoadingId] = useState("");

  const currentUserId = currentUser?.id;
  const currentUserEmail = currentUser?.email;

  const filteredUsers = useMemo(() => {
    const text = searchText.toLowerCase();

    return userList.filter((item) => {
      const name = item?.name?.toLowerCase() || "";
      const email = item?.email?.toLowerCase() || "";

      return name.includes(text) || email.includes(text);
    });
  }, [userList, searchText]);

  const updateUserInState = (userId, updateData) => {
    setUserList((prev) =>
      prev.map((item) =>
        getUserId(item) === userId ? { ...item, ...updateData } : item
      )
    );
  };

  const handleStatusChange = async (targetUser, nextStatus) => {
    const userId = getUserId(targetUser);

    try {
      setLoadingId(`${userId}-${nextStatus}`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            actorId: currentUserId,
            actorEmail: currentUserEmail,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update status.");
      }

      updateUserInState(userId, {
        status: result?.updatedStatus || nextStatus,
      });

      toast.success(result?.message || "User status updated.", {
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

  const handleRoleChange = async (targetUser, nextRole) => {
    const userId = getUserId(targetUser);
    const currentRole = targetUser?.role || "member";

    try {
      setLoadingId(`${userId}-${nextRole}`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: nextRole,
            actorId: currentUserId,
            actorEmail: currentUserEmail,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update role.");
      }

      const updatedRole = result?.updatedRole || nextRole;

      updateUserInState(userId, {
        role: updatedRole,
        previousRole:
          updatedRole === "admin"
            ? result?.previousRole || currentRole
            : null,
      });

      toast.success(result?.message || "User role updated.", {
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
    const userId = getUserId(item);
    const isParentAdmin = item?.parentRole === "parentAdmin";
    const isCurrentUser =
      userId === currentUserId || item?.email === currentUserEmail;

    if (isParentAdmin) {
      return (
        <span className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-300">
          Parent Admin
        </span>
      );
    }

    if (isCurrentUser) {
      return (
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
          Current User
        </span>
      );
    }

    const currentStatus = item?.status || "active";
    const currentRole = item?.role || "member";

    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    const statusText = currentStatus === "blocked" ? "Unblock" : "Block";

    const previousRole = getPreviousRole(item);
    const nextRole = currentRole === "admin" ? previousRole : "admin";
    const roleText = currentRole === "admin" ? "Remove Admin" : "Make Admin";

    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          disabled={loadingId === `${userId}-${nextStatus}`}
          onClick={() => handleStatusChange(item, nextStatus)}
          className={`h-9 rounded-xl border px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            currentStatus === "blocked"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400"
              : "border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-400"
          }`}
        >
          {loadingId === `${userId}-${nextStatus}` ? "Saving..." : statusText}
        </Button>

        <Button
          type="button"
          disabled={loadingId === `${userId}-${nextRole}`}
          onClick={() => handleRoleChange(item, nextRole)}
          className="h-9 rounded-xl border border-pink-500/20 bg-pink-500/10 px-3 text-xs font-bold text-pink-600 transition hover:bg-pink-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:text-pink-400"
        >
          <PersonPlus className="mr-1 h-4 w-4" />
          {loadingId === `${userId}-${nextRole}` ? "Saving..." : roleText}
        </Button>
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
        <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-400">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Manage Users
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Block, unblock, promote, or remove admin role from users.
            </p>
          </div>
        </div>

        <div className="w-fit rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          Total Users: {userList.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

        <div className="border-b border-slate-200 p-4 dark:border-white/10">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex min-h-[220px] items-center justify-center p-8 text-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                No users found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No registered users are available right now.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
              {filteredUsers.map((item) => {
                const userId = getUserId(item);
                const avatarLetter =
                  item?.name?.charAt(0)?.toUpperCase() || "U";

                return (
                  <div
                    key={userId}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-[#070b14]"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {item?.image ? (
                        <Image
                          src={item.image}
                          alt={item.name || "User"}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-lg font-bold text-white">
                          {avatarLetter}
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {item?.name || "User Name"}
                        </h3>

                        <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                          {item?.email || "user@example.com"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getRoleClass(
                          item?.role
                        )}`}
                      >
                        {item?.role || "member"}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                          item?.status
                        )}`}
                      >
                        {item?.status || "active"}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-center">
                      {renderActions(item)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden lg:block">
              <Table className="bg-transparent">
                <Table.ScrollContainer>
                  <Table.Content
                    aria-label="Manage users table"
                    className="min-w-[900px]"
                  >
                    <Table.Header>
                      <Table.Column isRowHeader>User</Table.Column>
                      <Table.Column>Role</Table.Column>
                      <Table.Column>Status</Table.Column>
                      <Table.Column>Actions</Table.Column>
                    </Table.Header>

                    <Table.Body>
                      {filteredUsers.map((item) => {
                        const userId = getUserId(item);
                        const avatarLetter =
                          item?.name?.charAt(0)?.toUpperCase() || "U";

                        return (
                          <Table.Row
                            key={userId}
                            className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                          >
                            <Table.Cell>
                              <div className="flex items-center gap-3 py-2">
                                {item?.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name || "User"}
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
                                    {item?.name || "User Name"}
                                  </h3>

                                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {item?.email || "user@example.com"}
                                  </p>
                                </div>
                              </div>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getRoleClass(
                                  item?.role
                                )}`}
                              >
                                {item?.role || "member"}
                              </span>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                                  item?.status
                                )}`}
                              >
                                {item?.status || "active"}
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

export default ManageUsersTable;
"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getApplicationId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const formatDateTime = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const TrainerApplicationDetailsModal = ({
  application,
  currentUser,
  loadingId,
  setLoadingId,
  onCompleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const applicationId = getApplicationId(application);
  const approveLoading = loadingId === `${applicationId}-approve`;
  const rejectLoading = loadingId === `${applicationId}-reject`;

  const handleApprove = async () => {
    try {
      setLoadingId(`${applicationId}-approve`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/applied-trainers/${applicationId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actorId: currentUser?.id,
            actorEmail: currentUser?.email,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to approve application.");
      }

      toast.success(result?.message || "Trainer approved successfully.", {
        position: "top-right",
        autoClose: 1500,
      });

      onCompleted?.(applicationId);
      setIsOpen(false);
      setFeedback("");
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1800,
      });
    } finally {
      setLoadingId("");
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error("Please write feedback before rejecting.", {
        position: "top-right",
        autoClose: 1800,
      });
      return;
    }

    try {
      setLoadingId(`${applicationId}-reject`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/applied-trainers/${applicationId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedback,
            actorId: currentUser?.id,
            actorEmail: currentUser?.email,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to reject application.");
      }

      toast.success(result?.message || "Trainer application rejected.", {
        position: "top-right",
        autoClose: 1500,
      });

      onCompleted?.(applicationId);
      setIsOpen(false);
      setFeedback("");
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1800,
      });
    } finally {
      setLoadingId("");
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 w-full rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 text-xs font-bold text-pink-600 transition hover:bg-pink-500/15 dark:text-pink-400 lg:h-9 lg:w-auto"
      >
        Details
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#101624]">
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Trainer Application Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Review applicant information before approving or rejecting.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-bold text-slate-500 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Name
                  </p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {application?.name || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="mt-1 break-all font-bold text-slate-900 dark:text-white">
                    {application?.email || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Experience
                  </p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {application?.experience || 0} years
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14]">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Specialty
                  </p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {application?.specialty || "N/A"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14] sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Time
                  </p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {formatDateTime(application?.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#070b14] sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Bio
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {application?.bio || "No bio provided."}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  Feedback for rejection
                </label>

                <textarea
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Write why this application is rejected..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-100 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={approveLoading || rejectLoading}
                  onClick={handleApprove}
                  className="h-11 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-400"
                >
                  {approveLoading ? "Approving..." : "Approve"}
                </Button>

                <Button
                  type="button"
                  disabled={approveLoading || rejectLoading}
                  onClick={handleReject}
                  className="h-11 rounded-xl border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                >
                  {rejectLoading ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerApplicationDetailsModal;
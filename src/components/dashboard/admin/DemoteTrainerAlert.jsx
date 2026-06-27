"use client";

import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { toast } from "react-toastify";
import { getTokenClient } from "@/lib/getTokenClient";


const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getUserId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const DemoteTrainerAlert = ({
  trainer,
  currentUser,
  loadingId,
  setLoadingId,
  onDemoted,
}) => {
  const [feedback, setFeedback] = useState("");

  const trainerId = getUserId(trainer);
  const isLoading = loadingId === `${trainerId}-demote`;

  const handleDemoteTrainer = async () => {
    if (!feedback.trim()) {
      toast.error("Please write a demote note first.", {
        position: "top-right",
        autoClose: 1800,
      });
      return;
    }

    try {
      setLoadingId(`${trainerId}-demote`);
      const { data:tokenData } = await getTokenClient();


      const response = await fetch(
        `${apiBaseUrl}/api/admin/trainers/${trainerId}/demote`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({
            actorId: currentUser?.id,
            actorEmail: currentUser?.email,
            feedback: feedback.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to demote trainer.");
      }

      toast.success(result?.message || "Trainer demoted successfully.", {
        position: "top-right",
        autoClose: 1500,
      });

      setFeedback("");
      onDemoted?.(trainerId);
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
    <AlertDialog>
      <Button
        type="button"
        disabled={isLoading}
        className="flex h-10 w-full items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-xs font-bold text-red-600 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 lg:h-9 lg:w-auto"
      >
        {isLoading ? "Processing..." : "Demote to User"}
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="mx-4 sm:max-w-[460px]">
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />

              <AlertDialog.Heading>
                Remove Trainer Role?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              <div className="space-y-4">
                <p>
                  Are you sure you want to remove trainer privileges from{" "}
                  <strong>{trainer?.name || "this trainer"}</strong>? This user
                  will become a normal member.
                </p>

                <div>
                  <label className="text-sm font-bold text-slate-900 dark:text-white">
                    Demote Note / Feedback
                  </label>

                  <textarea
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    rows={4}
                    placeholder="Write why this trainer is being demoted..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                  />
                </div>
              </div>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button
                slot="close"
                variant="tertiary"
                onClick={() => setFeedback("")}
              >
                No
              </Button>

              <Button
                slot={feedback.trim() ? "close" : undefined}
                variant="danger"
                onClick={handleDemoteTrainer}
                disabled={isLoading}
              >
                {isLoading ? "Removing..." : "Yes, Remove"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default DemoteTrainerAlert;
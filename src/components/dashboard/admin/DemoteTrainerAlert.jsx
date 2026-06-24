"use client";

import { AlertDialog, Button } from "@heroui/react";
import { toast } from "react-toastify";

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
  const trainerId = getUserId(trainer);
  const isLoading = loadingId === `${trainerId}-demote`;

  const handleDemoteTrainer = async () => {
    try {
      setLoadingId(`${trainerId}-demote`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/trainers/${trainerId}/demote`,
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
        throw new Error(result?.message || "Failed to demote trainer.");
      }

      toast.success(result?.message || "Trainer demoted successfully.", {
        position: "top-right",
        autoClose: 1500,
      });

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
          <AlertDialog.Dialog className="mx-4 sm:max-w-[430px]">
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />

              <AlertDialog.Heading>
                Remove Trainer Role?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              <p>
                Are you sure you want to remove trainer privileges from{" "}
                <strong>{trainer?.name || "this trainer"}</strong>? This user
                will become a normal member.
              </p>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                No
              </Button>

              <Button
                slot="close"
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
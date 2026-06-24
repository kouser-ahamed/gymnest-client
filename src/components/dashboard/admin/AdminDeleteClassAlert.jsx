"use client";

import { AlertDialog, Button } from "@heroui/react";
import { TrashBin } from "@gravity-ui/icons";
import { toast } from "react-toastify";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const AdminDeleteClassAlert = ({
  classItem,
  loadingId,
  setLoadingId,
  onDeleted,
}) => {
  const classId = getClassId(classItem);
  const isDeleting = loadingId === `${classId}-delete`;

  const handleAdminDeleteClass = async () => {
    try {
      setLoadingId(`${classId}-delete`);

      const response = await fetch(
        `${apiBaseUrl}/api/admin/classes/${classId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete class.");
      }

      if (result?.deletedCount < 1) {
        throw new Error("Class was not deleted.");
      }

      onDeleted?.(classId);

      toast.success(result?.message || "Class deleted successfully.", {
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

  return (
    <AlertDialog>
      <Button
        type="button"
        disabled={isDeleting}
        className="flex h-10 w-full items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-bold text-red-600 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 lg:h-9 lg:w-auto"
      >
        <TrashBin className="mr-1 h-4 w-4" />
        Delete
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="mx-4 sm:max-w-[420px]">
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />

              <AlertDialog.Heading>
                Delete class permanently?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              <p>
                Admin will permanently delete{" "}
                <strong>{classItem?.className || "this class"}</strong> from
                the classes collection. This action cannot be undone.
              </p>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>

              <Button
                slot="close"
                variant="danger"
                onClick={handleAdminDeleteClass}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Class"}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default AdminDeleteClassAlert;
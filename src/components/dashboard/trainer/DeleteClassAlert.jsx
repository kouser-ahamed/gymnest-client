"use client";

import { Button, AlertDialog } from "@heroui/react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { getTokenClient } from "@/lib/getTokenClient";


const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const DeleteClassAlert = ({
  classItem,
  onDeleted,
  buttonClassName = "",
  buttonText = "Delete",
}) => {
  const classId = getClassId(classItem);

  const handleDeleteClass = async () => {
    const { data:tokenData } = await getTokenClient();

    try {
      const res = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData?.token}`,
        },
      });

      const data = await res.json();

      if (data?.deletedCount > 0) {
        toast.success("Class deleted successfully!", {
          position: "top-right",
          autoClose: 1500,
        });

        onDeleted?.(classId);
      } else {
        toast.error("Failed to delete class.", {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1500,
      });
    }
  };

  return (
    <AlertDialog>
      <Button
        type="button"
        className={
          buttonClassName ||
          "h-10 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-500/15 dark:text-red-400"
        }
      >
        <FiTrash2 className="mr-1 h-4 w-4" />
        {buttonText}
      </Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[420px]">
            <AlertDialog.CloseTrigger />

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />

              <AlertDialog.Heading>
                Delete class permanently?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              <p>
                This will permanently delete{" "}
                <strong>{classItem?.className || "this class"}</strong> from
                your classes. This action cannot be undone.
              </p>
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>

              <Button
                onClick={handleDeleteClass}
                slot="close"
                variant="danger"
              >
                Delete Class
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};

export default DeleteClassAlert;
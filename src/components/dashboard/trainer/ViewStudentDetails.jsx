"use client";

import React, { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { FiEye, FiMail, FiUser, FiUsers } from "react-icons/fi";
import { getTokenClient } from "@/lib/getTokenClient";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getInitialStudents = (item) =>
  item?.students || item?.bookedStudents || item?.enrolledStudents || [];

const ViewStudentDetails = ({
  classItem,
  buttonClassName = "",
  buttonText = "View Students",
}) => {
  const classId = getClassId(classItem);

  const [students, setStudents] = useState(getInitialStudents(classItem));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoadStudents = async () => {
    if (!classId) return;

    try {
      setIsLoading(true);
      const { data:tokenData } = await getTokenClient();

      const response = await fetch(
        `${apiBaseUrl}/api/class-students/${classId}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            authorization: `Bearer ${tokenData?.token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch students.");
      }

      setStudents(data?.students || []);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
      setStudents(getInitialStudents(classItem));
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal>
      <Button
        type="button"
        onClick={handleLoadStudents}
        className={
          buttonClassName ||
          "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#101624] dark:text-slate-200 dark:hover:bg-white/5"
        }
      >
        <FiEye className="mr-1 h-4 w-4" />
        {buttonText}
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[520px]">
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-pink-500/10 text-pink-600 dark:text-pink-400">
                <FiUsers className="size-5" />
              </Modal.Icon>

              <div>
                <Modal.Heading>Enrolled Students</Modal.Heading>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {classItem?.className || "Class Name"}
                </p>
              </div>
            </Modal.Header>

            <Modal.Body>
              {isLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-white/10 dark:bg-[#070b14]">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                    <FiUsers className="h-6 w-6" />
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Loading students...
                  </h3>

                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Please wait while booking data is loading.
                  </p>
                </div>
              ) : students.length === 0 ? (
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
                <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
                  <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-center text-sm font-bold text-pink-600 dark:text-pink-300">
                    Total Students: {students.length}
                  </div>

                  {students.map((student, index) => (
                    <div
                      key={student?._id || student?.userEmail || index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                          <FiUser className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="break-words font-bold text-slate-900 dark:text-white">
                            {student?.userName ||
                              student?.name ||
                              "Student Name"}
                          </h4>

                          <p className="mt-1 flex items-center gap-2 break-all text-sm text-slate-500 dark:text-slate-400">
                            <FiMail className="h-4 w-4 shrink-0 text-pink-500" />
                            {student?.userEmail ||
                              student?.email ||
                              "student@email.com"}
                          </p>

                          {student?.transactionId && (
                            <p className="mt-2 break-all text-xs font-semibold text-slate-400 dark:text-slate-500">
                              Transaction: {student.transactionId}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" className="w-full rounded-xl">
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ViewStudentDetails;

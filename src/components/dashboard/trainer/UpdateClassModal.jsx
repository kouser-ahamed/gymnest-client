"use client";

import React, { useMemo, useState } from "react";
import { Button, Modal } from "@heroui/react";
import { FiEdit3, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

const categories = [
  { id: "yoga", label: "Yoga" },
  { id: "weights", label: "Weights" },
  { id: "cardio", label: "Cardio" },
  { id: "hiit", label: "HIIT" },
  { id: "strength", label: "Strength" },
  { id: "zumba", label: "Zumba" },
];

const difficultyLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

const hours = Array.from({ length: 12 }, (_, index) => {
  const value = index + 1;

  return {
    id: String(value).padStart(2, "0"),
    label: String(value).padStart(2, "0"),
  };
});

const minutes = ["00", "15", "30", "45"].map((minute) => ({
  id: minute,
  label: minute,
}));

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

const getClassId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const parseTime = (time) => {
  if (!time) {
    return {
      hour: "08",
      minute: "00",
      period: "AM",
    };
  }

  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!match) {
    return {
      hour: "08",
      minute: "00",
      period: "AM",
    };
  }

  return {
    hour: String(match[1]).padStart(2, "0"),
    minute: match[2],
    period: match[3].toUpperCase(),
  };
};

const UpdateClassModal = ({
  classItem,
  buttonClassName = "",
  buttonText = "Update",
}) => {
  const classId = getClassId(classItem);
  const oldTime = parseTime(classItem?.schedule?.time);

  const [category, setCategory] = useState(classItem?.category || "weights");
  const [difficulty, setDifficulty] = useState(
    classItem?.difficultyLevel || "beginner"
  );

  const [selectedDays, setSelectedDays] = useState(
    Array.isArray(classItem?.schedule?.days) &&
      classItem.schedule.days.length > 0
      ? classItem.schedule.days
      : ["Mon", "Wed", "Fri"]
  );

  const [selectedHour, setSelectedHour] = useState(oldTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(oldTime.minute);
  const [period, setPeriod] = useState(oldTime.period);

  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [dayError, setDayError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const imagePreview = useMemo(() => {
    if (!imageFile) return classItem?.image || null;
    return URL.createObjectURL(imageFile);
  }, [imageFile, classItem?.image]);

  const classTime = `${selectedHour}:${selectedMinute} ${period}`;

  const handleDayToggle = (day) => {
    setDayError("");

    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((item) => item !== day)
        : [...prevDays, day]
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");
    setImageFile(file);
  };

  const uploadImageToImgbb = async () => {
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!imgbbApiKey) {
      throw new Error("Imgbb API key is missing.");
    }

    if (!imageFile) {
      return classItem?.image || "";
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!result?.success) {
      throw new Error("Image upload failed.");
    }

    return result.data.url;
  };

  const handleUpdateClass = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (selectedDays.length === 0) {
      setDayError("Please select at least one class day.");
      return;
    }

    if (!classItem?.image && !imageFile) {
      setImageError("Please upload a class image.");
      return;
    }

    try {
      setIsUpdating(true);

      const imageUrl = await uploadImageToImgbb();

      const updatedClass = {
        className: formData.get("className"),
        image: imageUrl,
        category,
        difficultyLevel: difficulty,
        duration: formData.get("duration"),
        schedule: {
          days: selectedDays,
          time: classTime,
        },
        price: Number(formData.get("price")),
        description: formData.get("description"),
        status: classItem?.status || "Pending",
      };

      const response = await fetch(`${apiBaseUrl}/api/classes/${classId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClass),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update class.");
      }

      if (result?.modifiedCount > 0 || result?.matchedCount > 0) {
        toast.success("Class updated successfully!", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        toast.error("No changes were made.", {
          position: "top-right",
          autoClose: 1500,
        });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1800,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal>
      <Button
        type="button"
        className={
          buttonClassName ||
          "h-10 w-full rounded-xl border border-pink-500/20 bg-pink-500/10 px-3 text-xs font-semibold text-pink-600 transition hover:bg-pink-500/15 dark:text-pink-400"
        }
      >
        <FiEdit3 className="mr-1 h-4 w-4" />
        {buttonText}
      </Button>

      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[760px]">
            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Icon className="bg-pink-500/10 text-pink-600 dark:text-pink-400">
                <FiEdit3 className="size-5" />
              </Modal.Icon>

              <div>
                <Modal.Heading>Update Class</Modal.Heading>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update class information with pre-filled data.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body>
              <form
                id={`update-class-form-${classId}`}
                onSubmit={handleUpdateClass}
                className="max-h-[65vh] overflow-y-auto pr-1"
              >
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#070b14] sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Class Information
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Change any information and submit the update.
                    </p>
                  </div>

                  <div className="w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                    Status: {classItem?.status || "Pending"}
                  </div>
                </div>

                <div className="grid gap-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Class Name
                    </label>

                    <input
                      name="className"
                      defaultValue={classItem?.className || ""}
                      required
                      placeholder="Fitness Class"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Class Image
                    </label>

                    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14] md:grid-cols-[120px_1fr]">
                      <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 md:w-[120px]">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Class preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiImage className="h-10 w-10 text-pink-500" />
                        )}
                      </div>

                      <div className="flex flex-col justify-center">
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-gradient-to-r file:from-fuchsia-500 file:via-pink-500 file:to-orange-400 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white dark:border-white/10 dark:bg-[#101624] dark:text-slate-300"
                        />

                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Leave empty to keep the old image. Upload a new image
                          only if you want to change it.
                        </p>

                        {imageError && (
                          <p className="mt-2 text-xs font-medium text-red-500">
                            {imageError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Category
                      </label>

                      <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                      >
                        {categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Difficulty Level
                      </label>

                      <select
                        value={difficulty}
                        onChange={(event) => setDifficulty(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                      >
                        {difficultyLevels.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Duration
                      </label>

                      <input
                        name="duration"
                        defaultValue={classItem?.duration || ""}
                        required
                        placeholder="e.g. 60 mins"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Price ($)
                      </label>

                      <input
                        type="number"
                        name="price"
                        min="0"
                        defaultValue={classItem?.price || 0}
                        required
                        placeholder="25"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#070b14]">
                    <div className="mb-4">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Class Schedule
                      </label>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Select class days and time.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map((day) => {
                          const isSelected = selectedDays.includes(day);

                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDayToggle(day)}
                              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                isSelected
                                  ? "border-pink-500 bg-pink-500/10 text-pink-600 shadow-sm dark:text-pink-400"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-pink-500/40 hover:text-pink-600 dark:border-white/10 dark:bg-[#101624] dark:text-slate-400"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>

                      {dayError && (
                        <p className="text-xs font-medium text-red-500">
                          {dayError}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Hour
                        </label>

                        <select
                          value={selectedHour}
                          onChange={(event) =>
                            setSelectedHour(event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#101624] dark:text-white"
                        >
                          {hours.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Minute
                        </label>

                        <select
                          value={selectedMinute}
                          onChange={(event) =>
                            setSelectedMinute(event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#101624] dark:text-white"
                        >
                          {minutes.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Period
                        </label>

                        <div className="mt-2 flex rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-[#101624]">
                          {["AM", "PM"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setPeriod(item)}
                              className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                                period === item
                                  ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-sm"
                                  : "text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-400"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-600 dark:text-pink-400">
                      Selected Time:{" "}
                      <span className="font-bold">{classTime}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Description
                    </label>

                    <textarea
                      name="description"
                      rows={5}
                      defaultValue={classItem?.description || ""}
                      required
                      placeholder="Describe the class..."
                      className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                    />
                  </div>
                </div>
              </form>
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>

              <Button
                type="submit"
                form={`update-class-form-${classId}`}
                disabled={isUpdating}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiEdit3 className="mr-1 h-4 w-4" />
                {isUpdating ? "Updating..." : "Update Class"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default UpdateClassModal;
"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import {
  Calendar,
  CircleDollar,
  FilePlus,
  Picture,
} from "@gravity-ui/icons";
import { createClass } from "@/lib/actions/classes";
import { useSession } from "@/lib/auth-client";

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

const AddClassPage = () => {

  const { data: session } = useSession();
  const user = session?.user;

  const [category, setCategory] = useState("weights");
  const [difficulty, setDifficulty] = useState("beginner");

  const [selectedDays, setSelectedDays] = useState(["Mon", "Wed", "Fri"]);
  const [dayError, setDayError] = useState("");

  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const classTime = `${selectedHour}:${selectedMinute} ${period}`;

  const resetFormState = () => {
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
    setSelectedDays(["Mon", "Wed", "Fri"]);
    setCategory("weights");
    setDifficulty("beginner");
    setSelectedHour("08");
    setSelectedMinute("00");
    setPeriod("AM");
    setDayError("");
    setImageError("");
  };

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
      throw new Error("Please upload a class image.");
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    if (selectedDays.length === 0) {
      setDayError("Please select at least one class day.");
      return;
    }

    if (!imageFile) {
      setImageError("Please upload a class image.");
      return;
    }


    if (!user?.id) {
    alert("User not found. Please login again.");
    return;
    }

    try {
      setIsSubmitting(true);

      const imageUrl = await uploadImageToImgbb();

      const newClass = {
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
        status: "Pending",
        trainerId: user.id,
        createdAt: new Date().toISOString(),
      };

      // console.log("New Class Data:", newClass);

      const res = await createClass(newClass);
     if (res?.insertedId) {
        toast.success("Class added successfully.");
        formElement.reset();
        resetFormState();
       }
      // Later server API call example:
      // await fetch("/api/classes", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(newClass),
      // });

      // alert("Class added successfully with Pending status.");

      // formElement.reset();
      // resetFormState();
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-400">
          <FilePlus className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Class
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create a new fitness class. It will be submitted as Pending.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

        <Form
          aria-label="Add new class form"
          validationBehavior="native"
          onSubmit={handleSubmit}
          className="p-6"
        >
          <Fieldset className="w-full">
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#070b14] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Fieldset.Legend className="text-lg font-bold text-slate-900 dark:text-white">
                  Class Information
                </Fieldset.Legend>

                <Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Fill all required information to submit your class for admin
                  review.
                </Description>
              </div>

              <div className="w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300">
                Status: Pending
              </div>
            </div>

            <Fieldset.Group className="grid gap-5">
              {/* Class Name */}
              <TextField name="className" isRequired className="w-full">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Class Name
                </Label>

                <Input
                  placeholder="Fitness Class"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                />

                <FieldError className="mt-1 text-xs text-red-500">
                  Class name is required.
                </FieldError>
              </TextField>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Class Image
                </Label>

                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14] md:grid-cols-[120px_1fr]">
                  <div className="flex h-[120px] w-full items-center justify-center overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 md:w-[120px]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Class preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Picture className="h-10 w-10 text-pink-500" />
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <input
                      key={fileInputKey}
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                      className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-gradient-to-r file:from-fuchsia-500 file:via-pink-500 file:to-orange-400 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white dark:border-white/10 dark:bg-[#101624] dark:text-slate-300"
                    />

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Image will be uploaded to Imgbb first, then the image URL
                      will be saved.
                    </p>

                    {imageError && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {imageError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category + Difficulty */}
              <div className="grid gap-5 md:grid-cols-2">
                <Select
                  name="category"
                  value={category}
                  onChange={setCategory}
                  isRequired
                  placeholder="Select category"
                  className="w-full"
                >
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Category
                  </Label>

                  <Select.Trigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#070b14] dark:text-white">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>

                  <Select.Popover className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#101624]">
                    <ListBox>
                      {categories.map((item) => (
                        <ListBox.Item
                          key={item.id}
                          id={item.id}
                          textValue={item.label}
                          className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-pink-500/10 dark:text-slate-200"
                        >
                          {item.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>

                  <FieldError className="mt-1 text-xs text-red-500">
                    Category is required.
                  </FieldError>
                </Select>

                <Select
                  name="difficultyLevel"
                  value={difficulty}
                  onChange={setDifficulty}
                  isRequired
                  placeholder="Select difficulty"
                  className="w-full"
                >
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Difficulty Level
                  </Label>

                  <Select.Trigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#070b14] dark:text-white">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>

                  <Select.Popover className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#101624]">
                    <ListBox>
                      {difficultyLevels.map((item) => (
                        <ListBox.Item
                          key={item.id}
                          id={item.id}
                          textValue={item.label}
                          className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-pink-500/10 dark:text-slate-200"
                        >
                          {item.label}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>

                  <FieldError className="mt-1 text-xs text-red-500">
                    Difficulty level is required.
                  </FieldError>
                </Select>
              </div>

              {/* Duration + Price */}
              <div className="grid gap-5 md:grid-cols-2">
                <TextField name="duration" isRequired className="w-full">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Duration
                  </Label>

                  <Input
                    placeholder="e.g. 60 mins"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                  />

                  <FieldError className="mt-1 text-xs text-red-500">
                    Duration is required.
                  </FieldError>
                </TextField>

                <TextField name="price" isRequired className="w-full">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Price ($)
                  </Label>

                  <div className="relative mt-2">
                    <CircleDollar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="number"
                      min="0"
                      placeholder="25"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                    />
                  </div>

                  <FieldError className="mt-1 text-xs text-red-500">
                    Price is required.
                  </FieldError>
                </TextField>
              </div>

              {/* Schedule */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-[#070b14]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                    <Calendar className="h-5 w-5" />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Class Schedule
                    </Label>

                    <Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Select class days and time.
                    </Description>
                  </div>
                </div>

                {/* Schedule Days */}
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

                {/* Easy Time Picker */}
                <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <Select
                    value={selectedHour}
                    onChange={setSelectedHour}
                    className="w-full"
                  >
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Hour
                    </Label>

                    <Select.Trigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#101624] dark:text-white">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#101624]">
                      <ListBox>
                        {hours.map((item) => (
                          <ListBox.Item
                            key={item.id}
                            id={item.id}
                            textValue={item.label}
                            className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-pink-500/10 dark:text-slate-200"
                          >
                            {item.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    value={selectedMinute}
                    onChange={setSelectedMinute}
                    className="w-full"
                  >
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Minute
                    </Label>

                    <Select.Trigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-pink-500 dark:border-white/10 dark:bg-[#101624] dark:text-white">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>

                    <Select.Popover className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#101624]">
                      <ListBox>
                        {minutes.map((item) => (
                          <ListBox.Item
                            key={item.id}
                            id={item.id}
                            textValue={item.label}
                            className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-pink-500/10 dark:text-slate-200"
                          >
                            {item.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Period
                    </Label>

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

                <input type="hidden" name="classTime" value={classTime} />

                <div className="mt-4 rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-600 dark:text-pink-400">
                  Selected Time:{" "}
                  <span className="font-bold">{classTime}</span>
                </div>
              </div>

              {/* Description */}
              <TextField name="description" isRequired className="w-full">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Description
                </Label>

                <TextArea
                  rows={5}
                  placeholder="Describe the class..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                />

                <FieldError className="mt-1 text-xs text-red-500">
                  Description is required.
                </FieldError>
              </TextField>

              {/* Pending Note */}
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-700 dark:text-orange-300">
                Newly added classes will be saved with default status:{" "}
                <span className="font-bold">Pending</span>
              </div>
            </Fieldset.Group>

            <Fieldset.Actions className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
              >
                <FilePlus className="h-4 w-4" />
                {isSubmitting ? "Adding Class..." : "Add Class"}
              </Button>

              <Button
                type="reset"
                onClick={resetFormState}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-200 dark:hover:bg-white/5 sm:w-fit"
              >
                Reset
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </Card>
    </section>
  );
};

export default AddClassPage;
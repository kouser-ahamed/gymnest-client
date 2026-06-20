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
  TimeField,
} from "@heroui/react";
import {
  Calendar,
  CircleDollar,
  FilePlus,
  Picture,
} from "@gravity-ui/icons";

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

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddClassPage = () => {
  const [category, setCategory] = useState("weights");
  const [difficulty, setDifficulty] = useState("beginner");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Wed", "Fri"]);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dayError, setDayError] = useState("");

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

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

    setImageFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedDays.length === 0) {
      setDayError("Please select at least one class day.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const newClass = {
      className: formData.get("className"),
      image: imageFile,
      category,
      difficultyLevel: difficulty,
      duration: formData.get("duration"),
      schedule: {
        days: selectedDays,
        time: formData.get("classTime"),
      },
      price: Number(formData.get("price")),
      description: formData.get("description"),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    console.log("New Class Data:", newClass);

    // Later API call example:
    // await fetch("/api/classes", {
    //   method: "POST",
    //   body: formData,
    // });

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Class added successfully with Pending status.");
      event.currentTarget.reset();
      setImageFile(null);
      setSelectedDays(["Mon", "Wed", "Fri"]);
      setCategory("weights");
      setDifficulty("beginner");
    }, 600);
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

      <Card className="border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <Form
          aria-label="Add new class form"
          validationBehavior="native"
          onSubmit={handleSubmit}
          className="p-6"
        >
          <Fieldset className="w-full">
            <Fieldset.Legend className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
              Class Information
            </Fieldset.Legend>

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

                <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14] sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-pink-500/30 bg-pink-500/10">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Class preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Picture className="h-8 w-8 text-pink-500" />
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                      className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-600 file:mr-4 file:border-0 file:bg-gradient-to-r file:from-fuchsia-500 file:via-pink-500 file:to-orange-400 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-white dark:border-white/10 dark:bg-[#101624] dark:text-slate-300"
                    />

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Upload class thumbnail image. Later you can connect it with Imgbb.
                    </p>
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

              {/* Schedule Days */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Class Schedule Days
                  </Label>

                  <Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select one or more days for this class.
                  </Description>
                </div>

                <div className="flex flex-wrap gap-2">
                  {weekDays.map((day) => {
                    const isSelected = selectedDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400"
                            : "border-slate-200 bg-slate-50 text-slate-500 hover:border-pink-500/40 hover:text-pink-600 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-400"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {dayError && (
                  <p className="text-xs font-medium text-red-500">{dayError}</p>
                )}
              </div>

              {/* Time */}
              <TimeField
                name="classTime"
                isRequired
                hourCycle={12}
                granularity="minute"
                className="w-full"
              >
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Time
                </Label>

                <TimeField.Group className="mt-2 flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white">
                  <Calendar className="mr-1 h-4 w-4 text-slate-400" />

                  <TimeField.Input className="flex gap-1">
                    {(segment) => (
                      <TimeField.Segment
                        segment={segment}
                        className="rounded px-0.5 outline-none focus:bg-pink-500/10 focus:text-pink-600 dark:focus:text-pink-400"
                      />
                    )}
                  </TimeField.Input>
                </TimeField.Group>

                <FieldError className="mt-1 text-xs text-red-500">
                  Class time is required.
                </FieldError>
              </TimeField>

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
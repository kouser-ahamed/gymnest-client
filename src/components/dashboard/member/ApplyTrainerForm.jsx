"use client";

import { useEffect, useState } from "react";
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
} from "@heroui/react";
import {
  Calendar,
  CircleCheck,
  CircleXmark,
  PersonWorker,
  Star,
} from "@gravity-ui/icons";

const specialties = [
  { id: "Yoga", label: "Yoga" },
  { id: "Weights", label: "Weights" },
  { id: "Cardio", label: "Cardio" },
  { id: "Strength Training", label: "Strength Training" },
  { id: "Zumba", label: "Zumba" },
  { id: "HIIT", label: "HIIT" },
  { id: "Pilates", label: "Pilates" },
  { id: "General Fitness", label: "General Fitness" },
];

const getStatusStyle = (status) => {
  if (status === "Approved") {
    return {
      iconStyle:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
      badgeStyle:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      title: "Application Approved!",
      text: "Congratulations! Your trainer application has been approved by admin.",
    };
  }

  if (status === "Rejected") {
    return {
      iconStyle:
        "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400",
      badgeStyle:
        "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
      title: "Application Rejected",
      text: "Your trainer application has been reviewed and rejected by admin.",
    };
  }

  return {
    iconStyle:
      "border-orange-400/20 bg-orange-400/10 text-orange-500 dark:text-orange-300",
    badgeStyle:
      "border-orange-400/20 bg-orange-400/10 text-orange-600 dark:text-orange-300",
    title: "Application Submitted!",
    text: "Your trainer application is now pending review. You’ll be notified once the admin reviews it.",
  };
};

const ApplicationStatusCard = ({ application }) => {
  const status = application?.status || "Pending";
  const statusStyle = getStatusStyle(status);

  return (
    <Card className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-10">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${statusStyle.iconStyle}`}
      >
        {status === "Rejected" ? (
          <CircleXmark className="h-9 w-9" />
        ) : (
          <CircleCheck className="h-9 w-9" />
        )}
      </div>

      <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
        {statusStyle.title}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
        {statusStyle.text}
      </p>

      <div
        className={`mx-auto mt-6 w-fit rounded-2xl border px-5 py-3 text-sm font-black ${statusStyle.badgeStyle}`}
      >
        Current Status: {status}
      </div>

      <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Experience
          </p>

          <p className="mt-1 font-black text-slate-900 dark:text-white">
            {application?.experience || 0} Years
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14]">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Category
          </p>

          <p className="mt-1 font-black text-slate-900 dark:text-white">
            {application?.specialty || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
};

const ApplyTrainerForm = ({ user }) => {
  const [specialty, setSpecialty] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const getApplicationStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/apply-trainer?userId=${encodeURIComponent(
            user?.id || ""
          )}&email=${encodeURIComponent(user?.email || "")}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (data?._id) {
          setApplication(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsChecking(false);
      }
    };

    if (user?.id || user?.email) {
      getApplicationStatus();
    }
  }, [user?.id, user?.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const experience = formData.get("experience");
    const bio = formData.get("bio");

    setMessage({ type: "", text: "" });

    if (!experience || !specialty) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const applyData = {
      userId: user?.id,
      name: user?.name,
      email: user?.email,
      experience: Number(experience),
      specialty,
      bio,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/apply-trainer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applyData),
        }
      );

      const result = await response.json();

      if (result?.insertedId) {
        setApplication({
          ...applyData,
          _id: result.insertedId,
        });

        formElement.reset();
        setSpecialty("");
      } else {
        setMessage({
          type: "error",
          text: "Failed to submit application.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-white px-4 py-8 dark:bg-[#050914] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] md:flex-row md:items-end">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30">
              <PersonWorker className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
                Member Application
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Apply as Trainer
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Share your experience and training category. Our admin team will
                review your application and keep the status as Pending.
              </p>
            </div>
          </div>

          <div className="w-fit rounded-2xl border border-orange-400/20 bg-orange-400/10 px-5 py-3 text-sm font-black text-orange-600 dark:text-orange-300">
            Status: {application?.status || "Pending"}
          </div>
        </div>

        {isChecking ? (
          <Card className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Checking application status...
            </p>
          </Card>
        ) : application?._id ? (
          <ApplicationStatusCard application={application} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left Info Card */}
            <Card className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/15 via-pink-500/15 to-orange-400/15 text-pink-600 dark:text-pink-300">
                  <Star className="h-8 w-8" />
                </div>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Trainer Request
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Submit your trainer application with your experience and main
                  category. Admin will review your request from the dashboard.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-pink-600 dark:text-pink-300">
                      Applicant
                    </p>

                    <p className="mt-1 font-black text-slate-900 dark:text-white">
                      {user?.name || "Member"}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">
                      {user?.email || "No email"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-orange-400/20 bg-orange-400/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600 dark:text-orange-300">
                      Review Status
                    </p>

                    <p className="mt-1 font-black text-slate-900 dark:text-white">
                      Pending
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Form Card */}
            <Card className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
              <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

              <Form
                aria-label="Apply as trainer form"
                validationBehavior="native"
                onSubmit={handleSubmit}
                className="p-5 sm:p-7"
              >
                <Fieldset className="w-full">
                  <Fieldset.Group className="grid gap-5">
                    <TextField name="experience" isRequired className="w-full">
                      <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Years of Experience
                      </Label>

                      <div className="relative mt-2">
                        <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-500" />

                        <Input
                          type="number"
                          min="0"
                          placeholder="Enter your experience"
                          className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>

                      <FieldError className="mt-1 text-xs text-red-500">
                        Experience is required.
                      </FieldError>
                    </TextField>

                    <Select
                      name="specialty"
                      value={specialty}
                      onChange={setSpecialty}
                      isRequired
                      placeholder="Select category"
                      className="w-full"
                    >
                      <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Category / Specialty
                      </Label>

                      <Select.Trigger className="mt-2 flex h-13 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition hover:border-pink-500/50 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white">
                        <div className="flex items-center gap-3">
                          <Star className="h-4 w-4 text-pink-500" />
                          <Select.Value />
                        </div>

                        <Select.Indicator />
                      </Select.Trigger>

                      <Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Select your main training category.
                      </Description>

                      <Select.Popover className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#101624]">
                        <ListBox>
                          {specialties.map((item) => (
                            <ListBox.Item
                              key={item.id}
                              id={item.id}
                              textValue={item.label}
                              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:bg-pink-500/10 hover:text-pink-600 data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-fuchsia-500/15 data-[selected=true]:via-pink-500/15 data-[selected=true]:to-orange-400/15 data-[selected=true]:text-pink-600 dark:text-slate-200 dark:hover:bg-pink-500/10 dark:hover:text-pink-300 dark:data-[selected=true]:text-pink-300"
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

                    <TextField name="bio" className="w-full">
                      <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Bio / Description
                      </Label>

                      <TextArea
                        rows={5}
                        placeholder="Tell us about your training background, certifications, and what you'd like to teach..."
                        className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white dark:placeholder:text-slate-500"
                      />

                      <Description className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Optional, but helpful for admin review.
                      </Description>
                    </TextField>

                    {message.text && (
                      <div
                        className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold ${
                          message.type === "success"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {message.type === "success" ? (
                          <CircleCheck className="h-5 w-5 shrink-0" />
                        ) : (
                          <CircleXmark className="h-5 w-5 shrink-0" />
                        )}

                        <span>{message.text}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-1 h-12 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-black text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </Fieldset.Group>
                </Fieldset>
              </Form>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplyTrainerForm;
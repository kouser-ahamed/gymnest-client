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
  TextArea,
  TextField,
} from "@heroui/react";
import { FilePlus, Picture } from "@gravity-ui/icons";
import { FiImage, FiSend, FiType, FiUserCheck } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postCommunityForumPost } from "@/lib/actions/community-forum-post";
// import { createForumPost } from "@/lib/actions/forum";

const ForumPostForm = ({
  user,
  role,
  redirectPath,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  const roleLabel = role === "admin" ? "Admin" : "Trainer";

  const resetFormState = () => {
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
    setImageError("");
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
      throw new Error("Please upload a forum image.");
    }

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imageData,
      },
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

    if (!imageFile) {
      setImageError("Please upload a forum image.");
      return;
    }

    if (!user?.id) {
      toast.error("User not found. Please login again.", {
        position: "top-right",
        autoClose: 1800,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const imageUrl = await uploadImageToImgbb();

      const newPost = {
        title: formData.get("title"),
        image: imageUrl,
        description: formData.get("description"),
        status: "Published",
        authorId: user.id,
        // authorName: user?.name || "",
        // authorEmail: user?.email || "",
        // authorImage: user?.image || "",
        authorRole: role,
        createdAt: new Date().toISOString(),
      };

      //   const res = await createForumPost(newPost);

      const res = await postCommunityForumPost(newPost);

      if (res?.insertedId) {
        toast.success("Forum post created successfully!", {
          position: "top-right",
          autoClose: 1500,
        });

        formElement.reset();
        resetFormState();

        setTimeout(() => {
          window.location.href = redirectPath;
        }, 1700);
      } else {
        toast.error(res?.message || "Failed to create forum post.", {
          position: "top-right",
          autoClose: 1800,
        });
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        autoClose: 1800,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName="!rounded-2xl !border !border-slate-200 !bg-white !text-slate-900 !shadow-lg !shadow-pink-500/10 dark:!border-white/10 dark:!bg-[#101624] dark:!text-white dark:!shadow-pink-500/20"
        bodyClassName="!text-sm !font-semibold !text-slate-900 dark:!text-white"
        progressClassName="!bg-gradient-to-r !from-fuchsia-500 !via-pink-500 !to-orange-400"
      />

      {/* Page Header */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-[#101624] sm:flex-row sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-600 dark:text-pink-400">
          <FilePlus className="h-6 w-6" />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add Forum Post
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Share useful fitness knowledge with the GymNest community.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-semibold text-pink-600 dark:text-pink-400">
          <FiUserCheck className="h-4 w-4" />
          {roleLabel}
        </div>
      </div>

      <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#101624]">
        <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400" />

        <Form
          aria-label="Community forum post form"
          validationBehavior="native"
          onSubmit={handleSubmit}
          className="p-4 sm:p-6"
        >
          <Fieldset className="w-full">
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-[#070b14] sm:p-5 md:flex-row md:items-center md:justify-between md:text-left">
              <div>
                <Fieldset.Legend className="text-lg font-bold text-slate-900 dark:text-white">
                  Community Forum Information
                </Fieldset.Legend>

                <Description className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add a title, upload an image, and write a helpful description.
                </Description>
              </div>

              <div className="mx-auto w-fit rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-600 dark:text-orange-300 md:mx-0">
                Status: Published
              </div>
            </div>

            <Fieldset.Group className="grid gap-5">
              {/* Title */}
              <TextField name="title" isRequired className="w-full">
                <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <FiType className="h-4 w-4 text-pink-500" />
                  Title
                </Label>

                <Input
                  placeholder="e.g. 5 Tips for Better Strength Training"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                />

                <FieldError className="mt-1 text-xs text-red-500">
                  Title is required.
                </FieldError>
              </TextField>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:justify-start">
                  <FiImage className="h-4 w-4 text-pink-500" />
                  Forum Image
                </Label>

                <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#070b14] md:grid-cols-[180px_1fr]">
                  <div className="mx-auto flex h-[160px] w-full max-w-[260px] items-center justify-center overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 md:mx-0 md:h-[140px] md:w-[180px]">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Forum preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Picture className="h-12 w-12 text-pink-500" />
                    )}
                  </div>

                  <div className="flex flex-col justify-center text-center md:text-left">
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
                      will be saved with the forum post.
                    </p>

                    {imageError && (
                      <p className="mt-2 text-xs font-medium text-red-500">
                        {imageError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <TextField name="description" isRequired className="w-full">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Description
                </Label>

                <TextArea
                  rows={7}
                  placeholder="Write your forum post description..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
                />

                <FieldError className="mt-1 text-xs text-red-500">
                  Description is required.
                </FieldError>
              </TextField>

              <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-center text-sm text-pink-700 dark:text-pink-300 sm:text-left">
                This post will be published in the Community Forum as a{" "}
                <span className="font-bold capitalize">{role}</span> post.
              </div>
            </Fieldset.Group>

            <Fieldset.Actions className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="reset"
                onClick={resetFormState}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-200 dark:hover:bg-white/5 sm:w-fit"
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
              >
                <FiSend className="h-4 w-4" />
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </Card>
    </section>
  );
};

export default ForumPostForm;

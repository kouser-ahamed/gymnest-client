"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Person,
  Lock,
  Envelope,
  Camera,
  Eye,
  EyeSlash,
  Check,
  ShieldCheck,
  CircleCheck,
  CircleExclamation,
  Pencil,
  ArrowRight,
} from "@gravity-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTokenClient } from "@/lib/getTokenClient";
import { isDemoUser } from "@/lib/demoMode";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5000";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function SettingsView({ initialUser = null, role = "member" }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  // User state
  const [user, setUser] = useState(initialUser);
  const [isUserLoading, setIsUserLoading] = useState(!initialUser);

  const isDemo = isDemoUser(user);
  const displayedEmail = user?.email || "";

  // 1. Profile Edit Toggle State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(initialUser?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialUser?.image || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // 2. Password Management State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // 3. Email Change (Two-Step Verification) State
  // 'idle' | 'verify' (step 1) | 'update' (step 2)
  const [emailStep, setEmailStep] = useState("idle");
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [showEmailCurrentPassword, setShowEmailCurrentPassword] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // Fetch current user details if not provided via SSR
  useEffect(() => {
    let isMounted = true;

    if (!initialUser) {
      getTokenClient().then(({ data: tokenData }) => {
        const token = tokenData?.token;
        if (!token || !isMounted) return;

        fetch(`${apiBaseUrl}/api/users/current`, {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store",
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data && isMounted) {
              setUser(data);
              setName(data.name || "");
              setImagePreview(data.image || "");
            }
          })
          .catch((err) => {
            console.error("Failed to fetch user in Settings:", err);
          })
          .finally(() => {
            if (isMounted) setIsUserLoading(false);
          });
      });
    }

    return () => {
      isMounted = false;
    };
  }, [initialUser]);

  // Password validation checks
  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;
  const isNewPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  // Handle avatar file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please upload a valid image file (PNG, JPG, JPEG, WEBP, GIF, etc.)."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be under 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Upload image to ImgBB
  const uploadToImgBB = async (file) => {
    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API key is not configured.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!data?.success) {
      throw new Error(
        data?.error?.message || "Failed to upload image to ImgBB."
      );
    }

    return data.data.display_url || data.data.url;
  };

  // 1. Profile Update Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (isDemo) {
      toast.info("Action disabled in demo/guest mode.");
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters long.");
      return;
    }

    setIsSavingProfile(true);

    try {
      let finalImageUrl = user?.image || "";

      if (imageFile) {
        setIsUploadingImage(true);
        try {
          finalImageUrl = await uploadToImgBB(imageFile);
        } catch (imgErr) {
          toast.error(imgErr.message || "Failed to upload avatar image.");
          setIsSavingProfile(false);
          setIsUploadingImage(false);
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const { data: tokenData } = await getTokenClient();
      const token = tokenData?.token;

      const res = await fetch(`${apiBaseUrl}/api/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          image: finalImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      setUser((prev) => ({
        ...prev,
        name: data.user?.name || name.trim(),
        image: data.user?.image || finalImageUrl,
      }));

      setImageFile(null);
      setIsEditingProfile(false);
      toast.success(data.message || "Profile updated successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Password Set or Change Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (isDemo) {
      toast.info("Action disabled in demo/guest mode.");
      return;
    }

    if (!isNewPasswordValid) {
      toast.error("Please fulfill all password requirements.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    const isSettingPassword = !user?.hasPassword;

    if (!isSettingPassword && !currentPassword) {
      toast.error("Current password is required.");
      return;
    }

    if (!isSettingPassword && currentPassword === newPassword) {
      toast.error("New password must be different from your current password.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const { data: tokenData } = await getTokenClient();
      const token = tokenData?.token;

      const endpoint = isSettingPassword
        ? `${apiBaseUrl}/api/users/set-password`
        : `${apiBaseUrl}/api/users/change-password`;

      const payload = isSettingPassword
        ? { newPassword, confirmPassword }
        : { currentPassword, newPassword, confirmPassword };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password update failed.");
      }

      toast.success(data.message || "Password updated successfully!");

      // Clear password form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Automatically transition Google/first-time user to standard flow
      setUser((prev) => ({
        ...prev,
        hasPassword: true,
      }));
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // 3A. Email Step 1: Verify Current Password
  const handleVerifyPasswordForEmail = async (e) => {
    e.preventDefault();

    if (isDemo) {
      toast.info("Action disabled in demo/guest mode.");
      return;
    }

    if (!emailCurrentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    setIsVerifyingPassword(true);

    try {
      const { data: tokenData } = await getTokenClient();
      const token = tokenData?.token;

      const res = await fetch(`${apiBaseUrl}/api/users/verify-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: emailCurrentPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Current password is incorrect.");
      }

      toast.success("Identity verified! You can now enter your new email.");
      setEmailStep("update");
    } catch (err) {
      toast.error(err.message || "Password verification failed.");
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  // 3B. Email Step 2: Commit New Email
  const handleSaveEmail = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (trimmedEmail === user?.email?.toLowerCase()) {
      toast.error("New email must be different from your current email.");
      return;
    }

    setIsSavingEmail(true);

    try {
      const { data: tokenData } = await getTokenClient();
      const token = tokenData?.token;

      const res = await fetch(`${apiBaseUrl}/api/users/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: trimmedEmail,
          currentPassword: emailCurrentPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update email address.");
      }

      toast.success(
        data.message ||
          "Email updated successfully! Please use this email for future logins."
      );

      setUser((prev) => ({
        ...prev,
        email: trimmedEmail,
      }));

      // Reset email change flow back to idle
      setNewEmail("");
      setEmailCurrentPassword("");
      setEmailStep("idle");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSavingEmail(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-pink-500/20 border-t-pink-500" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading your settings...
        </p>
      </div>
    );
  }

  const roleTitle =
    role === "admin" ? "Admin" : role === "trainer" ? "Trainer" : "Member";

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* ========================================================================= */}
      {/* 1. TOP PROFILE HEADER (OVERVIEW CARD) */}
      {/* ========================================================================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220] md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Left: Avatar & Right: Name + Email */}
          <div className="flex items-center gap-5">
            {/* Left: Profile picture */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-pink-500/40 p-0.5 shadow-md">
              <Image
                referrerPolicy="no-referrer"
                src={imagePreview || user?.image || "/assets/default-user.png"}
                alt={user?.name || "User Avatar"}
                width={80}
                height={80}
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            {/* Right: Display name at top, email directly underneath */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                  {user?.name || "User"}
                </h1>
                <span className="rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-pink-600 dark:text-pink-400 border border-pink-500/20">
                  {roleTitle}
                </span>
                {isDemo && (
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {displayedEmail}
              </p>
            </div>
          </div>

          {/* Action: "Edit Profile" Toggle Button */}
          <div>
            <button
              type="button"
              disabled={isDemo}
              onClick={() => {
                if (isDemo) {
                  toast.info("Action disabled in demo/guest mode.");
                  return;
                }
                setIsEditingProfile((prev) => !prev);
                if (!isEditingProfile) {
                  setName(user?.name || "");
                  setImagePreview(user?.image || "");
                  setImageFile(null);
                }
              }}
              title={isDemo ? "Action disabled in demo/guest mode" : "Edit Profile"}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold shadow-xs transition ${
                isDemo
                  ? "cursor-not-allowed opacity-50 border-slate-200 bg-slate-100 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10"
              }`}
            >
              <Pencil className="h-3.5 w-3.5 text-pink-500" />
              {isEditingProfile ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PROFILE EDIT BEHAVIOR (WHEN "EDIT PROFILE" IS CLICKED) */}
        {/* ========================================================================= */}
        {isEditingProfile && (
          <form
            onSubmit={handleProfileSubmit}
            className="mt-6 border-t border-slate-100 pt-6 dark:border-white/10 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Selection & Preview */}
              <div className="relative group">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-dashed border-pink-500/60 p-1 shadow-inner">
                  <Image
                    referrerPolicy="no-referrer"
                    src={
                      imagePreview || user?.image || "/assets/default-user.png"
                    }
                    alt={name || "User Avatar"}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-full object-cover"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span className="mt-1 text-[10px] font-semibold">
                        Uploading...
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera upload icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSavingProfile || isUploadingImage}
                  title="Upload new avatar"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Update Profile Picture
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standard formats accepted: PNG, JPG, JPEG, WEBP, GIF (up to
                  5MB via ImgBB).
                </p>

                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSavingProfile || isUploadingImage}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 disabled:opacity-50"
                  >
                    Select Image
                  </button>

                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(user?.image || "");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
                    >
                      Revert
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Input: Full Name */}
            <div>
              <label
                htmlFor="edit-full-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
              >
                Full Name <span className="text-pink-500">*</span>
              </label>
              <input
                id="edit-full-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-pink-500"
              />
            </div>

            {/* Buttons: Save Profile & Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(false);
                  setName(user?.name || "");
                  setImagePreview(user?.image || "");
                  setImageFile(null);
                }}
                disabled={isSavingProfile || isUploadingImage}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSavingProfile || isUploadingImage}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-500/20 transition-all hover:opacity-95 hover:shadow-pink-500/30 active:scale-95 disabled:opacity-50"
              >
                {isSavingProfile ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SECURITY TAB / SECTION */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 dark:bg-pink-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Security & Credentials
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your password credentials and update your verified email address.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------------- */}
        {/* 3A. PASSWORD MANAGEMENT */}
        {/* ------------------------------------------------------------------------- */}
        <section
          id="password-management"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220] md:p-8"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-500 dark:bg-fuchsia-500/20">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Password Management
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.hasPassword
                    ? "Change your password regularly to keep your account safe."
                    : "Create a password for your account to enable password sign-in."}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                user?.hasPassword
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {user?.hasPassword ? "Password Set" : "No Password Set"}
            </span>
          </div>

          {/* Google First-Time Notice */}
          {!user?.hasPassword && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-700 dark:text-amber-300">
              <CircleExclamation className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="font-bold">Google / OAuth Account:</strong>{" "}
                You currently log in via Google without a password. Set a
                password below to allow logging in with your email & password and
                to verify your identity when changing your email.
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
            {/* Standard Flow: Requires Current (Old) Password */}
            {user?.hasPassword && (
              <div>
                <label
                  htmlFor="current-old-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
                >
                  Current (Old) Password <span className="text-pink-500">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="current-old-password"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-white"
                  >
                    {showCurrentPassword ? (
                      <EyeSlash className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* New Password & Confirm Password (Shown for both Google & Standard) */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="security-new-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
                >
                  New Password <span className="text-pink-500">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="security-new-password"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeSlash className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="security-confirm-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
                >
                  Confirm Password <span className="text-pink-500">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="security-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeSlash className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Validation Checklist */}
            {newPassword.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
                <p className="text-xs font-semibold text-slate-600 dark:text-neutral-300">
                  Password Requirements:
                </p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {hasMinLength ? (
                      <CircleCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-neutral-600" />
                    )}
                    <span
                      className={
                        hasMinLength
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    >
                      At least 6 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasUppercase ? (
                      <CircleCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-neutral-600" />
                    )}
                    <span
                      className={
                        hasUppercase
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    >
                      At least 1 uppercase letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasLowercase ? (
                      <CircleCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-neutral-600" />
                    )}
                    <span
                      className={
                        hasLowercase
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    >
                      At least 1 lowercase letter (a-z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {passwordsMatch ? (
                      <CircleCheck className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 dark:border-neutral-600" />
                    )}
                    <span
                      className={
                        passwordsMatch
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    >
                      Passwords match
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Save Password Button */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 pt-2">
              {isDemo ? (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Password modification is disabled in demo mode.
                </p>
              ) : <div />}

              <button
                type="submit"
                disabled={
                  isDemo || isSavingPassword || !isNewPasswordValid || !passwordsMatch
                }
                title={isDemo ? "Action disabled in demo/guest mode" : "Save Password"}
                className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all ${
                  isDemo
                    ? "cursor-not-allowed opacity-50 bg-slate-400 dark:bg-slate-700 shadow-none"
                    : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 shadow-pink-500/20 hover:opacity-95 hover:shadow-pink-500/30 active:scale-95 disabled:opacity-50"
                }`}
              >
                {isSavingPassword ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving Password...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" /> Save Password
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ------------------------------------------------------------------------- */}
        {/* 3B. EMAIL CHANGE FLOW (TWO-STEP VERIFICATION) */}
        {/* ------------------------------------------------------------------------- */}
        <section
          id="email-change-flow"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220] md:p-8"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 dark:bg-orange-500/20">
                <Envelope className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Email Address
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your primary email with two-step password verification.
                </p>
              </div>
            </div>

            {emailStep !== "idle" && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-600 dark:text-pink-400 border border-pink-500/20">
                {emailStep === "verify" ? "Step 1 of 2: Verify Identity" : "Step 2 of 2: Enter New Email"}
              </span>
            )}
          </div>

          {/* STATE 1: IDLE - Shows Current Email & "Change Email" Button */}
          {emailStep === "idle" && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Current Email Address
                </span>
                <p className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
                  {displayedEmail}
                </p>
                {isDemo && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Email changes are disabled in demo mode.
                  </p>
                )}
              </div>

              <div>
                <button
                  type="button"
                  disabled={isDemo}
                  title={isDemo ? "Action disabled in demo/guest mode" : "Change Email"}
                  onClick={() => {
                    if (isDemo) {
                      toast.info("Action disabled in demo/guest mode.");
                      return;
                    }
                    if (!user?.hasPassword) {
                      toast.info(
                        "Please set a password in Password Management first to verify your identity."
                      );
                      const el = document.getElementById("password-management");
                      el?.scrollIntoView({ behavior: "smooth" });
                      return;
                    }
                    setEmailStep("verify");
                  }}
                  className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                    isDemo
                      ? "cursor-not-allowed opacity-50 bg-slate-400 dark:bg-slate-700 shadow-none"
                      : "bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 shadow-orange-500/20 hover:opacity-95 hover:shadow-orange-500/30 active:scale-95"
                  }`}
                >
                  Change Email <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: STEP 1 - CURRENT PASSWORD VERIFICATION */}
          {emailStep === "verify" && (
            <form onSubmit={handleVerifyPasswordForEmail} className="mt-6 space-y-5">
              <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4 text-xs text-pink-700 dark:text-pink-300 leading-relaxed">
                <strong className="font-bold">Step 1 of 2 (Verification):</strong>{" "}
                Please enter your current password to confirm your identity before changing your email address.
              </div>

              <div>
                <label
                  htmlFor="verify-step-password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
                >
                  Current Password <span className="text-pink-500">*</span>
                </label>
                <div className="relative mt-2">
                  <input
                    id="verify-step-password"
                    type={showEmailCurrentPassword ? "text" : "password"}
                    required
                    autoFocus
                    value={emailCurrentPassword}
                    onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    placeholder="Enter current password to verify"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-pink-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowEmailCurrentPassword((prev) => !prev)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-white"
                  >
                    {showEmailCurrentPassword ? (
                      <EyeSlash className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailStep("idle");
                    setEmailCurrentPassword("");
                  }}
                  disabled={isVerifyingPassword}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifyingPassword || !emailCurrentPassword}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-pink-500/20 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
                >
                  {isVerifyingPassword ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Password <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STATE 3: STEP 2 - ENTER NEW EMAIL AND COMMIT */}
          {emailStep === "update" && (
            <form onSubmit={handleSaveEmail} className="mt-6 space-y-5">
              {/* Verified Identity Badge & Current Email Display */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Current Email:
                  </span>
                  <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {displayedEmail}
                  </p>
                </div>
                <span className="self-start sm:self-center flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Check className="h-3.5 w-3.5" /> Identity Verified
                </span>
              </div>

              <div>
                <label
                  htmlFor="verified-new-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-neutral-400"
                >
                  New Email Address <span className="text-pink-500">*</span>
                </label>
                <input
                  id="verified-new-email"
                  type="email"
                  required
                  autoFocus
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address (e.g. name@example.com)"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-pink-500"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                <strong>Note:</strong> Once updated, your new email will be required for all future logins.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmailStep("idle");
                    setEmailCurrentPassword("");
                    setNewEmail("");
                  }}
                  disabled={isSavingEmail}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 dark:hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingEmail || !newEmail}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
                >
                  {isSavingEmail ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving Email...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" /> Save Email
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

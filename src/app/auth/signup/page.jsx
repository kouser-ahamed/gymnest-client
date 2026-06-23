"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import {
  CircleCheck,
  CircleXmark,
  Picture,
  Eye,
  EyeSlash,
} from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import PasswordRules from "@/components/PasswordRules";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    return hasMinLength && hasUppercase && hasLowercase;
  };

  const uploadImageToImgbb = async () => {
    if (!imageFile) return "";

    const imageData = new FormData();
    imageData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const data = await res.json();

    if (!data?.success) {
      throw new Error("Image upload failed. Please try again.");
    }

    return data.data.url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload a valid image file." });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage({ type: "", text: "" });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage({
        type: "error",
        text: "Please fulfill all password requirements.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const imageUrl = await uploadImageToImgbb();

      const result = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl || undefined,
        role: "member",
        plan: "free",
      });

      if (result?.error) {
        setMessage({
          type: "error",
          text: result.error.message || "Signup failed. Please try again.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created successfully! Redirecting to sign in...",
      });

      setFormData({ name: "", email: "", password: "" });
      setImageFile(null);
      setImagePreview("");

      setTimeout(() => {
        router.push(`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`);
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#0c1220] dark:shadow-black/40">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Join GymNest as a member and start your fitness journey.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border-red-500/20 bg-red-500/10 text-red-500"
            }`}
          >
            {message.type === "success" ? (
              <CircleCheck className="h-5 w-5" />
            ) : (
              <CircleXmark className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            className="w-full"
            placeholder="Enter your full name"
            label="Name"
            type="text"
            variant="bordered"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            className="w-full"
            placeholder="Enter your email"
            label="Email"
            type="email"
            variant="bordered"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <div className="relative">
            <Input
              className="w-full"
              placeholder="Enter your password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400"
            >
              {showPassword ? (
                <EyeSlash className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <PasswordRules password={formData.password} />

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-pink-500 hover:bg-pink-500/5 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <Picture className="h-6 w-6 text-pink-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-white">
                  Upload profile image
                </span>
              </div>

              <span className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                PNG, JPG, JPEG supported
              </span>
            </div>

            <div className="flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="preview"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border border-pink-500 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed text-xs text-gray-400">
                  +
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <Button
            type="submit"
            isLoading={isLoading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/30 hover:opacity-90"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600 dark:border-white/5 dark:text-neutral-400">
          Already have an account?{" "}
          <Link
            href={`/auth/signin?redirect=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-pink-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
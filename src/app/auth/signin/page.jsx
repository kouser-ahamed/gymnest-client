"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import {
  CircleCheck,
  CircleXmark,
  Eye,
  EyeSlash,
} from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // credential login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.email || !formData.password) {
      setMessage({
        type: "error",
        text: "Please fill in all fields.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/", // redirect to home page after successful login
      });

      if (result?.error) {
        setMessage({
          type: "error",
          text: result.error.message || "Invalid email or password.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Logged in successfully! Redirecting...",
      });

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // google oauth login handler
  const handleGoogleLogin = async () => {
    setMessage({ type: "", text: "" });
    setIsGoogleLoading(true);
    
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // redirect to home page after google authentication
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Google sign-in failed. Please try again.",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-4 py-10 dark:bg-[#0c1220]">
      {/* container */}
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#0c1220] dark:shadow-black/40">
        
        {/* title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Sign in to your GymNest account to continue your journey.
          </p>
        </div>

        {/* alerts / messages */}
        {message.text && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400"
                : "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400"
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

        {/* credentials form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            className="w-full text-slate-900 dark:text-white"
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
              className="w-full text-slate-900 dark:text-white"
              placeholder="Enter your password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="bordered"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* password visibility toggle eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeSlash className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* submit button */}
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isGoogleLoading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/30 dark:shadow-pink-500/10 hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* or divider */}
        <div className="my-5 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
          <span>or</span>
          <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
        </div>

        {/* google login button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          isLoading={isGoogleLoading}
          disabled={isLoading}
          variant="bordered"
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 text-base font-bold text-slate-800 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          {!isGoogleLoading && (
            <FcGoogle className="text-2xl shrink-0" />
          )}
          <span>Continue with Google</span>
        </Button>

        {/* footer switch */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-neutral-400 border-t border-slate-100 dark:border-white/5 pt-4">
          Don&apos;t have an account?{" "}
          <NextLink href="/auth/signup" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-500 font-semibold transition-colors ml-1">
            Sign Up
          </NextLink>
        </div>

      </div>
    </section>
  );
}
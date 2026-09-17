"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { CircleCheck, CircleXmark, Eye, EyeSlash } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { DEMO_CREDENTIALS, resolvePostLoginRedirect } from "@/lib/demoMode";

// 1. This fallback skeleton renders on the server while the client loads the query params
const LoginPageLoading = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4 py-10 dark:bg-[#0c1220]">
      <div className="flex items-center gap-3 rounded-full border border-pink-500/20 bg-white/80 px-5 py-3 shadow-lg shadow-pink-500/10 dark:border-white/10 dark:bg-white/5">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500 dark:border-white/10 dark:border-t-pink-400" />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
          Loading Sign In
        </span>
      </div>
    </section>
  );
};

// 2. The form layout isolated so useSearchParams doesn't break the entire page generation
const LoginPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl =
    searchParams.get("callbackUrl") ||
    searchParams.get("callbackURL") ||
    searchParams.get("redirect") ||
    searchParams.get("from") ||
    searchParams.get("returnUrl") ||
    "/";
  const redirectTo = rawCallbackUrl;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [demoRoleLoading, setDemoRoleLoading] = useState("");

  // 1. Standard Form Login: Inspect user role and route to callback URL or role dashboard
  const handleNormalLogin = async (e) => {
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
      });

      if (result?.error) {
        setMessage({
          type: "error",
          text: result.error.message || "Invalid email or password.",
        });
        setIsLoading(false);
        return;
      }

      // Inspect the user object's role
      let userRole = result?.data?.user?.role;

      // Fallback: check session if role was not directly on data.user
      if (!userRole) {
        try {
          const sessionRes = await authClient.getSession();
          userRole = sessionRes?.data?.user?.role;
        } catch (_) {}
      }

      // Fallback: verify against demo credentials or default to member
      if (!userRole) {
        const emailLower = (formData.email || "").toLowerCase().trim();
        if (emailLower === DEMO_CREDENTIALS.admin.email.toLowerCase()) {
          userRole = "admin";
        } else if (emailLower === DEMO_CREDENTIALS.trainer.email.toLowerCase()) {
          userRole = "trainer";
        } else {
          userRole = "member";
        }
      }

      const targetRoute = resolvePostLoginRedirect(searchParams, userRole);

      setMessage({
        type: "success",
        text: "Logged in successfully! Redirecting...",
      });

      // Immediately navigate to the destination route
      router.replace(targetRoute);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleLogin = handleNormalLogin;

  // 2. Guest / Demo Login: Route immediately to destination callback URL if allowed, or role dashboard
  const handleGuestLogin = async (roleKey) => {
    const creds = DEMO_CREDENTIALS[roleKey];
    if (!creds) return;

    setMessage({ type: "", text: "" });
    setDemoRoleLoading(roleKey);
    setIsLoading(true);

    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("gymnest_demo_mode", "true");
        sessionStorage.setItem("gymnest_demo_role", roleKey);
      }

      const result = await authClient.signIn.email({
        email: creds.email,
        password: creds.password,
      });

      if (result?.error) {
        setMessage({
          type: "error",
          text: result.error.message || `Failed to sign in as ${creds.label}.`,
        });
        setIsLoading(false);
        setDemoRoleLoading("");
        return;
      }

      const role = creds.role || roleKey;
      const targetRoute = resolvePostLoginRedirect(searchParams, role);

      setMessage({
        type: "success",
        text: `Signed in as ${creds.label}! Redirecting...`,
      });

      // Route immediately based on callback URL or role default dashboard
      router.replace(targetRoute);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
      setIsLoading(false);
      setDemoRoleLoading("");
    }
  };

  const handleDemoLogin = handleGuestLogin;

  // 3. Google OAuth Login: Delegate callback to dedicated auth callback page with destination preservation
  const handleGoogleLogin = async () => {
    setMessage({ type: "", text: "" });
    setIsGoogleLoading(true);

    try {
      const candidateParam =
        searchParams.get("callbackUrl") ||
        searchParams.get("callbackURL") ||
        searchParams.get("redirect") ||
        searchParams.get("from") ||
        searchParams.get("returnUrl");

      let callbackURL =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : "/auth/callback";

      if (candidateParam) {
        callbackURL += `?redirect=${encodeURIComponent(candidateParam)}`;
      }

      await authClient.signIn.social({
        provider: "google",
        callbackURL,
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
    <section className="flex min-h-screen items-center justify-center bg-white px-4 py-10 dark:bg-[#0c1220]">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#0c1220] dark:shadow-black/40">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
            Sign in to your GymNest account to continue your journey.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
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

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeSlash className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isLoading && !demoRoleLoading}
            disabled={isGoogleLoading || !!demoRoleLoading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/30 transition-opacity hover:opacity-90 dark:shadow-pink-500/10"
          >
            {isLoading && !demoRoleLoading ? "Signing In..." : "Sign In"}
          </Button>

          {/* Row of 3 Demo/Guest Buttons directly below Sign In */}
          <div className="pt-2">
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Demo Accounts
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                1-Click Sign In
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => handleDemoLogin("member")}
                className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-2.5 px-2 text-center text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              >
                {demoRoleLoading === "member" ? "Signing In..." : "Guest Member"}
              </button>

              <button
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => handleDemoLogin("trainer")}
                className="flex-1 rounded-xl border border-blue-500/30 bg-blue-500/10 py-2.5 px-2 text-center text-xs font-bold text-blue-600 transition hover:bg-blue-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
              >
                {demoRoleLoading === "trainer" ? "Signing In..." : "Guest Trainer"}
              </button>

              <button
                type="button"
                disabled={isLoading || isGoogleLoading}
                onClick={() => handleDemoLogin("admin")}
                className="flex-1 rounded-xl border border-pink-500/30 bg-pink-500/10 py-2.5 px-2 text-center text-xs font-bold text-pink-600 transition hover:bg-pink-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-pink-500/20 dark:bg-pink-500/10 dark:text-pink-400"
              >
                {demoRoleLoading === "admin" ? "Signing In..." : "Guest Admin"}
              </button>
            </div>
          </div>
        </form>

        <div className="my-5 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
          <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
          <span>or</span>
          <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
        </div>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          isLoading={isGoogleLoading}
          disabled={isLoading}
          variant="bordered"
          className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-base font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
        >
          {!isGoogleLoading && <FcGoogle className="shrink-0 text-2xl" />}
          <span>Continue with Google</span>
        </Button>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600 dark:border-white/5 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href={`/auth/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="ml-1 font-semibold text-pink-500 transition-colors hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
};

// 3. The main export that satisfies Next.js's prerendering strategy
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}





















// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button, Input } from "@heroui/react";
// import { CircleCheck, CircleXmark, Eye, EyeSlash } from "@gravity-ui/icons";
// import { authClient } from "@/lib/auth-client";
// import { FcGoogle } from "react-icons/fc";

// export default function LoginPage() {
//   const searchParams = useSearchParams();

//   const redirectTo = searchParams.get("redirect") || "/";

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage({ type: "", text: "" });

//     if (!formData.email || !formData.password) {
//       setMessage({
//         type: "error",
//         text: "Please fill in all fields.",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const result = await authClient.signIn.email({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (result?.error) {
//         setMessage({
//           type: "error",
//           text: result.error.message || "Invalid email or password.",
//         });
//         setIsLoading(false);
//         return;
//       }

//       setMessage({
//         type: "success",
//         text: "Logged in successfully! Redirecting...",
//       });

//       setTimeout(() => {
//         window.location.replace(redirectTo);
//       }, 600);
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.message || "Something went wrong. Please try again.",
//       });

//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setMessage({ type: "", text: "" });
//     setIsGoogleLoading(true);

//     try {
//       await authClient.signIn.social({
//         provider: "google",
//         callbackURL: redirectTo,
//       });
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.message || "Google sign-in failed. Please try again.",
//       });

//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <section className="flex min-h-screen items-center justify-center bg-white px-4 py-10 dark:bg-[#0c1220]">
//       <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#0c1220] dark:shadow-black/40">
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
//             Welcome Back
//           </h1>

//           <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
//             Sign in to your GymNest account to continue your journey.
//           </p>
//         </div>

//         {message.text && (
//           <div
//             className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
//               message.type === "success"
//                 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
//                 : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
//             }`}
//           >
//             {message.type === "success" ? (
//               <CircleCheck className="h-5 w-5 shrink-0" />
//             ) : (
//               <CircleXmark className="h-5 w-5 shrink-0" />
//             )}

//             <span>{message.text}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <Input
//             className="w-full text-slate-900 dark:text-white"
//             placeholder="Enter your email"
//             label="Email"
//             type="email"
//             variant="bordered"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           <div className="relative">
//             <Input
//               className="w-full text-slate-900 dark:text-white"
//               placeholder="Enter your password"
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               variant="bordered"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
//             >
//               {showPassword ? (
//                 <EyeSlash className="h-5 w-5" />
//               ) : (
//                 <Eye className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           <Button
//             type="submit"
//             isLoading={isLoading}
//             disabled={isGoogleLoading}
//             className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/30 transition-opacity hover:opacity-90 dark:shadow-pink-500/10"
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </Button>
//         </form>

//         <div className="my-5 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
//           <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
//           <span>or</span>
//           <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
//         </div>

//         <Button
//           type="button"
//           onClick={handleGoogleLogin}
//           isLoading={isGoogleLoading}
//           disabled={isLoading}
//           variant="bordered"
//           className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-base font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
//         >
//           {!isGoogleLoading && <FcGoogle className="shrink-0 text-2xl" />}
//           <span>Continue with Google</span>
//         </Button>

//         <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600 dark:border-white/5 dark:text-neutral-400">
//           Don&apos;t have an account?{" "}
//           <Link
//             href={`/auth/signup?redirect=${encodeURIComponent(redirectTo)}`}
//             className="ml-1 font-semibold text-pink-500 transition-colors hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-500"
//           >
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }



// "use client";

// import { Suspense, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button, Input } from "@heroui/react";
// import { CircleCheck, CircleXmark, Eye, EyeSlash } from "@gravity-ui/icons";
// import { authClient } from "@/lib/auth-client";
// import { FcGoogle } from "react-icons/fc";

// const LoginPageLoading = () => {
//   return (
//     <section className="flex min-h-screen items-center justify-center bg-white px-4 py-10 dark:bg-[#0c1220]">
//       <div className="flex items-center gap-3 rounded-full border border-pink-500/20 bg-white/80 px-5 py-3 shadow-lg shadow-pink-500/10 dark:border-white/10 dark:bg-white/5">
//         <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500 dark:border-white/10 dark:border-t-pink-400" />

//         <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
//           Loading Sign In
//         </span>
//       </div>
//     </section>
//   );
// };

// const LoginPageContent = () => {
//   const searchParams = useSearchParams();

//   const redirectTo = searchParams.get("redirect") || "/";

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setMessage({ type: "", text: "" });

//     if (!formData.email || !formData.password) {
//       setMessage({
//         type: "error",
//         text: "Please fill in all fields.",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const result = await authClient.signIn.email({
//         email: formData.email,
//         password: formData.password,
//       });

//       if (result?.error) {
//         setMessage({
//           type: "error",
//           text: result.error.message || "Invalid email or password.",
//         });
//         setIsLoading(false);
//         return;
//       }

//       setMessage({
//         type: "success",
//         text: "Logged in successfully! Redirecting...",
//       });

//       setTimeout(() => {
//         window.location.replace(redirectTo);
//       }, 600);
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.message || "Something went wrong. Please try again.",
//       });

//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setMessage({ type: "", text: "" });
//     setIsGoogleLoading(true);

//     try {
//       await authClient.signIn.social({
//         provider: "google",
//         callbackURL: redirectTo,
//       });
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.message || "Google sign-in failed. Please try again.",
//       });

//       setIsGoogleLoading(false);
//     }
//   };

//   return (
//     <section className="flex min-h-screen items-center justify-center bg-white px-4 py-10 dark:bg-[#0c1220]">
//       <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#0c1220] dark:shadow-black/40">
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
//             Welcome Back
//           </h1>

//           <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">
//             Sign in to your GymNest account to continue your journey.
//           </p>
//         </div>

//         {message.text && (
//           <div
//             className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
//               message.type === "success"
//                 ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
//                 : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
//             }`}
//           >
//             {message.type === "success" ? (
//               <CircleCheck className="h-5 w-5 shrink-0" />
//             ) : (
//               <CircleXmark className="h-5 w-5 shrink-0" />
//             )}

//             <span>{message.text}</span>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <Input
//             className="w-full text-slate-900 dark:text-white"
//             placeholder="Enter your email"
//             label="Email"
//             type="email"
//             variant="bordered"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />

//           <div className="relative">
//             <Input
//               className="w-full text-slate-900 dark:text-white"
//               placeholder="Enter your password"
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               variant="bordered"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
//             >
//               {showPassword ? (
//                 <EyeSlash className="h-5 w-5" />
//               ) : (
//                 <Eye className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           <Button
//             type="submit"
//             isLoading={isLoading}
//             disabled={isGoogleLoading}
//             className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/30 transition-opacity hover:opacity-90 dark:shadow-pink-500/10"
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </Button>
//         </form>

//         <div className="my-5 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
//           <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
//           <span>or</span>
//           <span className="h-px w-[35%] bg-slate-200 dark:bg-slate-800"></span>
//         </div>

//         <Button
//           type="button"
//           onClick={handleGoogleLogin}
//           isLoading={isGoogleLoading}
//           disabled={isLoading}
//           variant="bordered"
//           className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 text-base font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
//         >
//           {!isGoogleLoading && <FcGoogle className="shrink-0 text-2xl" />}
//           <span>Continue with Google</span>
//         </Button>

//         <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600 dark:border-white/5 dark:text-neutral-400">
//           Don&apos;t have an account?{" "}
//           <Link
//             href={`/auth/signup?redirect=${encodeURIComponent(redirectTo)}`}
//             className="ml-1 font-semibold text-pink-500 transition-colors hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-500"
//           >
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default function LoginPage() {
//   return (
//     <Suspense fallback={<LoginPageLoading />}>
//       <LoginPageContent />
//     </Suspense>
//   );
// }
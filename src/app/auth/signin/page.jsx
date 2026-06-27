"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { CircleCheck, CircleXmark, Eye, EyeSlash } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

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
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      });

      if (result?.error) {
        setMessage({
          type: "error",
          text: result.error.message || "Invalid email or password.",
        });
        setIsLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: "Logged in successfully! Redirecting...",
      });

      setTimeout(() => {
        window.location.replace(redirectTo);
      }, 600);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage({ type: "", text: "" });
    setIsGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
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
            isLoading={isLoading}
            disabled={isGoogleLoading}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 font-bold text-white shadow-lg shadow-pink-500/30 transition-opacity hover:opacity-90 dark:shadow-pink-500/10"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
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
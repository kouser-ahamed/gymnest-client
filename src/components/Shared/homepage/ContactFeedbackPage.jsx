"use client";

import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiUser,
  FiMessageCircle,
  FiStar,
  FiSend,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

const ContactFeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    feedback: "",
    rating: 0,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      setError("Valid email is required");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }

    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        feedback: "",
        rating: 0,
      });

      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRating = (rate) => {
    setFormData((prev) => ({
      ...prev,
      rating: rate,
    }));
  };

  return (
    <section className="relative mt-8 min-h-[30vh] overflow-hidden bg-gradient-to-br from-slate-50 via-pink-50/50 to-orange-50/40 px-4 py-16 dark:from-[#050914] dark:via-[#101624] dark:to-[#261425] sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="animation-delay-2000 animate-blob absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-pink-500">
            Contact & Feedback
          </p>

          <h1 className="animate-fade-in text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Get in{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-slate-600 dark:text-slate-400">
            Have questions about fitness classes, trainer support, booking, or
            your GymNest experience? Send us a message and share your feedback.
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="animate-slide-down mb-6 flex items-center gap-3 rounded-2xl border border-pink-200 bg-pink-50 p-4 dark:border-pink-500/20 dark:bg-pink-500/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400">
              <FiCheck size={18} className="text-white" />
            </div>

            <div>
              <p className="font-bold text-pink-700 dark:text-pink-300">
                Message sent successfully!
              </p>

              <p className="text-sm text-pink-600 dark:text-pink-200">
                We will get back to you soon.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="animate-slide-down mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500">
              <FiAlertCircle size={18} className="text-white" />
            </div>

            <div>
              <p className="font-bold text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* Contact Info Sidebar */}
          <div className="space-y-5 lg:col-span-4">
            {/* Contact Card */}
            <div className="rounded-[1.6rem] bg-gradient-to-br from-[#101624] via-[#151827] to-[#261425] p-6 text-white shadow-xl shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-500/20">
              <h3 className="mb-5 flex items-center gap-2 text-xl font-black">
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                GymNest Support
              </h3>

              <div className="space-y-5">
                <div className="group flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 shadow-lg shadow-pink-500/20 transition-transform group-hover:scale-110">
                    <FiMail size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-pink-200">
                      Email
                    </p>

                    <a
                      href="mailto:support@gymnest.com"
                      className="text-sm font-semibold transition hover:text-pink-300"
                    >
                      support@gymnest.com
                    </a>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-110">
                    <FiPhone size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-200">
                      Phone
                    </p>

                    <a
                      href="tel:+8801322699296"
                      className="text-sm font-semibold transition hover:text-orange-300"
                    >
                      +880 132 2699296
                    </a>
                  </div>
                </div>

                <div className="group flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-pink-200 transition-transform group-hover:scale-110">
                    <FiMapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Service Area
                    </p>

                    <p className="text-sm font-semibold text-white">
                      Online Fitness Class Booking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425]">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                <FiClock size={20} className="text-pink-500" />
                Support Hours
              </h3>

              <ul className="space-y-3">
                <li className="flex items-center justify-between border-b border-pink-100 pb-3 dark:border-white/10">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Mon - Fri
                  </span>

                  <span className="rounded-xl bg-pink-500/10 px-3 py-1 text-sm font-bold text-pink-600 dark:text-pink-300">
                    09:00 - 20:00
                  </span>
                </li>

                <li className="flex items-center justify-between border-b border-pink-100 pb-3 dark:border-white/10">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Saturday
                  </span>

                  <span className="rounded-xl bg-orange-400/10 px-3 py-1 text-sm font-bold text-orange-600 dark:text-orange-300">
                    10:00 - 17:00
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Sunday
                  </span>

                  <span className="rounded-xl bg-red-500 px-3 py-1 text-sm font-bold text-white">
                    Closed
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-8">
            <div className="rounded-[1.6rem] border border-pink-200/70 bg-white/90 p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]/95 dark:shadow-black/20 sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <span className="text-red-500">*</span> Name
                  </label>

                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-pink-500">
                      <FiUser size={18} />
                    </div>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full rounded-2xl border-2 border-transparent bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-pink-500 focus:bg-white dark:bg-[#070b14] dark:text-white dark:focus:bg-[#070b14]"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <span className="text-red-500">*</span> Email
                  </label>

                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-pink-500">
                      <FiMail size={18} />
                    </div>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border-2 border-transparent bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-pink-500 focus:bg-white dark:bg-[#070b14] dark:text-white dark:focus:bg-[#070b14]"
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <span className="text-red-500">*</span> Phone
                  </label>

                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition group-focus-within:text-pink-500">
                      <FiPhone size={18} />
                    </div>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880..."
                      className="w-full rounded-2xl border-2 border-transparent bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-pink-500 focus:bg-white dark:bg-[#070b14] dark:text-white dark:focus:bg-[#070b14]"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-1 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <span className="text-red-500">*</span> Message
                  </label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Tell us about your class booking question..."
                    className="w-full resize-none rounded-2xl border-2 border-transparent bg-slate-50 p-4 text-sm font-medium text-slate-900 outline-none transition focus:border-pink-500 focus:bg-white dark:bg-[#070b14] dark:text-white dark:focus:bg-[#070b14]"
                  />
                </div>

                {/* Feedback Textarea */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    Your GymNest Experience
                  </label>

                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Share your feedback about classes, trainers, or the community..."
                    className="w-full resize-none rounded-2xl border-2 border-transparent bg-slate-50 p-4 text-sm font-medium text-slate-900 outline-none transition focus:border-pink-500 focus:bg-white dark:bg-[#070b14] dark:text-white dark:focus:bg-[#070b14]"
                  />
                </div>

                {/* Rating System */}
                <div className="space-y-3 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    <FiStar size={16} />
                    Rate Your GymNest Experience
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        className={`h-12 w-12 rounded-xl text-lg font-bold transition-all hover:scale-110 ${
                          formData.rating >= star
                            ? "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/25"
                            : "bg-slate-100 text-slate-400 hover:bg-pink-100 dark:bg-[#070b14] dark:hover:bg-pink-500/10"
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex h-13 w-full items-center justify-center gap-3 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 ${
                      loading
                        ? "cursor-not-allowed bg-slate-400"
                        : "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30"
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          33% {
            transform: translate(30px, -50px) scale(1.1);
          }

          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ContactFeedbackPage;
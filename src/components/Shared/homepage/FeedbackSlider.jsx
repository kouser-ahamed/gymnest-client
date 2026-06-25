"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { FiStar, FiMessageCircle, FiCalendar, FiMapPin } from "react-icons/fi";

import "swiper/css";
import "swiper/css/pagination";

const feedbackData = [
  {
    id: 1,
    name: "Md. Karim Ahmed",
    role: "Gym Member",
    date: "May 18, 2026",
    facility: "Strength Training Class",
    comment:
      "GymNest made my fitness journey much easier. I can explore classes, check trainer details, and book my workout session without any hassle.",
    rating: 5,
    avatar: "MK",
  },
  {
    id: 2,
    name: "Fatima Begum",
    role: "Yoga Learner",
    date: "May 15, 2026",
    facility: "Morning Yoga Session",
    comment:
      "The class booking process is very smooth. I found the perfect yoga class with a professional trainer and joined with confidence.",
    rating: 5,
    avatar: "FB",
  },
  {
    id: 3,
    name: "Rajib Hossain",
    role: "Fitness Enthusiast",
    date: "May 10, 2026",
    facility: "HIIT Workout Class",
    comment:
      "I love how GymNest shows class duration, price, schedule, and booking count clearly. It helped me choose the right class quickly.",
    rating: 4,
    avatar: "RH",
  },
  {
    id: 4,
    name: "Rima Das",
    role: "Personal Training Member",
    date: "May 05, 2026",
    facility: "Personal Training",
    comment:
      "GymNest connects members with expert trainers very easily. The platform looks professional and the user experience feels simple.",
    rating: 5,
    avatar: "RD",
  },
  {
    id: 5,
    name: "Tanvir Hasan",
    role: "Cardio Lover",
    date: "Apr 28, 2026",
    facility: "Cardio Blast Class",
    comment:
      "I can easily browse different fitness categories and book my favorite class. GymNest is perfect for regular gym members.",
    rating: 5,
    avatar: "TH",
  },
  {
    id: 6,
    name: "Nusrat Jahan",
    role: "Beginner Member",
    date: "Apr 22, 2026",
    facility: "Beginner Fitness Class",
    comment:
      "As a beginner, I found GymNest very helpful. The class details and trainer information helped me start my fitness journey comfortably.",
    rating: 5,
    avatar: "NJ",
  },
  {
    id: 7,
    name: "Sabbir Rahman",
    role: "Strength Trainee",
    date: "Apr 17, 2026",
    facility: "Weight Training Class",
    comment:
      "The platform is clean, fast, and easy to use. I especially like the featured classes and community forum updates.",
    rating: 4,
    avatar: "SR",
  },
  {
    id: 8,
    name: "Ayesha Akter",
    role: "Zumba Member",
    date: "Apr 12, 2026",
    facility: "Zumba Fitness Class",
    comment:
      "GymNest helped me find fun and energetic fitness classes. Booking classes and following trainer posts feels really convenient.",
    rating: 5,
    avatar: "AA",
  },
];

const FeedbackSlider = () => {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-pink-50/40 to-orange-50/40 py-20 dark:from-[#050914] dark:via-[#101624] dark:to-[#261425]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[4px] text-pink-500">
            Member Testimonials
          </p>

          <h2 className="mt-4 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
            What Members Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-600 dark:text-slate-400">
            Real experiences from GymNest members who book fitness classes,
            connect with trainers, and stay motivated through our fitness
            community.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {feedbackData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-6 shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/15 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] dark:shadow-black/20 dark:hover:border-pink-500/40 dark:hover:shadow-pink-500/20 md:p-8">
                <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-pink-500/15 blur-3xl transition duration-500 group-hover:bg-pink-500/25" />
                <div className="pointer-events-none absolute -bottom-14 -left-14 h-36 w-36 rounded-full bg-orange-400/15 blur-3xl transition duration-500 group-hover:bg-orange-400/25" />

                <div className="relative z-10 mb-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-sm font-black text-white shadow-lg shadow-pink-500/25 transition-transform duration-300 group-hover:scale-110">
                      {item.avatar}
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {item.name}
                      </h4>

                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <FiMessageCircle
                    className="text-pink-200 transition group-hover:text-pink-400 dark:text-pink-500/30 dark:group-hover:text-pink-300"
                    size={30}
                  />
                </div>

                <div className="relative z-10 mb-4 flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      size={16}
                      fill={index < item.rating ? "#ec4899" : "none"}
                      className={
                        index < item.rating
                          ? "text-pink-500"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  ))}
                </div>

                <p className="relative z-10 flex-grow text-sm font-medium leading-7 text-slate-700 dark:text-slate-300">
                  &quot;{item.comment}&quot;
                </p>

                <div className="relative z-10 mt-6 flex flex-col gap-3 border-t border-pink-100/80 pt-5 text-xs font-bold text-slate-600 dark:border-white/10 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-300">
                      <FiCalendar size={14} />
                    </span>
                    {item.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/10 text-orange-600 dark:text-orange-300">
                      <FiMapPin size={14} />
                    </span>
                    {item.facility}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <style jsx global>{`
          .swiper-pagination-bullet {
            background: #f9a8d4;
            opacity: 1;
            transition: all 0.3s ease;
          }

          .swiper-pagination-bullet-active {
            background: linear-gradient(90deg, #d946ef, #ec4899, #fb923c);
            transform: scale(1.35);
          }
        `}</style>
      </div>
    </section>
  );
};

export default FeedbackSlider;
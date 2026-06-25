"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@heroui/react";
import Link from "next/link";

const bannerImages = [
  "/assets/Banner.png",
  "/assets/Banner-1.png",
  "/assets/Banner-2.png",
  "/assets/Banner-3.png",
];

const imageDirections = ["left", "right", "top", "bottom"];

const getInitialPosition = (direction) => {
  if (direction === "left") return { x: "-100%", y: 0 };
  if (direction === "right") return { x: "100%", y: 0 };
  if (direction === "top") return { x: 0, y: "-100%" };
  if (direction === "bottom") return { x: 0, y: "100%" };

  return { x: "100%", y: 0 };
};

const getExitPosition = (direction) => {
  if (direction === "left") return { x: "100%", y: 0 };
  if (direction === "right") return { x: "-100%", y: 0 };
  if (direction === "top") return { x: 0, y: "100%" };
  if (direction === "bottom") return { x: 0, y: "-100%" };

  return { x: "-100%", y: 0 };
};

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % bannerImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentDirection =
    imageDirections[currentImage % imageDirections.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4"
    >
      <div
        className="
          relative w-full overflow-hidden mt-6 shadow-xl
          h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px]
          bg-cover bg-center bg-no-repeat rounded-2xl
        "
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={bannerImages[currentImage]}
            initial={{
              opacity: 0,
              scale: 1.04,
              ...getInitialPosition(currentDirection),
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.04,
              ...getExitPosition(currentDirection),
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${bannerImages[currentImage]}')`,
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-3xl px-6 sm:px-12 md:px-16 text-white"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black mb-3 md:mb-5 leading-tight tracking-tight">
              Train Stronger. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Book Classes Smarter.
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base mb-6 md:mb-8 max-w-[280px] sm:max-w-md md:max-w-xl text-slate-200 font-normal leading-relaxed">
              Join expert-led fitness classes, connect with professional
              trainers, and book your favorite workout sessions in just a few
              clicks. Start your fitness journey with GymNest and push your
              limits every day.
            </p>

            <Link href="/all-classes" passHref>
              <Button
                size="lg"
                className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white font-semibold px-8 py-5 rounded-full hover:scale-[1.03] active:scale-[0.98] transition-all text-xs sm:text-sm shadow-lg shadow-pink-900/30"
              >
                Explore Classes
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Banner;
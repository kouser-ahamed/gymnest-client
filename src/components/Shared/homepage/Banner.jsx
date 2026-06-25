"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

const bannerImages = [
  "/assets/Banner.png",
  "/assets/Banner-1.png",
  "/assets/Banner-2.png",
  "/assets/Banner-3.png",
];

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % bannerImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div
        className="
          relative w-full overflow-hidden mt-6 shadow-xl
          h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px]
          bg-cover bg-center bg-no-repeat rounded-2xl
        "
      >
        {bannerImages.map((image, index) => (
          <div
            key={image}
            className={`
              absolute inset-0 bg-cover bg-center bg-no-repeat
              transition-opacity duration-1000 ease-in-out
              ${index === currentImage ? "opacity-100" : "opacity-0"}
            `}
            style={{
              backgroundImage: `url('${image}')`,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div className="w-full max-w-3xl px-6 sm:px-12 md:px-16 text-white">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { Heart, PersonWorker, Star, TrashBin } from "@gravity-ui/icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getItemId = (item) => {
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.() || item?.classId;
};

const FavoriteClassesGrid = ({ favoriteClasses = [], user }) => {
  const [favorites, setFavorites] = useState(favoriteClasses);
  const [removingId, setRemovingId] = useState("");

  const handleRemoveFavorite = async (item) => {
    try {
      setRemovingId(item?.classId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite-classes?classId=${item?.classId}&userId=${user?.id}&email=${user?.email}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (result?.deletedCount > 0) {
        setFavorites((prev) =>
          prev.filter((favorite) => favorite.classId !== item.classId)
        );
        toast.success("Removed from favorites!");
      } else {
        toast.error("Failed to remove favorite.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setRemovingId("");
    }
  };

  return (
    <section className="space-y-6">
      <ToastContainer />

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 dark:text-pink-300">
              Member Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Favorite Classes
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your favorite classes will be displayed here, and you can remove
              them using the remove button.
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-pink-500/20 bg-pink-500/10 px-5 py-3 text-sm font-black text-pink-600 dark:text-pink-300">
            Total Favorites: {favorites.length}
          </div>
        </div>
      </div>

      <Card className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-[#101624] sm:p-6">
        {favorites.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center text-center">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/10 via-pink-500/10 to-orange-400/10 text-pink-500">
                <Heart className="h-8 w-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                No Favorite Classes Found
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You have not added any favorite class yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {favorites.map((item) => (
              <Card
                key={getItemId(item)}
                className="group overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10 dark:border-white/10 dark:bg-[#070b14]"
              >
                <Link href={`/all-classes/${item?.classId}`}>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-[#050914]">
                    {item?.image ? (
                      <img
                        src={item.image}
                        alt={item?.className || "Favorite class"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-pink-500">
                        <Star className="h-10 w-10" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/70 via-transparent to-transparent" />

                    <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-pink-500/20">
                      {item?.category || "Fitness"}
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/all-classes/${item?.classId}`}>
                    <h3 className="line-clamp-2 min-h-[48px] text-base font-black leading-6 text-slate-900 transition hover:text-pink-600 dark:text-white dark:hover:text-pink-300">
                      {item?.className || "Class Name"}
                    </h3>
                  </Link>

                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <PersonWorker className="h-4 w-4 text-pink-500" />
                    By {item?.trainerName || "Trainer"}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-orange-500 dark:text-orange-300">
                      ${item?.price || 0}
                    </p>

                    <Button
                      onClick={() => handleRemoveFavorite(item)}
                      disabled={removingId === item?.classId}
                      className="h-9 rounded-full border border-red-500/20 bg-red-500/10 px-3 text-xs font-black text-red-600 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-300"
                    >
                      <TrashBin className="h-4 w-4" />
                      {removingId === item?.classId ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
};

export default FavoriteClassesGrid;
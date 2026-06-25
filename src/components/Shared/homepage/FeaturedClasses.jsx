import { Button, Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { getUserSession } from "@/lib/core/session";
import {
  Calendar,
  CircleDollar,
  Clock,
  PersonWorker,
  DatabaseMagnifier,
  ArrowRightFromSquare,
} from "@gravity-ui/icons";

const getClassId = (item) => {
  if (item?.classId) return item.classId;
  if (typeof item?._id === "string") return item._id;
  if (item?._id?.$oid) return item._id.$oid;
  return item?._id?.toString?.();
};

const getBookingCount = (item) => {
  if (typeof item?.bookingCount === "number") return item.bookingCount;
  if (typeof item?.totalBookings === "number") return item.totalBookings;
  if (Array.isArray(item?.bookings)) return item.bookings.length;
  if (Array.isArray(item?.bookedUsers)) return item.bookedUsers.length;
  if (Array.isArray(item?.students)) return item.students.length;
  if (Array.isArray(item?.enrolledStudents)) return item.enrolledStudents.length;

  return 0;
};

const getDifficultyClass = (difficulty) => {
  const value = difficulty?.toLowerCase();

  if (value === "beginner") {
    return "border-pink-500/25 bg-pink-500/10 text-pink-600 dark:text-pink-300";
  }

  if (value === "intermediate") {
    return "border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-300";
  }

  return "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300";
};

const getResponseData = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  throw new Error(
    `API did not return JSON. Check backend route /api/classes/browse. Response: ${text.slice(
      0,
      120,
    )}`,
  );
};

const getFeaturedClasses = async () => {
  const queryParams = new URLSearchParams({
    page: "1",
    limit: "3",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/browse?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await getResponseData(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch featured classes.");
  }

  const classes = data?.classes || [];

  return classes
    .sort((a, b) => getBookingCount(b) - getBookingCount(a))
    .slice(0, 3);
};

const FeaturedClassCard = ({ classItem, isLoggedIn }) => {
  const classId = getClassId(classItem);
  const bookingCount = getBookingCount(classItem);

  const detailsHref = `/all-classes/${classId}`;
  const viewDetailsHref = isLoggedIn
    ? detailsHref
    : `/auth/signin?redirect=${encodeURIComponent(detailsHref)}`;

  const {
    className,
    image,
    category,
    difficultyLevel,
    duration,
    schedule,
    price,
    trainerName,
  } = classItem || {};

  return (
    <Card className="group overflow-hidden rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/15 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] dark:hover:border-pink-500/40 dark:hover:shadow-pink-500/20">
      {/* Image */}
      <div className="relative mx-3 mt-3 h-52 w-[calc(100%-1.5rem)] overflow-hidden rounded-[1.25rem] bg-pink-50 dark:bg-[#070b14]">
        {image ? (
          <Image
            src={image}
            alt={className || "Class image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-pink-500">
            <DatabaseMagnifier className="h-12 w-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-pink-500/25">
            {category || "Fitness"}
          </span>
        </div>
      </div>

      <Card.Header className="p-5 pb-0">
        <div className="w-full space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Card.Title className="line-clamp-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {className || "Class Name"}
              </Card.Title>

              {/* Trainer Name */}
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                  <PersonWorker className="h-4 w-4" />
                </span>

                <p className="truncate">
                  by{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {trainerName || "Trainer Name"}
                  </span>
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold capitalize ${getDifficultyClass(
                difficultyLevel,
              )}`}
            >
              {difficultyLevel || "Beginner"}
            </span>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-pink-100/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-[#070b14]/80">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 text-pink-500" />
              Duration
            </div>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {duration || 0} mins
            </p>
          </div>

          <div className="rounded-2xl border border-pink-100/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-[#070b14]/80">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <PersonWorker className="h-4 w-4 text-pink-500" />
              Booked
            </div>

            <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
              {bookingCount} students
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100/80 bg-gradient-to-br from-white via-pink-50/80 to-orange-50/60 p-4 shadow-sm dark:border-white/10 dark:from-[#070b14] dark:via-[#120d18] dark:to-pink-500/10">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 text-pink-500" />
            Schedule
          </div>

          <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
            {schedule?.days?.join(", ") || "No days"} at{" "}
            {schedule?.time || "No time"}
          </p>
        </div>
      </Card.Content>

      <Card.Footer className="border-t border-pink-100/80 bg-white/45 p-5 dark:border-white/10 dark:bg-black/10">
        <div className="flex w-full items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Price
            </p>

            <p className="mt-1 flex items-center gap-1 text-2xl font-black text-pink-600 dark:text-pink-300">
              <CircleDollar className="h-5 w-5 text-pink-500 dark:text-pink-300" />
              {price || 0}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                /session
              </span>
            </p>
          </div>

          <Link href={viewDetailsHref} className="shrink-0">
            <Button className="h-11 rounded-full border border-pink-500/20 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/25">
              View Details
              <ArrowRightFromSquare className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
};

const FeaturedClasses = async () => {
  const featuredClasses = await getFeaturedClasses();
  const user = await getUserSession();
  const isLoggedIn = !!user;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-pink-500">
            Featured Classes
          </p>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Most Booked{" "}
            <span className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Fitness Classes
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Explore the top classes that members are booking the most and choose
            the perfect session for your fitness journey.
          </p>
        </div>

        <Link href="/all-classes">
          <Button className="rounded-full border border-pink-500/20 bg-pink-500/10 px-6 text-sm font-bold text-pink-600 transition-all hover:bg-pink-500/15 dark:text-pink-300">
            View All Classes
          </Button>
        </Link>
      </div>

      {featuredClasses.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-8 text-center dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425]">
          <DatabaseMagnifier className="mb-4 h-12 w-12 text-pink-500" />

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No featured classes found
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Featured classes will appear here once approved classes are
            available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredClasses.map((item) => (
            <FeaturedClassCard
              key={getClassId(item)}
              classItem={item}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedClasses;
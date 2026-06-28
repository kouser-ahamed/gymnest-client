// "use client";

// import React, { useEffect, useState } from "react";
// import { Button, Card } from "@heroui/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "@/lib/auth-client";
// import {
//   Calendar,
//   CircleDollar,
//   Clock,
//   PersonWorker,
//   DatabaseMagnifier,
//   ArrowRightFromSquare,
//   Magnifier,
// } from "@gravity-ui/icons";

// const categories = [
//   { id: "yoga", label: "Yoga" },
//   { id: "weights", label: "Weights" },
//   { id: "cardio", label: "Cardio" },
//   { id: "hiit", label: "HIIT" },
//   { id: "strength", label: "Strength" },
//   { id: "zumba", label: "Zumba" },
// ];

// const getClassId = (item) => {
//   if (item?.classId) return item.classId;
//   if (typeof item?._id === "string") return item._id;
//   if (item?._id?.$oid) return item._id.$oid;
//   return item?._id?.toString?.();
// };

// const getBookingCount = (item) => {
//   if (typeof item?.bookingCount === "number") return item.bookingCount;
//   if (typeof item?.totalBookings === "number") return item.totalBookings;
//   if (Array.isArray(item?.bookings)) return item.bookings.length;
//   if (Array.isArray(item?.bookedUsers)) return item.bookedUsers.length;
//   if (Array.isArray(item?.students)) return item.students.length;
//   if (Array.isArray(item?.enrolledStudents)) return item.enrolledStudents.length;

//   return 0;
// };

// const getDifficultyClass = (difficulty) => {
//   const value = difficulty?.toLowerCase();

//   if (value === "beginner") {
//     return "border-pink-500/25 bg-pink-500/10 text-pink-600 dark:text-pink-300";
//   }

//   if (value === "intermediate") {
//     return "border-orange-500/25 bg-orange-500/10 text-orange-600 dark:text-orange-300";
//   }

//   return "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-300";
// };

// const ClassCard = ({ classItem, isLoggedIn }) => {
//   const classId = getClassId(classItem);
//   const bookingCount = getBookingCount(classItem);

//   const detailsHref = `/all-classes/${classId}`;
//   const viewDetailsHref = isLoggedIn
//     ? detailsHref
//     : `/auth/signin?redirect=${encodeURIComponent(detailsHref)}`;

//   const {
//     className,
//     image,
//     category,
//     difficultyLevel,
//     duration,
//     schedule,
//     price,
//     trainerName,
//   } = classItem || {};

//   return (
//     <Card className="group overflow-hidden rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/15 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] dark:hover:border-pink-500/40 dark:hover:shadow-pink-500/20">
//       {/* Image */}
//       <div className="relative mx-3 mt-3 h-52 w-[calc(100%-1.5rem)] overflow-hidden rounded-[1.25rem] bg-pink-50 dark:bg-[#070b14]">
//         {image ? (
//           <Image
//             src={image}
//             alt={className || "Class image"}
//             fill
//             sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
//             className="object-cover transition-transform duration-700 group-hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center text-pink-500">
//             <DatabaseMagnifier className="h-12 w-12" />
//           </div>
//         )}

//         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

//         {/* Category Badge */}
//         <div className="absolute left-4 top-4">
//           <span className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-pink-500/25">
//             {category || "Fitness"}
//           </span>
//         </div>
//       </div>

//       <Card.Header className="p-5 pb-0">
//         <div className="w-full space-y-3">
//           <div className="flex items-start justify-between gap-3">
//             <div className="min-w-0 flex-1">
//               <Card.Title className="line-clamp-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
//                 {className || "Class Name"}
//               </Card.Title>

//               {/* Trainer Name */}
//               <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
//                 <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
//                   <PersonWorker className="h-4 w-4" />
//                 </span>

//                 <p className="truncate">
//                   by{" "}
//                   <span className="font-bold text-slate-800 dark:text-slate-200">
//                     {trainerName || "Trainer Name"}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <span
//               className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold capitalize ${getDifficultyClass(
//                 difficultyLevel,
//               )}`}
//             >
//               {difficultyLevel || "Beginner"}
//             </span>
//           </div>
//         </div>
//       </Card.Header>

//       <Card.Content className="space-y-4 p-5">
//         <div className="grid grid-cols-2 gap-3">
//           <div className="rounded-2xl border border-pink-100/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-[#070b14]/80">
//             <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
//               <Clock className="h-4 w-4 text-pink-500" />
//               Duration
//             </div>

//             <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
//               {duration || 0} mins
//             </p>
//           </div>

//           <div className="rounded-2xl border border-pink-100/80 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-[#070b14]/80">
//             <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
//               <PersonWorker className="h-4 w-4 text-pink-500" />
//               Booked
//             </div>

//             <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
//               {bookingCount} students
//             </p>
//           </div>
//         </div>

//         <div className="rounded-2xl border border-pink-100/80 bg-gradient-to-br from-white via-pink-50/80 to-orange-50/60 p-4 shadow-sm dark:border-white/10 dark:from-[#070b14] dark:via-[#120d18] dark:to-pink-500/10">
//           <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
//             <Calendar className="h-4 w-4 text-pink-500" />
//             Schedule
//           </div>

//           <p className="mt-2 line-clamp-1 text-sm font-semibold text-slate-900 dark:text-white">
//             {schedule?.days?.join(", ") || "No days"} at{" "}
//             {schedule?.time || "No time"}
//           </p>
//         </div>
//       </Card.Content>

//       <Card.Footer className="border-t border-pink-100/80 bg-white/45 p-5 dark:border-white/10 dark:bg-black/10">
//         <div className="flex w-full items-center justify-between gap-4">
//           <div>
//             <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
//               Price
//             </p>

//             <p className="mt-1 flex items-center gap-1 text-2xl font-black text-pink-600 dark:text-pink-300">
//               <CircleDollar className="h-5 w-5 text-pink-500 dark:text-pink-300" />
//               {price || 0}
//               <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
//                 /session
//               </span>
//             </p>
//           </div>

//           <Link href={viewDetailsHref} className="shrink-0">
//             <Button className="h-11 rounded-full border border-pink-500/20 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/25">
//               View Details
//               <ArrowRightFromSquare className="ml-2 h-4 w-4" />
//             </Button>
//           </Link>
//         </div>
//       </Card.Footer>
//     </Card>
//   );
// };

// const ClassesGrid = ({
//   classes = [],
//   searchText = "",
//   selectedCategories = [],
//   currentPage = 1,
//   totalPages = 1,
//   totalClasses = 0,
// }) => {
//   const router = useRouter();
//   const { data: session } = useSession();

//   const user = session?.user;
//   const isLoggedIn = !!user;

//   const [searchValue, setSearchValue] = useState(searchText);
//   const [activeCategories, setActiveCategories] = useState(selectedCategories);

//   const createUrl = ({
//     page = 1,
//     search = searchValue,
//     cats = activeCategories,
//   }) => {
//     const queryParams = new URLSearchParams();

//     if (search.trim()) {
//       queryParams.set("search", search.trim());
//     }

//     if (cats.length > 0) {
//       queryParams.set("categories", cats.join(","));
//     }

//     queryParams.set("page", String(page));

//     const queryString = queryParams.toString();

//     return queryString ? `/all-classes?${queryString}` : "/all-classes";
//   };

//   const handleCategoryToggle = (categoryId) => {
//     const updatedCategories = activeCategories.includes(categoryId)
//       ? activeCategories.filter((item) => item !== categoryId)
//       : [...activeCategories, categoryId];

//     setActiveCategories(updatedCategories);

//     router.push(
//       createUrl({
//         page: 1,
//         search: searchValue,
//         cats: updatedCategories,
//       }),
//     );
//   };

//   const handleClearFilters = () => {
//     setSearchValue("");
//     setActiveCategories([]);
//     router.push("/all-classes");
//   };

//   const handlePageChange = (pageNumber) => {
//     router.push(
//       createUrl({
//         page: pageNumber,
//         search: searchValue,
//         cats: activeCategories,
//       }),
//     );
//   };

//   useEffect(() => {
//     setSearchValue(searchText);
//     setActiveCategories(selectedCategories);
//   }, [searchText, selectedCategories]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const currentSearch = searchText.trim();
//       const newSearch = searchValue.trim();

//       if (currentSearch !== newSearch) {
//         router.replace(
//           createUrl({
//             page: 1,
//             search: searchValue,
//             cats: activeCategories,
//           }),
//         );
//       }
//     }, 350);

//     return () => clearTimeout(timer);
//   }, [searchValue]);

//   return (
//     <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
//       <div className="rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] sm:p-5">
//         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h1 className="text-2xl font-black text-slate-900 dark:text-white">
//               Browse Classes
//             </h1>

//             <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
//               Search and filter approved classes. Most booked classes appear
//               first.
//             </p>
//           </div>

//           <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-bold text-pink-600 dark:text-pink-300">
//             Total Classes: {totalClasses}
//           </div>
//         </div>

//         <div className="mt-5 flex flex-col gap-3 md:flex-row">
//           <div className="relative flex-1">
//             <Magnifier className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

//             <input
//               type="text"
//               value={searchValue}
//               onChange={(event) => setSearchValue(event.target.value)}
//               placeholder="Search by class name..."
//               className="h-12 w-full rounded-2xl border border-pink-100 bg-white/80 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
//             />
//           </div>

//           {(searchValue || activeCategories.length > 0) && (
//             <Button
//               type="button"
//               onClick={handleClearFilters}
//               className="h-12 rounded-2xl border border-pink-100 bg-white/80 px-7 text-sm font-bold text-slate-700 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
//             >
//               Clear
//             </Button>
//           )}
//         </div>

//         <div className="mt-5 flex flex-wrap gap-2">
//           {categories.map((category) => {
//             const isActive = activeCategories.includes(category.id);

//             return (
//               <button
//                 type="button"
//                 key={category.id}
//                 onClick={() => handleCategoryToggle(category.id)}
//                 className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
//                   isActive
//                     ? "border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/20"
//                     : "border-pink-100 bg-white/80 text-slate-600 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-300"
//                 }`}
//               >
//                 {category.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {classes.length === 0 ? (
//         <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-8 text-center dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425]">
//           <DatabaseMagnifier className="mb-4 h-12 w-12 text-pink-500" />

//           <h2 className="text-lg font-bold text-slate-900 dark:text-white">
//             No classes found
//           </h2>

//           <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
//             No fitness classes match your search or selected filters.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {classes.map((item) => (
//               <ClassCard
//                 key={getClassId(item)}
//                 classItem={item}
//                 isLoggedIn={isLoggedIn}
//               />
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-4 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] sm:flex-row">
//               <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
//                 Page {currentPage} of {totalPages}
//               </p>

//               <div className="flex flex-wrap items-center justify-center gap-2">
//                 <Button
//                   type="button"
//                   disabled={currentPage <= 1}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   className="h-10 rounded-xl border border-pink-100 bg-white/80 px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
//                 >
//                   Previous
//                 </Button>

//                 {Array.from({ length: totalPages }, (_, index) => index + 1).map(
//                   (pageNumber) => (
//                     <button
//                       type="button"
//                       key={pageNumber}
//                       onClick={() => handlePageChange(pageNumber)}
//                       className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-bold transition ${
//                         currentPage === pageNumber
//                           ? "border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white"
//                           : "border-pink-100 bg-white/80 text-slate-700 hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
//                       }`}
//                     >
//                       {pageNumber}
//                     </button>
//                   ),
//                 )}

//                 <Button
//                   type="button"
//                   disabled={currentPage >= totalPages}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   className="h-10 rounded-xl border border-pink-100 bg-white/80 px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// };

// export default ClassesGrid;





//=-===== new code 27/06/2026



"use client";

import React, { useEffect, useState } from "react";
import { Button, Card } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CircleDollar,
  Clock,
  PersonWorker,
  DatabaseMagnifier,
  ArrowRightFromSquare,
  Magnifier,
} from "@gravity-ui/icons";

const categories = [
  { id: "yoga", label: "Yoga" },
  { id: "weights", label: "Weights" },
  { id: "cardio", label: "Cardio" },
  { id: "hiit", label: "HIIT" },
  { id: "strength", label: "Strength" },
  { id: "zumba", label: "Zumba" },
];

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

const ClassCard = ({ classItem }) => {
  const classId = getClassId(classItem);
  const bookingCount = getBookingCount(classItem);

  const viewDetailsHref = `/all-classes/${classId}`;

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
            key={image}
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

const ClassesGrid = ({
  classes = [],
  searchText = "",
  selectedCategories = [],
  currentPage = 1,
  totalPages = 1,
  totalClasses = 0,
}) => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState(searchText);
  const [activeCategories, setActiveCategories] = useState(selectedCategories);

  const createUrl = ({
    page = 1,
    search = searchValue,
    cats = activeCategories,
  }) => {
    const queryParams = new URLSearchParams();

    if (search.trim()) {
      queryParams.set("search", search.trim());
    }

    if (cats.length > 0) {
      queryParams.set("categories", cats.join(","));
    }

    queryParams.set("page", String(page));

    const queryString = queryParams.toString();

    return queryString ? `/all-classes?${queryString}` : "/all-classes";
  };

  const handleCategoryToggle = (categoryId) => {
    const updatedCategories = activeCategories.includes(categoryId)
      ? activeCategories.filter((item) => item !== categoryId)
      : [...activeCategories, categoryId];

    setActiveCategories(updatedCategories);

    router.push(
      createUrl({
        page: 1,
        search: searchValue,
        cats: updatedCategories,
      }),
    );
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setActiveCategories([]);
    router.push("/all-classes");
  };

  const handlePageChange = (pageNumber) => {
    router.push(
      createUrl({
        page: pageNumber,
        search: searchValue,
        cats: activeCategories,
      }),
    );
  };

  useEffect(() => {
    setSearchValue(searchText);
    setActiveCategories(selectedCategories);
  }, [searchText, selectedCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchText.trim();
      const newSearch = searchValue.trim();

      if (currentSearch !== newSearch) {
        router.replace(
          createUrl({
            page: 1,
            search: searchValue,
            cats: activeCategories,
          }),
        );
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[1.6rem] border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Browse Classes
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search and filter approved classes. Most booked classes appear
              first.
            </p>
          </div>

          <div className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-sm font-bold text-pink-600 dark:text-pink-300">
            Total Classes: {totalClasses}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Magnifier className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by class name..."
              className="h-12 w-full rounded-2xl border border-pink-100 bg-white/80 pl-11 pr-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-white/10 dark:bg-[#070b14] dark:text-white"
            />
          </div>

          {(searchValue || activeCategories.length > 0) && (
            <Button
              type="button"
              onClick={handleClearFilters}
              className="h-12 rounded-2xl border border-pink-100 bg-white/80 px-7 text-sm font-bold text-slate-700 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = activeCategories.includes(category.id);

            return (
              <button
                type="button"
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
                  isActive
                    ? "border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/20"
                    : "border-pink-100 bg-white/80 text-slate-600 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:bg-[#070b14] dark:text-slate-300"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-8 text-center dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425]">
          <DatabaseMagnifier className="mb-4 h-12 w-12 text-pink-500" />

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No classes found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No fitness classes match your search or selected filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <ClassCard key={getClassId(item)} classItem={item} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-pink-200/70 bg-gradient-to-br from-white via-pink-50/60 to-orange-50/50 p-4 dark:border-white/10 dark:bg-gradient-to-br dark:from-[#101624] dark:via-[#141827] dark:to-[#261425] sm:flex-row">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="h-10 rounded-xl border border-pink-100 bg-white/80 px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-bold transition ${
                        currentPage === pageNumber
                          ? "border-pink-500 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 text-white"
                          : "border-pink-100 bg-white/80 text-slate-700 hover:bg-pink-500/10 hover:text-pink-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ),
                )}

                <Button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="h-10 rounded-xl border border-pink-100 bg-white/80 px-4 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ClassesGrid;
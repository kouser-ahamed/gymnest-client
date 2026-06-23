import ClassesGrid from "@/components/classes/ClassesGrid";
//import { getAllClasses } from "@/lib/api/classes";

const AllClassesPage = async () => {
  // const classes = await getAllClasses();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/classes/all`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const classes = await response.json();

  if (!response.ok) {
    throw new Error(classes?.message || "Failed to fetch classes.");
  }

  return <ClassesGrid classes={classes} />;
};

export default AllClassesPage;

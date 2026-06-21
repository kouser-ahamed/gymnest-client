import ClassesGrid from "@/components/classes/ClassesGrid";
import { getAllClasses } from "@/lib/api/classes";

const AllClassesPage = async () => {
  const classes = await getAllClasses();

  return <ClassesGrid classes={classes} />;
};

export default AllClassesPage;
import Banner from "@/components/Shared/homepage/Banner";
import FeaturedClasses from "@/components/Shared/homepage/FeaturedClasses";
import LatestForumPosts from "@/components/Shared/homepage/LatestForumPosts";
import Image from "next/image";

export default function Home() {
  return (
    
     <div>
      <Banner />
      <FeaturedClasses />
      <LatestForumPosts />
     </div>
    
  );
}

import Banner from "@/components/Shared/homepage/Banner";
import ContactFeedbackPage from "@/components/Shared/homepage/ContactFeedbackPage";
import FeaturedClasses from "@/components/Shared/homepage/FeaturedClasses";
import FeedbackSlider from "@/components/Shared/homepage/FeedbackSlider";
import LatestForumPosts from "@/components/Shared/homepage/LatestForumPosts";
import Image from "next/image";

export default function Home() {
  return (
    
     <div>
      <Banner />
      <FeaturedClasses />
      <LatestForumPosts />
      <FeedbackSlider />
      <ContactFeedbackPage />
     </div>
    
  );
}

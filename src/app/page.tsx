import { HeroSlider } from "@/components/home/HeroSlider";
import { HowBorrowingWorks } from "@/components/home/HowBorrowingWorks";
import { NewArrivals } from "@/components/home/NewArrivals";
import { TopCategories } from "@/components/home/TopCategories";

export default function Home() {
  return (
    <>
      <HeroSlider />
      
      <NewArrivals />
      <HowBorrowingWorks />
      <TopCategories />
    </>
  );
}

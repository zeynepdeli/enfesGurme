import { HeroSection } from "@/components/shop/home/hero-section";
import { CategoriesSection } from "@/components/shop/home/categories-section";
import { ReviewsSection } from "@/components/shop/home/reviews-section";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <ReviewsSection />
    </div>
  );
}

import { CategoriesSection } from "@/components/shop/home/categories-section";
import { FeaturedBand } from "@/components/shop/home/featured-band";
import { FeaturesBand } from "@/components/shop/home/features-band";
import { HeroSection } from "@/components/shop/home/hero-section";
import { ReviewsSection } from "@/components/shop/home/reviews-section";
export default function HomePage() {
  return (
    <main className="relative z-10 min-h-screen bg-transparent">
      <HeroSection />
      <FeaturedBand />
      <CategoriesSection />
      <FeaturesBand />
      <ReviewsSection />
    </main>
  );
}

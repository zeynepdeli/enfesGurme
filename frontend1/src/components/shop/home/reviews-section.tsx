"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Star, Quote } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProductCard } from "@/components/products/product-card";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date?: string;
  product?: string;
}

const DEMO_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ayşe Kaya",
    rating: 5,
    comment: "Antep peyniri inanılmaz lezzetliydi, çok taze geldi.",
    product: "Handcrafted Antep Cheese",
    date: "Mart 2025",
  },
  {
    id: 2,
    name: "Mehmet Yılmaz",
    rating: 5,
    comment:
      "Zeugma Gusto'nun ürünleri gerçekten eşsiz. Herkese tavsiye ederim.",
    product: "Select Black Olives",
    date: "Şubat 2025",
  },
  {
    id: 3,
    name: "Fatma Demir",
    rating: 4,
    comment:
      "Paketleme çok özenli, ürünler taze geldi. Kesinlikle tekrar alacağım.",
    product: "Sun-Dried Tomatoes",
    date: "Ocak 2025",
  },
  {
    id: 4,
    name: "Ali Çelik",
    rating: 5,
    comment: "Gaziantep'in gerçek lezzetini soframa taşıdı. Harika!",
    product: "Gourmet Nuts Mix",
    date: "Aralık 2024",
  },
  {
    id: 5,
    name: "Ali ",
    rating: 5,
    comment: "Gaziantep'in gerçek lezzetini soframa taşıdı. Harika!",
    product: "Gourmet Nuts Mix",
    date: "Aralık 2024",
  },
];

interface ReviewsSectionProps {
  productId?: number;
  title?: string;
}

export function ReviewsSection({
  productId,
  title = "What Our Customers Say",
}: ReviewsSectionProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) return DEMO_REVIEWS;

      const response = await api.get<any[]>(
        `/api/reviews/product/${productId}`,
      );

      return (response.data || []).map((r) => ({
        ...r,
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : undefined,
      }));
    },
    enabled: true,
  });

  const displayReviews = reviews?.length ? reviews : DEMO_REVIEWS;

  return (
    <section className="py-14">
      {/* Title */}
      <h2 className="text-center text-white text-2xl font-semibold tracking-[0.2em] uppercase mb-14">
        {title}
      </h2>

      {isLoading ? (
        <LoadingSpinner text="Yorumlar yükleniyor..." />
      ) : (
        <div className="flex flex-wrap justify-center gap-12 group">
          {displayReviews.map((review, i) => (
            <div
              key={review.id}
              className="group transition-all duration-500 ease-out opacity-0 animate-fade-in-up hover:-translate-y-2 hover:scale-[1.02] group-hover:opacity-40 hover:!opacity-100"
              style={{
                animationDelay: `${i * 0.08}s`,
                animationFillMode: "forwards",
              }}
            >
              <ProductCard
                product={{
                  name: "",
                  price: 0,
                  slug: "",
                  description: "",
                  stock: 0,
                  images: [],
                }}
                card={{ w: 240, h: 220 }}
                frame={{ w: 250, h: 230 }}
                offset={{ top: 5, left: 5 }}
                imageStyle="square"
                imageHeight={0}
                showPrice={false}
                showDescription={false}
                href="#"
              >
                {/* CONTENT */}
                <div className="relative flex flex-col h-full px-4 pt-4 pb-3">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-[#c8a44a]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                  {/* Stars */}
                  <div className="relative z-10 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={12}
                        fill={idx < review.rating ? "currentColor" : "none"}
                        className={`transition-all duration-500 ${
                          idx < review.rating
                            ? "text-[#c8a44a] group-hover:scale-110"
                            : "text-[#2b5530]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="relative z-10 mt-3 text-white/70 text-[13px] leading-relaxed line-clamp-4 transition-all duration-500 group-hover:text-white/90">
                    <Quote
                      size={12}
                      className="inline text-[#c8a44a] mr-1 -mt-1 opacity-80"
                    />
                    {review.comment}
                  </p>

                  {/* Footer */}
                  <div className="relative z-10 mt-auto pt-3 border-t border-white/10 transition-all duration-500 group-hover:border-white/20">
                    <p className="text-[#f5efe3] text-[13px] font-medium">
                      {review.name}
                    </p>

                    <div className="flex justify-between mt-1 text-[10px]">
                      {review.product && (
                        <span className="text-[#c8a44a]/80 line-clamp-1">
                          {review.product}
                        </span>
                      )}
                      {review.date && (
                        <span className="text-white/30 whitespace-nowrap">
                          {review.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ProductCard>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Star } from "lucide-react";

import { api } from "@/lib/api";

type HomeReviewCard = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  userImage?: string;
  productImage: string;
  order: number;
  isActive: boolean;
};

type ReviewSectionData = {
  title: string;
  description: string;
  backgroundImage: string;
  cardTexture: string;
  frameImage: string;
  cards: HomeReviewCard[];
};

type ReviewVariant =
  | "mobile"
  | "xsMobile"
  | "tablet"
  | "desktop"
  | "xl"
  | "xxl";

type ReviewSize = {
  outerW: number;
  outerH: number;
  frameW: number;
  avatar: number;
  cardPt: number;
  cardPb: number;
  cardPx: number;
  comment: number;
  stars: number;
  name: number;
  bottomGap: number;
};

const FALLBACKS = {
  bg: "/duvarBg.png",
  texture: "/cardDuvar.png",
  frame: "/hakiCerceve.png",
};

const REVIEW_SIZES: Record<ReviewVariant, ReviewSize> = {
  mobile: {
    outerW: 380,
    outerH: 380,
    frameW: 320,
    avatar: 54,
    cardPt: 42,
    cardPb: 18,
    cardPx: 16,
    comment: 16,
    stars: 13,
    name: 13,
    bottomGap: 16,
  },

  xsMobile: {
    outerW: 335,
    outerH: 410,
    frameW: 285,
    avatar: 62,
    cardPt: 48,
    cardPb: 20,
    cardPx: 18,
    comment: 16,
    stars: 14,
    name: 14,
    bottomGap: 18,
  },

  tablet: {
    outerW: 315,
    outerH: 410,
    frameW: 265,
    avatar: 62,
    cardPt: 48,
    cardPb: 20,
    cardPx: 18,
    comment: 14,
    stars: 14,
    name: 14,
    bottomGap: 18,
  },

  desktop: {
    outerW: 275,
    outerH: 370,
    frameW: 225,
    avatar: 58,
    cardPt: 44,
    cardPb: 18,
    cardPx: 16,
    comment: 14,
    stars: 12,
    name: 12,
    bottomGap: 16,
  },

  xl: {
    outerW: 315,
    outerH: 420,
    frameW: 260,
    avatar: 66,
    cardPt: 50,
    cardPb: 22,
    cardPx: 18,
    comment: 16,
    stars: 13,
    name: 13,
    bottomGap: 18,
  },

  xxl: {
    outerW: 460,
    outerH: 490,
    frameW: 380,
    avatar: 76,
    cardPt: 58,
    cardPb: 24,
    cardPx: 22,
    comment: 20,
    stars: 14,
    name: 14,
    bottomGap: 20,
  },
};

export function ReviewsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews-section"],
    queryFn: async () => {
      const res = await api.get<ReviewSectionData>("/api/reviews-section");
      return res.data;
    },
  });

  const section = data;

  const reviews = useMemo(() => {
    return (
      data?.cards
        ?.filter((review) => review.isActive)
        .sort((a, b) => a.order - b.order) || []
    );
  }, [data?.cards]);

  if (isLoading || !section || reviews.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-10 min-[445px]:py-12 md:py-14 xl:py-16 2xl:py-20">
      <ReviewBackground section={section} />

      <div className="relative z-10 mx-auto w-full max-w-[2200px] px-4 min-[445px]:px-5 md:px-6 lg:px-8 xl:px-12 2xl:px-20">
        <ReviewHeader section={section} />

        <ReviewGrid reviews={reviews} section={section} />

        <div className="mt-8 flex justify-center md:mt-10 xl:mt-12">
          <div className="h-px w-24 bg-[#c9a96e]/40" />
        </div>
      </div>
    </section>
  );
}

function ReviewBackground({ section }: { section: ReviewSectionData }) {
  return (
    <>
      <div
        className="absolute inset-0 z-0 bg-[#efe3cc]"
        style={{
          backgroundImage: `url('${section.backgroundImage || FALLBACKS.bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="absolute inset-0 bg-[#f3ead7]/40" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,239,221,0.80)_0%,rgba(243,234,215,0.60)_40%,rgba(230,218,190,0.40)_70%,rgba(210,195,160,0.20)_100%)]" />
    </>
  );
}

function ReviewHeader({ section }: { section: ReviewSectionData }) {
  return (
    <div className="mb-8 text-center min-[445px]:mb-9 md:mb-10 xl:mb-12">
      <div className="mx-auto mb-4 h-px w-10 bg-[#c9a96e]" />

      <h2 className="mb-4 font-[family-name:var(--font-merienda)] text-[34px] font-bold leading-tight text-[#460d07] min-[445px]:text-[40px] md:text-[48px] lg:text-[56px] xl:text-[64px] 2xl:text-[78px]">
        {section.title || "Müşterilerimizin Kalbinden"}
      </h2>

      <p className="mx-auto max-w-[340px] text-[14px] leading-relaxed text-[#6a5646] min-[445px]:max-w-[520px] min-[445px]:text-[15px] md:max-w-[720px] md:text-[16px] lg:text-[16px] xl:text-[18px] 2xl:max-w-[920px] 2xl:text-[20px]">
        {section.description ||
          "Anadolu'nun eşsiz lezzetlerini deneyimleyen müşterilerimizin gerçek yorumları ve samimi paylaşımları."}
      </p>
    </div>
  );
}

function ReviewGrid({
  reviews,
  section,
}: {
  reviews: HomeReviewCard[];
  section: ReviewSectionData;
}) {
  return (
    <>
      <div className="grid grid-cols-1 justify-items-center gap-y-8 md:hidden">
        {reviews.map((review) => (
          <ResponsiveMobileReview
            key={review.id}
            review={review}
            section={section}
          />
        ))}
      </div>

      <div className="hidden grid-cols-2 justify-items-center gap-x-8 gap-y-10 md:grid lg:hidden">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="tablet"
            section={section}
          />
        ))}
      </div>

      <div className="hidden grid-cols-3 justify-items-center gap-x-8 gap-y-12 lg:grid xl:hidden">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="desktop"
            section={section}
          />
        ))}
      </div>

      <div className="hidden grid-cols-3 justify-items-center gap-x-10 gap-y-16 xl:grid 2xl:hidden">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="xl"
            section={section}
          />
        ))}
      </div>

      <div className="hidden grid-cols-3 justify-items-center gap-x-14 gap-y-20 2xl:grid">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="xxl"
            section={section}
          />
        ))}
      </div>
    </>
  );
}

function ResponsiveMobileReview({
  review,
  section,
}: {
  review: HomeReviewCard;
  section: ReviewSectionData;
}) {
  return (
    <>
      <div className="block min-[445px]:hidden">
        <ReviewCard review={review} variant="mobile" section={section} />
      </div>

      <div className="hidden min-[445px]:block">
        <ReviewCard review={review} variant="xsMobile" section={section} />
      </div>
    </>
  );
}

function ReviewCard({
  review,
  variant,
  section,
}: {
  review: HomeReviewCard;
  variant: ReviewVariant;
  section: ReviewSectionData;
}) {
  const size = REVIEW_SIZES[variant];

  return (
    <article
      className="relative overflow-hidden rounded-[18px] transition-all duration-500 hover:-translate-y-1"
      style={{
        width: size.outerW,
        height: size.outerH,
      }}
    >
      <ReviewProductImage review={review} />

      <div
        className="relative z-20 flex h-full flex-col justify-end"
        style={{
          paddingBottom: size.bottomGap,
        }}
      >
        <ReviewFrame review={review} section={section} size={size} />
      </div>
    </article>
  );
}

function ReviewProductImage({ review }: { review: HomeReviewCard }) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={review.productImage}
          alt={review.name}
          fill
          className="scale-[1.06] object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,transparent_30%)]" />
    </>
  );
}

function ReviewFrame({
  review,
  section,
  size,
}: {
  review: HomeReviewCard;
  section: ReviewSectionData;
  size: ReviewSize;
}) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: size.frameW,
      }}
    >
      <Image
        src={section.frameImage || FALLBACKS.frame}
        alt=""
        fill
        className="pointer-events-none z-20 object-fill"
      />

      <div className="absolute left-1/2 top-0 z-40 -translate-x-1/2 -translate-y-1/2">
        <ReviewAvatar
          name={review.name}
          userImage={review.userImage}
          size={size.avatar}
        />
      </div>

      <div
        className="pointer-events-none absolute left-[8%] right-[8%] -bottom-3 z-0 rounded-full bg-[#8b6a42]/18 blur-xl"
        style={{
          height: size.bottomGap,
        }}
      />

      <ReviewContent review={review} section={section} size={size} />
    </div>
  );
}

function ReviewContent({
  review,
  section,
  size,
}: {
  review: HomeReviewCard;
  section: ReviewSectionData;
  size: ReviewSize;
}) {
  return (
    <div
      className="
        relative z-20 overflow-hidden rounded-[14px]
        border border-[#d8bf8a]
        bg-cover bg-center
        shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]

        before:pointer-events-none before:absolute before:inset-0 before:z-[1]
        before:rounded-[14px]
        before:bg-[linear-gradient(135deg,rgba(255,252,245,0.72),rgba(214,194,160,0.22))]

        after:pointer-events-none after:absolute after:inset-0 after:z-[2]
        after:rounded-[14px]
        after:bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.42)_0%,_rgba(255,255,255,0.10)_30%,_rgba(0,0,0,0)_62%,_rgba(120,92,58,0.10)_100%)]
      "
      style={{
        width: size.frameW,
        backgroundImage: `url('${section.cardTexture || FALLBACKS.texture}')`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-[4] rounded-[14px] shadow-[inset_0_0_18px_rgba(120,92,58,0.10),inset_0_-4px_10px_rgba(120,92,58,0.08)]" />

      <div
        className="relative z-10"
        style={{
          paddingTop: size.cardPt,
          paddingBottom: size.cardPb,
          paddingInline: size.cardPx,
        }}
      >
        <p
          className="line-clamp-4 text-center font-medium leading-snug text-[#3d2b1d]"
          style={{
            fontSize: size.comment,
          }}
        >
          &quot;{review.comment}&quot;
        </p>

        <ReviewStars rating={review.rating} size={size.stars} />

        <p
          className="mt-2 text-center font-semibold tracking-wide text-[#7a5a34]"
          style={{
            fontSize: size.name,
          }}
        >
          {review.name}
        </p>
      </div>
    </div>
  );
}

function ReviewStars({ rating, size }: { rating: number; size: number }) {
  return (
    <div className="mt-3 flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className="text-[#d29a34]"
          fill={index < rating ? "#d29a34" : "transparent"}
        />
      ))}
    </div>
  );
}

function ReviewAvatar({
  name,
  userImage,
  size,
}: {
  name: string;
  userImage?: string;
  size: number;
}) {
  if (userImage) {
    return (
      <div
        className="relative overflow-hidden rounded-full border-[2.5px] border-[#f6ead6] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
        style={{
          width: size,
          height: size,
        }}
      >
        <Image src={userImage} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border-[2.5px] border-[#f6ead6] bg-[#7a5a34] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
      style={{
        width: size,
        height: size,
      }}
    >
      <span
        className="font-bold tracking-wide text-white"
        style={{
          fontSize: size * 0.26,
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

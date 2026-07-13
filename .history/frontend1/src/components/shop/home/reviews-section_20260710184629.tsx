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
    outerW: 245,
    outerH: 305,
    frameW: 205,
    avatar: 48,
    cardPt: 37,
    cardPb: 13,
    cardPx: 13,
    comment: 12,
    stars: 11,
    name: 11,
    bottomGap: 12,
  },

  xsMobile: {
    outerW: 265,
    outerH: 325,
    frameW: 222,
    avatar: 50,
    cardPt: 39,
    cardPb: 14,
    cardPx: 14,
    comment: 12.5,
    stars: 11,
    name: 11.5,
    bottomGap: 12,
  },

  tablet: {
    outerW: 250,
    outerH: 315,
    frameW: 210,
    avatar: 50,
    cardPt: 39,
    cardPb: 14,
    cardPx: 14,
    comment: 12,
    stars: 11,
    name: 11,
    bottomGap: 12,
  },

  desktop: {
    outerW: 245,
    outerH: 310,
    frameW: 205,
    avatar: 48,
    cardPt: 37,
    cardPb: 13,
    cardPx: 13,
    comment: 12,
    stars: 11,
    name: 11,
    bottomGap: 12,
  },

  xl: {
    outerW: 270,
    outerH: 295,
    frameW: 225,
    avatar: 52,
    cardPt: 40,
    cardPb: 14,
    cardPx: 14,
    comment: 13,
    stars: 11.5,
    name: 11.5,
    bottomGap: 13,
  },

  xxl: {
    outerW: 295,
    outerH: 340,
    frameW: 245,
    avatar: 56,
    cardPt: 43,
    cardPb: 15,
    cardPx: 15,
    comment: 14,
    stars: 12,
    name: 12,
    bottomGap: 14,
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

  if (isLoading || !section || reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="
        relative overflow-hidden
        py-6
        min-[445px]:py-7
        md:py-8
        lg:py-8
        xl:py-9
        2xl:py-10

 
        flex items-center
      "
    >
      <ReviewBackground section={section} />

      <div
        className="
          relative z-10 mx-auto w-full
          max-w-[1700px]
          px-4
          min-[445px]:px-5
          md:px-6
          lg:px-8
          xl:px-2
          2xl:px-14
        "
      >
        <ReviewHeader section={section} />

        <ReviewGrid reviews={reviews} section={section} />

        <div className="mt-5 flex justify-center md:mt-6">
          <div className="h-px w-20 bg-[#c9a96e]/40" />
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
          backgroundImage: `url("${section.backgroundImage || FALLBACKS.bg}")`,
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
    <div
      className="
        mb-5 text-center
        min-[445px]:mb-6
        md:mb-7
        lg:mb-6
        xl:mb-7
      "
    >
      <div className="mx-auto mb-3 h-px w-9 bg-[#c9a96e]" />

      <h2
        className="
          mx-auto mb-2
          max-w-[1000px]
          font-[family-name:var(--font-merienda)]
          text-[clamp(27px,4.2vw,54px)]
          font-bold leading-[1.05]
          text-[#460d07]
        "
      >
        {section.title || "Müşterilerimizin Kalbinden"}
      </h2>

      <p
        className="
          mx-auto
          max-w-[330px]
          text-[12px]
          leading-[1.55]
          text-[#6a5646]

          min-[445px]:max-w-[520px]
          min-[445px]:text-[13px]

          md:max-w-[680px]
          md:text-[14px]

          xl:max-w-[760px]
          xl:text-[15px]
        "
      >
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
      {/* Mobil: dikey sayfayı uzatmayan yatay kart alanı */}
      <div
        className="
          -mx-4 flex snap-x snap-mandatory
          gap-4 overflow-x-auto
          px-4 pb-3
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden

          min-[445px]:-mx-5
          min-[445px]:px-5

          md:hidden
        "
      >
        {reviews.map((review) => (
          <div key={review.id} className="shrink-0 snap-center">
            <ResponsiveMobileReview review={review} section={section} />
          </div>
        ))}
      </div>

      {/* Tablet */}
      <div
        className="
          hidden grid-cols-2
          justify-items-center
          gap-x-5 gap-y-6
          md:grid
          lg:hidden
        "
      >
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="tablet"
            section={section}
          />
        ))}
      </div>

      {/* Küçük bilgisayar */}
      <div
        className="
          hidden grid-cols-3
          justify-items-center
          gap-x-5 gap-y-6
          lg:grid
          xl:hidden
        "
      >
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="desktop"
            section={section}
          />
        ))}
      </div>

      {/* Büyük bilgisayar */}
      <div
        className="
          hidden grid-cols-3
          justify-items-center
          gap-x-8 gap-y-7
          xl:grid
          2xl:hidden
        "
      >
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            variant="xl"
            section={section}
          />
        ))}
      </div>

      {/* 2XL */}
      <div
        className="
          hidden grid-cols-3
          justify-items-center
          gap-x-10 gap-y-8
          2xl:grid
        "
      >
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
      className="
        relative overflow-hidden
        rounded-[16px]
        shadow-[0_14px_30px_rgba(76,48,22,0.14)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_38px_rgba(76,48,22,0.20)]
      "
      style={{
        width: size.outerW,
        height: size.outerH,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <ReviewProductImage review={review} />

      <div
        className="
          relative z-20 flex h-full
          flex-col justify-end
        "
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
          sizes="
            (max-width: 444px) 245px,
            (max-width: 767px) 265px,
            (max-width: 1023px) 250px,
            (max-width: 1279px) 245px,
            (max-width: 1535px) 270px,
            295px
          "
          className="
            scale-[1.03]
            object-cover
            transition-transform duration-500
          "
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.22)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_28%)]" />
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
        maxWidth: "calc(100% - 24px)",
      }}
    >
      <Image
        src={section.frameImage || FALLBACKS.frame}
        alt=""
        fill
        sizes={`${size.frameW}px`}
        className="
          pointer-events-none
          z-20 object-fill
        "
      />

      <div
        className="
          absolute left-1/2 top-0 z-40
          -translate-x-1/2 -translate-y-1/2
        "
      >
        <ReviewAvatar
          name={review.name}
          userImage={review.userImage}
          size={size.avatar}
        />
      </div>

      <div
        className="
          pointer-events-none
          absolute -bottom-2
          left-[8%] right-[8%] z-0
          rounded-full
          bg-[#8b6a42]/18 blur-lg
        "
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
        relative z-20
        overflow-hidden rounded-[13px]
        border border-[#d8bf8a]
        bg-cover bg-center

        shadow-[
          0_8px_16px_rgba(120,92,58,0.15),
          0_2px_0_rgba(190,166,118,0.32),
          inset_0_1px_2px_rgba(255,255,255,0.62),
          inset_0_-3px_7px_rgba(160,126,78,0.10)
        ]

        before:pointer-events-none
        before:absolute
        before:inset-0
        before:z-[1]
        before:rounded-[13px]
        before:bg-[linear-gradient(135deg,rgba(255,252,245,0.72),rgba(214,194,160,0.22))]

        after:pointer-events-none
        after:absolute
        after:inset-0
        after:z-[2]
        after:rounded-[13px]
        after:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.08)_30%,transparent_62%,rgba(120,92,58,0.09)_100%)]
      "
      style={{
        width: size.frameW,
        maxWidth: "100%",
        backgroundImage: `url("${section.cardTexture || FALLBACKS.texture}")`,
      }}
    >
      <div
        className="
          pointer-events-none absolute inset-0
          z-[4] rounded-[13px]
          shadow-[inset_0_0_14px_rgba(120,92,58,0.09),inset_0_-3px_8px_rgba(120,92,58,0.07)]
        "
      />

      <div
        className="relative z-10"
        style={{
          paddingTop: size.cardPt,
          paddingBottom: size.cardPb,
          paddingInline: size.cardPx,
        }}
      >
        <p
          className="
            line-clamp-3
            text-center font-medium
            leading-[1.38]
            text-[#3d2b1d]
          "
          style={{
            fontSize: size.comment,
          }}
        >
          &quot;{review.comment}&quot;
        </p>

        <ReviewStars rating={review.rating} size={size.stars} />

        <p
          className="
            mt-1.5 truncate
            text-center font-semibold
            tracking-wide text-[#7a5a34]
          "
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
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="mt-2 flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className="text-[#d29a34]"
          fill={index < safeRating ? "#d29a34" : "transparent"}
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
        className="
          relative overflow-hidden rounded-full
          border-[2px] border-[#f6ead6]
          bg-[#efe3cc]
          shadow-[0_4px_10px_rgba(0,0,0,0.22)]
        "
        style={{
          width: size,
          height: size,
        }}
      >
        <Image
          src={userImage}
          alt={name}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="
        flex items-center justify-center
        rounded-full
        border-[2px] border-[#f6ead6]
        bg-[#7a5a34]
        shadow-[0_4px_10px_rgba(0,0,0,0.22)]
      "
      style={{
        width: size,
        height: size,
      }}
    >
      <span
        className="
          font-bold tracking-wide text-white
        "
        style={{
          fontSize: size * 0.25,
        }}
      >
        {getInitials(name)}
      </span>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

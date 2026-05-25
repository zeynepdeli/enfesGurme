"use client";

import Image from "next/image";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  userImage?: string;
  productImage: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Ayşe Kaya",
    rating: 5,
    comment: "Best quality I've found! Brings a taste of home.",
    productImage: "/helva.png",
  },
  {
    id: 2,
    name: "Mehmet Demir",
    rating: 5,
    comment: "Gerçek ev yapımı tadı birebir hissediliyor.",
    userImage: "/user2.jpg",
    productImage: "/sumak.png",
  },
  {
    id: 3,
    name: "Elif Şahin",
    rating: 5,
    comment: "Baharatların aroması inanılmaz güzel.",
    productImage: "/helva.png",
  },
  {
    id: 4,
    name: "Ufuk Arslan",
    rating: 5,
    comment: "Çocukluğumdaki lezzetleri tekrar yaşadım.",
    userImage: "/user4.jpg",
    productImage: "/biber.png",
  },
  {
    id: 5,
    name: "Selin Yıldız",
    rating: 5,
    comment: "Kalite ve paketleme gerçekten çok başarılı.",
    productImage: "/bal.png",
  },
  {
    id: 6,
    name: "Caner Öztürk",
    rating: 5,
    comment: "Her siparişte aynı kaliteyi görmek harika.",
    userImage: "/user6.jpg",
    productImage: "/baharat.png",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

function Avatar({
  name,
  userImage,
  variant,
}: {
  name: string;
  userImage?: string;
  variant: "mobile" | "tablet" | "desktop" | "xl" | "xxl";
}) {
  const avatarSizes = {
    mobile: 44,
    tablet: 52,
    desktop: 58,
    xl: 66,
    xxl: 76,
  };

  const size = avatarSizes[variant];

  if (userImage) {
    return (
      <div
        className="
          relative overflow-hidden rounded-full
          border-[2.5px] border-[#f6ead6]
          shadow-[0_4px_10px_rgba(0,0,0,0.25)]
        "
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
      className="
        flex items-center justify-center
        rounded-full
        border-[2.5px] border-[#f6ead6]
        bg-[#7a5a34]
        shadow-[0_4px_10px_rgba(0,0,0,0.25)]
      "
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

function ReviewCard({
  review,
  variant,
}: {
  review: Review;
  variant: "mobile" | "tablet" | "desktop" | "xl" | "xxl";
}) {
  const sizes = {
    mobile: {
      outerW: 165,
      outerH: 250,

      frameW: 140,

      cardPt: 34,
      cardPb: 14,
      cardPx: 12,

      comment: 10,
      stars: 10,
      name: 10,

      titleGap: 10,
    },

    tablet: {
      outerW: 220,
      outerH: 320,

      frameW: 180,

      cardPt: 40,
      cardPb: 16,
      cardPx: 14,

      comment: 11,
      stars: 11,
      name: 11,

      titleGap: 12,
    },

    desktop: {
      outerW: 250,
      outerH: 350,

      frameW: 205,

      cardPt: 42,
      cardPb: 18,
      cardPx: 16,

      comment: 12,
      stars: 11,
      name: 11,

      titleGap: 12,
    },

    xl: {
      outerW: 285,
      outerH: 395,

      frameW: 235,

      cardPt: 48,
      cardPb: 20,
      cardPx: 18,

      comment: 13,
      stars: 12,
      name: 12,

      titleGap: 14,
    },

    xxl: {
      outerW: 340,
      outerH: 460,

      frameW: 280,

      cardPt: 56,
      cardPb: 24,
      cardPx: 20,

      comment: 15,
      stars: 14,
      name: 14,

      titleGap: 16,
    },
  };

  const current = sizes[variant];

  return (
    <div
      className="
        relative overflow-hidden rounded-[18px]
        transition-all duration-500
        hover:-translate-y-1
      "
      style={{
        width: current.outerW,
        height: current.outerH,
      }}
    >
      {/* PRODUCT IMAGE */}
      <div className="absolute inset-0">
        <Image
          src={review.productImage}
          alt={review.name}
          fill
          className="scale-[1.06] object-cover"
        />
      </div>

      {/* OVERLAYS */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.22)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,transparent_30%)]" />

      {/* CONTENT */}
      <div
        className="relative z-20 flex h-full flex-col justify-end"
        style={{
          paddingBottom: current.titleGap,
        }}
      >
        <div
          className="relative mx-auto"
          style={{
            width: current.frameW,
          }}
        >
          {/* FRAME */}
          <Image
            src="/hakiCerceve.png"
            alt=""
            fill
            className="pointer-events-none z-20 object-fill"
          />

          {/* AVATAR */}
          <div className="absolute left-1/2 top-0 z-40 -translate-x-1/2 -translate-y-1/2">
            <Avatar
              name={review.name}
              userImage={review.userImage}
              variant={variant}
            />
          </div>

          {/* SHADOW */}
          <div
            className="
              pointer-events-none
              absolute left-[8%] right-[8%]
              -bottom-3 z-0
              rounded-full
              bg-[#8b6a42]/18
              blur-xl
            "
            style={{
              height: current.titleGap,
            }}
          />

          {/* COMMENT CARD */}
          <div
            className="
              relative z-20 overflow-hidden rounded-[14px]

              border border-[#d8bf8a]

              bg-cover bg-center

              shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]

              before:pointer-events-none
              before:absolute
              before:inset-0
              before:z-[1]
              before:rounded-[14px]

              before:bg-[linear-gradient(135deg,rgba(255,252,245,0.72),rgba(214,194,160,0.22))]

              after:pointer-events-none
              after:absolute
              after:inset-0
              after:z-[2]
              after:rounded-[14px]

              after:bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.42)_0%,_rgba(255,255,255,0.10)_30%,_rgba(0,0,0,0)_62%,_rgba(120,92,58,0.10)_100%)]
            "
            style={{
              width: current.frameW,
              backgroundImage: "url('/cardDuvar.png')",
            }}
          >
            {/* INNER SHADOW */}
            <div
              className="
                pointer-events-none
                absolute inset-0 z-[4]
                rounded-[14px]

                shadow-[inset_0_0_18px_rgba(120,92,58,0.10),inset_0_-4px_10px_rgba(120,92,58,0.08)]
              "
            />

            <div
              className="relative z-10"
              style={{
                paddingTop: current.cardPt,
                paddingBottom: current.cardPb,
                paddingInline: current.cardPx,
              }}
            >
              {/* COMMENT */}
              <p
                className="
                  text-center
                  font-medium leading-snug
                  text-[#3d2b1d]
                "
                style={{
                  fontSize: current.comment,
                }}
              >
                &quot;{review.comment}&quot;
              </p>

              {/* STARS */}
              <div className="mt-3 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={current.stars}
                    className="text-[#d29a34]"
                    fill={i < review.rating ? "#d29a34" : "transparent"}
                  />
                ))}
              </div>

              {/* NAME */}
              <p
                className="
                  mt-2 text-center
                  font-semibold tracking-wide
                  text-[#7a5a34]
                "
                style={{
                  fontSize: current.name,
                }}
              >
                {review.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6efdd] py-12 sm:py-16 md:py-20 xl:py-24 2xl:py-28">
      {/* BG */}
      <Image
        src="/duvarBg.png"
        alt=""
        fill
        className="object-cover opacity-20 mix-blend-multiply"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10" />

      <div className="relative z-10 mx-auto w-full max-w-[2200px] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20">
        {/* HEADER */}
        <div className="mb-10 text-center sm:mb-12 md:mb-16 xl:mb-20">
          <div className="mx-auto mb-4 h-px w-10 bg-[#c9a96e]" />

          <h2
            className="
              mb-4 font-serif
              text-[#460d07]

              text-[28px]

              sm:text-[36px]

              md:text-[48px]

              lg:text-[56px]

              xl:text-[64px]

              2xl:text-[78px]
            "
          >
            Müşterilerimizin Kalbinden
          </h2>

          <p
            className="
              mx-auto
              max-w-[320px]
              leading-relaxed text-[#6a5646]

              text-[12px]

              sm:max-w-[520px]
              sm:text-[14px]

              md:max-w-[700px]
              md:text-[15px]

              lg:text-[16px]

              xl:text-[18px]

              2xl:max-w-[920px]
              2xl:text-[20px]
            "
          >
            Anadolu&apos;nun eşsiz lezzetlerini deneyimleyen müşterilerimizin
            gerçek yorumları ve samimi paylaşımları.
          </p>
        </div>

        {/* MOBILE */}
        <div className="grid grid-cols-2 justify-items-center gap-x-2 gap-y-5 sm:gap-x-4 md:hidden">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} variant="mobile" />
          ))}
        </div>

        {/* TABLET */}
        <div className="hidden grid-cols-2 justify-items-center gap-x-6 gap-y-10 md:grid lg:hidden">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} variant="tablet" />
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden grid-cols-3 justify-items-center gap-x-6 gap-y-12 lg:grid xl:hidden">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} variant="desktop" />
          ))}
        </div>

        {/* XL */}
        <div className="hidden grid-cols-3 justify-items-center gap-x-10 gap-y-16 xl:grid 2xl:hidden">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} variant="xl" />
          ))}
        </div>

        {/* XXL */}
        <div className="hidden grid-cols-3 justify-items-center gap-x-14 gap-y-20 2xl:grid">
          {REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} variant="xxl" />
          ))}
        </div>

        {/* BOTTOM */}
        <div className="mt-14 flex justify-center md:mt-20 xl:mt-24">
          <div className="h-[1px] w-24 bg-[#c9a96e]/40" />
        </div>
      </div>
    </section>
  );
}

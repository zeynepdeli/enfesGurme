"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProductCard } from "@/components/products/product-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* =========================
   RESPONSIVE CONFIG
========================= */

const sectionConfig = {
  wrapper: "py-[clamp(42px,7vw,96px)]",

  container:
    "max-w-[1440px] px-[clamp(18px,4vw,64px)] gap-[clamp(28px,5vw,72px)] md:grid-cols-[0.82fr_1.18fr] lg:grid-cols-[0.9fr_1.1fr] xl:grid-cols-[0.94fr_1.06fr]",
};

const videoConfig = {
  mobile:
    "left-1/2 top-[145px] h-[52%] w-[88%] -translate-x-1/2 rounded-t-[999px] rounded-b-[10px]",

  wrapper:
    "md:min-h-[620px] lg:min-h-[700px] xl:min-h-[780px] 2xl:min-h-[860px]",

  videoArea: `
    absolute z-10 overflow-hidden
    rounded-t-[998px]
    rounded-b-[1px]

    md:left-[12%]
    md:top-[24%]
    md:w-[94%]
    md:h-[78%]

    lg:left-[19%]
    lg:top-[24.5%]
    lg:w-[75%]
    lg:h-[79%]

    xl:left-[7%]
    xl:top-[20.5%]
    xl:w-[87%]
    xl:h-[92%]

    2xl:left-[-17.5%]
    2xl:top-[21%]
    2xl:w-[99%]
    2xl:h-[91%]
  `,

  videoBox: `
    relative

    md:h-[580px]
    md:w-[380px]

    lg:h-[640px]
    lg:w-[430px]

    xl:h-[720px]
    xl:w-[480px]

    2xl:h-[780px]
    2xl:w-[530px]
  `,
};

const desktopGrid = {
  grid: "gap-x-[32px] gap-y-[34px] xl:gap-x-[42px] xl:gap-y-[40px] 2xl:gap-x-[54px] 2xl:gap-y-[46px]",

  item: "min-w-[300px] xl:min-w-[340px] 2xl:min-w-[390px]",
};

const desktopCard = {
  card: {
    w: 300,
    h: 148,
    zIndex: 10,
  },

  image: {
    w: 158,
    h: 135,
    top: 5,
    left: 16,
    zIndex: 30,
  },

  contentClass: "pl-[174px]",

  title: "text-[14px]",

  button: "text-[11px] tracking-[0.25em]",
};

const mobileCard = {
  wrapper: "h-[96px] w-[min(78vw,310px)] rounded-[16px] px-4",

  image: "h-[70px] w-[88px]",

  title: "text-[18px]",

  button: "text-[10px] tracking-[0.22em]",

  gap: "gap-4 pt-[180px]",
};

const tabletCard = {
  grid: "max-w-[390px] gap-y-6",

  wrapper: "h-[112px] rounded-[18px] px-5",

  image: "h-[82px] w-[110px]",

  title: "text-[22px]",

  button: "text-[11px] tracking-[0.28em]",
};

/* =========================
   HELPERS
========================= */

function getImageUrl(url?: string | null) {
  if (!url) return "/placeholder.jpg";

  if (url.startsWith("http")) return url;

  if (url.startsWith("/uploads")) {
    return `${API_URL}${url}`;
  }

  if (url.startsWith("/")) return url;

  return `${API_URL}/${url}`;
}

/* =========================
   COMPONENT
========================= */

export function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const res = await api.get<Category[]>("/api/categories");
      return res.data || [];
    },
  });

  const shownCategories = categories?.slice(0, 4) || [];

  return (
    <section
      className={`
        relative w-full overflow-hidden bg-[#efe3cb]
        ${sectionConfig.wrapper}
      `}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        {/* MOBILE BG */}
        <Image
          src="/categoryMobile.png"
          alt=""
          fill
          priority
          className="object-cover object-center md:hidden"
        />

        {/* DESKTOP BG */}
        <Image
          src="/categoryK.png"
          alt=""
          fill
          priority
          className="hidden  md:block"
        />

        {/* MOBILE OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(246,239,221,0.12),rgba(33,18,9,0.34))] md:hidden" />

        {/* DESKTOP LIGHT */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,169,110,0.38)_0%,rgba(214,188,144,0.24)_30%,rgba(168,120,72,0.10)_52%,transparent_88%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,24,10,0.02)_0%,rgba(201,169,110,0.14)_32%,rgba(233,219,191,0.22)_48%,rgba(201,169,110,0.04)_100%)]" />
        </div>
      </div>

      {/* MOBILE VIDEO */}
      <div
        className={`
          pointer-events-none absolute z-[1]
          overflow-hidden md:hidden
          ${videoConfig.mobile}
        `}
      >
        <VideoContent brightness="brightness-[0.72]" />
      </div>

      {/* MAIN GRID */}
      <div
        className={`
          relative z-10 mx-auto grid w-full items-start
          ${sectionConfig.container}
        `}
      >
        {/* LEFT VIDEO */}
        <div
          className={`
            relative hidden items-center justify-center
            md:flex
            ${videoConfig.wrapper}
          `}
        >
          <div className={videoConfig.videoBox}>
            {/* VIDEO */}
            <div className={videoConfig.videoArea}>
              <VideoContent brightness="brightness-[0.86]" />
            </div>

            {/* GLOW */}
            <div
              className="
                absolute z-[1]

                md:left-[10%]
                md:top-[8%]
                md:h-[74%]
                md:w-[70%]

                lg:left-[11%]
                lg:top-[8%]
                lg:h-[75%]
                lg:w-[71%]

                xl:left-[12%]
                xl:top-[8%]
                xl:h-[76%]
                xl:w-[82%]

                rounded-[180px]
                bg-[#f5e3ba]/20
                blur-[55px]
              "
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative z-20 flex flex-col items-center text-center md:items-start md:text-left">
          {/* HEADER */}
          <div className="mb-[clamp(26px,4vw,44px)] md:pt-[clamp(20px,4vw,70px)] lg:pt-[clamp(36px,5vw,96px)]">
            <div className="mx-auto mb-4 h-px w-12 bg-[#c9a96e] md:mx-0" />

            <p className="mb-3 font-sans text-[clamp(10px,2.7vw,13px)] uppercase tracking-[clamp(0.28em,1.2vw,0.5em)] text-[#9f8257]">
              Keşfetmeye Devam Edin
            </p>

            <h2 className="font-serif text-[clamp(46px,12vw,72px)] leading-none text-[#460d07] md:text-[clamp(40px,5vw,62px)] lg:text-[clamp(48px,5vw,72px)]">
              Kategoriler
            </h2>

            <p className="mx-auto mt-4 hidden max-w-md font-sans text-[clamp(13px,1.2vw,16px)] leading-relaxed text-[#4d3725] md:mx-0 md:block">
              Anadolu’nun en özel lezzetlerini keşfedin. Her kategori,
              geleneksel üretimin izlerini taşır.
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* MOBILE */}
              <div
                className={`
                  flex w-full flex-col items-center md:hidden
                  ${mobileCard.gap}
                `}
              >
                {shownCategories.map((cat) => (
                  <SimpleCategoryCard key={cat.id} cat={cat} variant="mobile" />
                ))}
              </div>

              {/* TABLET */}
              <div
                className={`
                  hidden w-full grid-cols-1 md:grid lg:hidden
                  ${tabletCard.grid}
                `}
              >
                {shownCategories.map((cat) => (
                  <SimpleCategoryCard key={cat.id} cat={cat} variant="tablet" />
                ))}
              </div>

              {/* DESKTOP */}
              <div
                className={`
                  hidden w-full grid-cols-2 lg:grid
                  ${desktopGrid.grid}
                `}
              >
                {shownCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`
                      flex w-full justify-start
                      ${desktopGrid.item}
                    `}
                  >
                    <DesktopCategoryCard cat={cat} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================
   VIDEO CONTENT
========================= */

function VideoContent({ brightness }: { brightness: string }) {
  return (
    <>
      <video
        src="/videoc.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={`
          h-full w-full
          scale-[1.08]
          object-cover object-center
          ${brightness}
        `}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.42)_100%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(32,18,8,0.32))]" />
    </>
  );
}

/* =========================
   MOBILE / TABLET CARD
========================= */

function SimpleCategoryCard({
  cat,
  variant,
}: {
  cat: Category;
  variant: "mobile" | "tablet";
}) {
  const config = variant === "mobile" ? mobileCard : tabletCard;

  return (
    <Link
      href={`/categories/${cat.id}`}
      className={`
        group relative flex w-full
        items-center overflow-hidden

        border border-[#e4d7bd]/80

        bg-[#f5ecd8]/88
        bg-cover bg-center

        shadow-[0_14px_20px_rgba(55,34,18,0.24),0_5px_0_rgba(111,72,38,0.18),inset_0_2px_3px_rgba(255,255,255,0.72)]

        transition-all duration-300
        hover:-translate-y-1

        ${config.wrapper}
      `}
      style={{
        backgroundImage: "url('/cardDuvar.png')",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,245,0.58),rgba(214,194,160,0.12))]" />

      <div className="pointer-events-none absolute inset-[6px] rounded-[12px] border border-[#e7d8b8]/65" />

      <div
        className={`
          relative z-10 shrink-0
          ${config.image}
        `}
      >
        <Image
          src={getImageUrl(cat.image)}
          alt={cat.name}
          fill
          className="object-contain drop-shadow-[0_6px_10px_rgba(65,35,16,0.22)]"
        />
      </div>

      <div className="relative z-10 ml-3 flex min-w-0 flex-1 flex-col items-start md:ml-4">
        <div className="mb-1.5 h-px w-6 bg-[#c9a96e] md:mb-2 md:w-8" />

        <h3
          className={`
            line-clamp-1 font-serif font-bold text-[#2c1a0e]
            ${config.title}
          `}
        >
          {cat.name}
        </h3>

        <div className="mt-2 flex w-full items-center gap-2 md:mt-3 md:gap-3">
          <span
            className={`
              font-sans font-black uppercase text-[#7a3b1e]
              ${config.button}
            `}
          >
            İncele
          </span>

          <div className="h-px flex-1 bg-[#c9a96e]/45" />

          <span className="text-[12px] font-bold text-[#a58b55] md:text-sm">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* =========================
   DESKTOP CARD
========================= */

function DesktopCategoryCard({ cat }: { cat: Category }) {
  return (
    <ProductCard
      embossed
      wallTexture="/cardDuvar.png"
      product={{
        name: cat.name,
        price: 0,
        slug: `categories/${cat.id}`,
        images: [{ url: getImageUrl(cat.image) }],
        description: "",
      }}
      showPrice={false}
      showDescription={false}
      clickable
      href={`/categories/${cat.id}`}
      card={desktopCard.card}
      image={desktopCard.image}
      contentClass={desktopCard.contentClass}
      className="
        relative rounded-[18px]

        shadow-[0_18px_28px_rgba(55,34,18,0.35),0_7px_0_rgba(111,72,38,0.35),inset_0_2px_3px_rgba(255,255,255,0.85),inset_0_-5px_10px_rgba(88,55,28,0.22)]

        transition-all duration-300
        hover:-translate-y-1
      "
    >
      <div className="group flex flex-col justify-center gap-2">
        <div className="h-[1.5px] w-6 bg-[#c9a96e]" />

        <h3
          className={`
            font-serif font-bold leading-tight tracking-wide text-[#2c1a0e]
            ${desktopCard.title}
          `}
        >
          {cat.name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          <span
            className={`
              mt-2 font-sans font-black uppercase text-[#7a3b1e]
              ${desktopCard.button}
            `}
          >
            İncele
          </span>

          <div className="h-px flex-1 bg-[#c9a96e]/40" />

          <span className="text-[11px] font-bold leading-none text-[#a58b55]">
            →
          </span>
        </div>
      </div>
    </ProductCard>
  );
}

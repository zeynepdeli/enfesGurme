"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ProductCard } from "@/components/products/product-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type CategorySectionSettings = {
  eyebrowText: string;
  title: string;
  description: string;
  desktopBackground: string;
  mobileBackground: string;
  videoUrl: string;
  cardTexture: string;
  buttonText: string;
};

type Variant = "mobile" | "tablet";
type DesktopSize = "lg" | "xl" | "xxl";

const sectionConfig = {
  wrapper:
    "py-[42px] sm:py-[54px] md:py-[64px] lg:py-[76px] xl:py-[84px] 2xl:py-[92px]",

  container: `
    max-w-[1700px]
    px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-20
    gap-8 sm:gap-10 md:gap-10 lg:gap-12 xl:gap-14 2xl:gap-16
    md:grid-cols-[0.72fr_1.28fr]
    lg:grid-cols-[0.74fr_1.26fr]
    xl:grid-cols-[0.78fr_1.22fr]
    2xl:grid-cols-[0.82fr_1.18fr]
  `,
};

const videoConfig = {
  mobile: `
    left-1/2
    top-[160px]
    h-[77%]
   
    w-[72%]
    -translate-x-1/2
    overflow-hidden

    rounded-tl-[46%]
    rounded-tr-[46%]
    rounded-bl-[10px]
    rounded-br-[10px]
  `,

  wrapper:
    "md:min-h-[540px] lg:min-h-[620px] xl:min-h-[700px] 2xl:min-h-[790px]",

  videoBox: `
    relative
    md:h-[500px] md:w-[350px]
    lg:h-[585px] lg:w-[410px]
    xl:h-[670px] xl:w-[470px]
    2xl:h-[760px] 2xl:w-[540px]
  `,

  videoArea: `
    absolute z-10 overflow-hidden

    md:left-[23%]
    md:top-[30%]
    md:h-[120%]
    md:w-[77%]
    md:rounded-tl-[46%]
    md:rounded-tr-[46%]

    lg:left-[24%]
    lg:top-[22%]
    lg:h-[93%]
    lg:w-[90%]
    lg:rounded-tl-[48%]
    lg:rounded-tr-[48%]

    xl:left-[22%]
    xl:top-[21%]
    xl:h-[89%]
    xl:w-[85%]
    xl:rounded-tl-[50%]
    xl:rounded-tr-[50%]

    2xl:left-[4%]
    2xl:top-[20%]
    2xl:h-[89.5%]
    2xl:w-[99%]
    2xl:rounded-tl-[56%]
    2xl:rounded-tr-[52%]

    rounded-bl-[2px]
    rounded-br-[2px]
  `,
};

const desktopGrid = {
  grid: `
    gap-x-8 gap-y-10
    lg:gap-x-10 lg:gap-y-10
    xl:gap-x-16 xl:gap-y-12
    2xl:gap-x-28 2xl:gap-y-16
  `,
  item: "min-w-0 justify-center",
};

const desktopCardBySize = {
  lg: {
    wrapper: "max-w-[315px]",
    card: { w: 330, h: 168, zIndex: 10 },
    image: { w: 162, h: 138, top: 14, left: 16, zIndex: 30 },
    contentClass: "pl-[180px]",
    title: "text-[16px]",
    button: "text-[10px] tracking-[0.22em]",
  },

  xl: {
    wrapper: "max-w-[400px]",
    card: { w: 365, h: 180, zIndex: 10 },
    image: { w: 182, h: 150, top: 13, left: 17, zIndex: 30 },
    contentClass: "pl-[205px]",
    title: "text-[18px]",
    button: "text-[11px] tracking-[0.24em]",
  },

  xxl: {
    wrapper: "max-w-[490px]",
    card: { w: 420, h: 195, zIndex: 10 },
    image: { w: 208, h: 170, top: 12, left: 20, zIndex: 30 },
    contentClass: "pl-[235px]",
    title: "text-[20px]",
    button: "text-[12px] tracking-[0.27em]",
  },
};

const mobileCard = {
  wrapper: "h-[94px] w-[min(98vw,400px)] rounded-[16px] px-4",
  image: "h-[68px] w-[86px]",
  title: "text-[18px]",
  button: "text-[10px] tracking-[0.22em]",
  gap: "gap-4 pt-[150px]",
};

const tabletCard = {
  grid: "max-w-[540px] gap-y-5",
  wrapper: "h-[118px] rounded-[18px] px-5",
  image: "h-[86px] w-[118px]",
  title: "text-[23px]",
  button: "text-[11px] tracking-[0.28em]",
};

function getImageUrl(url?: string | null) {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_URL}${url}`;
  if (url.startsWith("/")) return url;
  return `${API_URL}/${url}`;
}

function getVideoUrl(url?: string | null) {
  if (!url) return "/videoc.mp4";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return `${API_URL}${url}`;
  if (url.startsWith("/")) return url;
  return `${API_URL}/${url}`;
}

export function CategoriesSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["categories-section"],
    queryFn: async () => {
      const [categoriesRes, settingsRes] = await Promise.all([
        api.get<Category[]>("/api/categories"),
        api.get<CategorySectionSettings>("/api/category-section"),
      ]);

      return {
        categories: categoriesRes.data || [],
        settings: settingsRes.data || null,
      };
    },
  });

  const categories = data?.categories || [];
  const settings = data?.settings;
  const shownCategories = categories.slice(0, 4);

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#efe3cb] ${sectionConfig.wrapper}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: `url('${
              settings?.mobileBackground || "/categoryMobile.png"
            }')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div
          className="absolute inset-0 hidden bg-center bg-no-repeat md:block"
          style={{
            backgroundImage: `url('${
              settings?.desktopBackground || "/categoryK.png"
            }')`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="absolute inset-0 bg-[#efe3cb]/12" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(246,239,221,0.04),rgba(33,18,9,0.18))] md:hidden" />

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[60%] md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,169,110,0.34)_0%,rgba(214,188,144,0.22)_30%,rgba(168,120,72,0.08)_52%,transparent_88%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,24,10,0.02)_0%,rgba(201,169,110,0.12)_32%,rgba(233,219,191,0.20)_48%,rgba(201,169,110,0.04)_100%)]" />
        </div>
      </div>

      <div
        className={`pointer-events-none absolute z-[1] md:hidden ${videoConfig.mobile}`}
      >
        <VideoContent
          brightness="brightness-[0.74]"
          videoUrl={settings?.videoUrl}
        />
      </div>

      <div
        className={`relative z-10 mx-auto grid w-full items-start ${sectionConfig.container}`}
      >
        <div
          className={`relative hidden items-center justify-center md:flex ${videoConfig.wrapper}`}
        >
          <div className={videoConfig.videoBox}>
            <div className={videoConfig.videoArea}>
              <VideoContent
                brightness="brightness-[0.88]"
                videoUrl={settings?.videoUrl}
              />
            </div>

            <div
              className="
                absolute z-[1]
                md:left-[15%] md:top-[10%] md:h-[70%] md:w-[65%]
                lg:left-[16%] lg:top-[10%] lg:h-[72%] lg:w-[66%]
                xl:left-[18%] xl:top-[10%] xl:h-[76%] xl:w-[68%]
                2xl:left-[20%] 2xl:top-[10%] 2xl:h-[78%] 2xl:w-[68%]
                rounded-[180px]
                bg-[#f5e3ba]/20
                blur-[55px]
              "
            />
          </div>
        </div>

        <div
          className="
            relative z-20 flex flex-col items-center text-center
            md:items-start md:text-left md:pl-8
            lg:pl-20
            xl:pl-12
            2xl:pl-16
          "
        >
          <div className="mb-7 md:mb-8 md:pt-8 lg:mb-9 lg:pt-14 xl:mb-10 xl:pt-16 2xl:pt-20">
            <div className="mx-auto mb-3 h-px w-12 bg-[#c9a96e] md:mx-0" />

            <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.28em] text-[#9f8257] sm:text-[11px] md:text-[12px] xl:text-[13px]">
              {settings?.eyebrowText || "Keşfetmeye Devam Edin"}
            </p>

            <h2 className="font-[family-name:var(--font-merienda)] text-[clamp(34px,5vw,68px)] font-bold leading-none text-[#460d07] xl:text-[clamp(54px,4.4vw,74px)]">
              {settings?.title || "Kategoriler"}
            </h2>

            <p className="mx-auto mt-3 hidden max-w-md font-sans text-[14px] leading-relaxed text-[#4d3725] md:mx-0 md:block lg:text-[15px] xl:text-[16px]">
              {settings?.description ||
                "Anadolu’nun en özel lezzetlerini keşfedin. Her kategori, geleneksel üretimin izlerini taşır."}
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <div
                className={`flex w-full flex-col items-center md:hidden ${mobileCard.gap}`}
              >
                {shownCategories.map((cat) => (
                  <SimpleCategoryCard
                    key={cat.id}
                    cat={cat}
                    variant="mobile"
                    settings={settings}
                  />
                ))}
              </div>

              <div
                className={`hidden w-full grid-cols-1 md:grid lg:hidden ${tabletCard.grid}`}
              >
                {shownCategories.map((cat) => (
                  <SimpleCategoryCard
                    key={cat.id}
                    cat={cat}
                    variant="tablet"
                    settings={settings}
                  />
                ))}
              </div>

              <div
                className={`hidden w-full grid-cols-1 lg:grid lg:grid-cols-2 xl:hidden ${desktopGrid.grid}`}
              >
                {shownCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex w-full ${desktopGrid.item}`}
                  >
                    <DesktopCategoryCard
                      cat={cat}
                      settings={settings}
                      size="lg"
                    />
                  </div>
                ))}
              </div>

              <div
                className={`hidden w-full grid-cols-2 xl:grid 2xl:hidden ${desktopGrid.grid}`}
              >
                {shownCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex w-full ${desktopGrid.item}`}
                  >
                    <DesktopCategoryCard
                      cat={cat}
                      settings={settings}
                      size="xl"
                    />
                  </div>
                ))}
              </div>

              <div
                className={`hidden w-full grid-cols-2 2xl:grid ${desktopGrid.grid}`}
              >
                {shownCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex w-full ${desktopGrid.item}`}
                  >
                    <DesktopCategoryCard
                      cat={cat}
                      settings={settings}
                      size="xxl"
                    />
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

function VideoContent({
  brightness,
  videoUrl,
}: {
  brightness: string;
  videoUrl?: string;
}) {
  return (
    <>
      <video
        src={getVideoUrl(videoUrl)}
        autoPlay
        muted
        loop
        playsInline
        className={`h-full w-full scale-[1.05] object-cover object-[center_18%] ${brightness}`}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_46%,rgba(0,0,0,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(32,18,8,0.24))]" />
    </>
  );
}

function SimpleCategoryCard({
  cat,
  variant,
  settings,
}: {
  cat: Category;
  variant: Variant;
  settings?: CategorySectionSettings | null;
}) {
  const config = variant === "mobile" ? mobileCard : tabletCard;

  return (
    <Link
      href={`/categories/${cat.id}`}
      className={`group relative flex w-full items-center overflow-hidden border border-[#e4d7bd]/80 bg-[#f5ecd8]/88 bg-cover bg-center shadow-[0_14px_20px_rgba(55,34,18,0.24),0_5px_0_rgba(111,72,38,0.18),inset_0_2px_3px_rgba(255,255,255,0.72)] transition-all duration-300 hover:-translate-y-1 ${config.wrapper}`}
      style={{
        backgroundImage: `url('${settings?.cardTexture || "/cardDuvar.png"}')`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,245,0.58),rgba(214,194,160,0.12))]" />
      <div className="pointer-events-none absolute inset-[6px] rounded-[12px] border border-[#e7d8b8]/65" />

      <div className={`relative z-10 shrink-0 ${config.image}`}>
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
          className={`line-clamp-1 font-serif font-bold text-[#2c1a0e] ${config.title}`}
        >
          {cat.name}
        </h3>

        <div className="mt-2 flex w-full items-center gap-2 md:mt-3 md:gap-3">
          <span
            className={`font-sans font-black uppercase text-[#7a3b1e] ${config.button}`}
          >
            {settings?.buttonText || "İncele"}
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

function DesktopCategoryCard({
  cat,
  settings,
  size,
}: {
  cat: Category;
  settings?: CategorySectionSettings | null;
  size: DesktopSize;
}) {
  const config = desktopCardBySize[size];

  return (
    <div className={`w-full ${config.wrapper}`}>
      <ProductCard
        embossed
        wallTexture={settings?.cardTexture || "/cardDuvar.png"}
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
        card={config.card}
        image={config.image}
        contentClass={config.contentClass}
        className="
          relative rounded-[18px]
          shadow-[0_18px_28px_rgba(55,34,18,0.35),0_7px_0_rgba(111,72,38,0.35),inset_0_2px_3px_rgba(255,255,255,0.85),inset_0_-5px_10px_rgba(88,55,28,0.22)]
          transition-all duration-300
          hover:-translate-y-1
        "
      >
        <div className="group flex flex-col justify-center gap-2">
          <div className="h-[1.5px] w-7 bg-[#c9a96e]" />

          <h3
            className={`font-serif font-bold leading-tight tracking-wide text-[#2c1a0e] ${config.title}`}
          >
            {cat.name}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`mt-2 font-sans font-black uppercase text-[#7a3b1e] ${config.button}`}
            >
              {settings?.buttonText || "İncele"}
            </span>

            <div className="h-px flex-1 bg-[#c9a96e]/40" />

            <span className="text-[12px] font-bold leading-none text-[#a58b55]">
              →
            </span>
          </div>
        </div>
      </ProductCard>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { FeaturedCard } from "@/types";

type Slide = {
  id: number;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink: string;
  imageUrl: string;
};

type HeroSetting = {
  eyebrowText: string;
  backgroundImage: string;
  buttonBgImage: string;
  featuredTitle: string;
  featuredButtonText: string;
  featuredLimit: number;
  autoplay: boolean;
  autoplayMs: number;
};

const DEFAULT_AUTOPLAY_MS = 5000;
const DEFAULT_FEATURED_LIMIT = 4;

const HERO_SIZES = {
  section:
    "min-h-[88svh] pt-[86px] min-[445px]:pt-[90px] sm:pt-[96px] md:min-h-[94svh] md:pt-16 lg:min-h-[99svh] lg:pt-14 xl:min-h-[99svh] xl:pt-0 2xl:min-h-[85svh] 2xl:pt-2",

  wrapper:
    "px-4 min-[445px]:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 md:-translate-x-6 lg:translate-x-24 xl:-translate-x-14 2xl:-translate-x-24",

  layout:
    "relative z-10 mx-auto grid w-full max-w-[1800px] grid-cols-1 items-center md:grid-cols-[70%_62%] lg:grid-cols-[58%_%] xl:grid-cols-[60%_52%] 2xl:grid-cols-[65%_55%]",

  imageBox:
    "h-[340px] min-[445px]:h-[360px] sm:h-[390px] md:h-[650px] md:max-w-[820px] lg:h-[660px] lg:max-w-none xl:h-[620px] 2xl:h-[700px]",

  imagePosition:
    "-mt-2 min-[445px]:-mt-3 sm:-mt-4 md:mt-0 lg:-mt-8 xl:mt-0 2xl:mt-0",

  imageMove:
    "translate-x-0 -translate-y-2 min-[445px]:-translate-y-3 sm:-translate-y-4 md:translate-x-10 md:translate-y-0 lg:translate-x-16 lg:-translate-y-2 xl:translate-x-36 xl:-translate-y-4 2xl:translate-x-64 2xl:translate-y-0",

  imageScale:
    "scale-110 min-[445px]:scale-[1.12] sm:scale-110 md:scale-125 lg:scale-[1.4] xl:scale-[1.12] 2xl:scale-[1.15]",

  textMove:
    "translate-x-0 translate-y-0 md:translate-x-8 md:translate-y-8 lg:translate-x-0 lg:translate-y-42 xl:-translate-x-16 xl:translate-y-14 2xl:translate-x-0 2xl:translate-y-0",

  featured:
    "mt-2 min-[445px]:mt-3 md:mt-8 md:px-8 lg:mt-8 lg:px-0 xl:mt-0 2xl:mt-8",
};

const heroAnimationStyles = `
  @keyframes heroSlideImageIn {
    0% {
      opacity: 0;
      transform: translateX(-80px) scale(0.96);
      filter: blur(10px);
    }

    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes heroSlideTextIn {
    0% {
      opacity: 0;
      transform: translateX(50px);
      filter: blur(6px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
      filter: blur(0);
    }
  }

  .hero-slide-image {
    animation: heroSlideImageIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .hero-slide-text {
    animation: heroSlideTextIn 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
`;

export function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [cards, setCards] = useState<FeaturedCard[]>([]);
  const [settings, setSettings] = useState<HeroSetting | null>(null);
  const [current, setCurrent] = useState(0);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const [slidesRes, cardsRes, settingsRes] = await Promise.all([
          api.get<Slide[]>("/api/hero-slides"),
          api.get<FeaturedCard[]>("/api/featured-cards"),
          api.get<HeroSetting>("/api/hero-settings"),
        ]);

        setSlides(slidesRes.data ?? []);
        setCards(cardsRes.data ?? []);
        setSettings(settingsRes.data ?? null);
      } catch (error) {
        console.error("Hero data fetch error:", error);
      }
    }

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    if (settings?.autoplay === false) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setAnimateKey((prev) => prev + 1);
    }, settings?.autoplayMs || DEFAULT_AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [slides.length, settings?.autoplay, settings?.autoplayMs]);

  const slide = slides[current];

  const featuredCards = useMemo(() => {
    return cards.slice(0, settings?.featuredLimit || DEFAULT_FEATURED_LIMIT);
  }, [cards, settings?.featuredLimit]);

  if (!slide) return null;

  return (
    <section
      className={`relative flex w-full flex-col overflow-hidden ${HERO_SIZES.section}`}
    >
      <div className={`w-full ${HERO_SIZES.wrapper}`}>
        <div className={HERO_SIZES.layout}>
          <HeroImage slide={slide} animateKey={animateKey} />
          <HeroText slide={slide} settings={settings} animateKey={animateKey} />
        </div>
      </div>

      {!!featuredCards.length && (
        <FeaturedCards cards={featuredCards} settings={settings} />
      )}

      <style>{heroAnimationStyles}</style>
    </section>
  );
}

function HeroImage({
  slide,
  animateKey,
}: {
  slide: Slide;
  animateKey: number;
}) {
  return (
    <div
      className={`
        order-2 z-20 flex items-center justify-center transition-transform duration-300
        md:order-1 md:justify-center lg:justify-start
        ${HERO_SIZES.imagePosition}
        ${HERO_SIZES.imageMove}
      `}
    >
      <div
        key={`image-${slide.id}-${animateKey}`}
        className={`hero-slide-image relative w-full overflow-visible ${HERO_SIZES.imageBox}`}
      >
        <Image
          src={slide.imageUrl}
          alt={slide.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
          className={`
            object-contain object-center
            drop-shadow-[0_24px_44px_rgba(50,28,12,0.22)]
            ${HERO_SIZES.imageScale}
          `}
        />
      </div>
    </div>
  );
}

function HeroText({
  slide,
  settings,
  animateKey,
}: {
  slide: Slide;
  settings: HeroSetting | null;
  animateKey: number;
}) {
  return (
    <div
      key={`text-${slide.id}-${animateKey}`}
      className={`
        hero-slide-text order-1 z-30 mx-auto flex w-full max-w-[94vw]
        flex-col justify-center text-center text-[#460d07]
        transition-transform duration-300
        min-[445px]:max-w-[92vw]
        md:order-2 md:mx-0 md:max-w-[460px] md:text-left
        lg:max-w-[520px]
        xl:max-w-[590px]
        2xl:max-w-[900px]
        ${HERO_SIZES.textMove}
      `}
    >
      <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#b48a54] min-[445px]:text-[13px] md:text-xs">
        {settings?.eyebrowText || "Anadolu'nun En Özel Lezzetleri"}
      </p>

      <h1 className="mt-2 font-[family-name:var(--font-merienda)] text-[48px] leading-[1.02] min-[445px]:text-[52px] sm:text-[54px] md:text-[44px] lg:text-[58px] xl:text-[72px] 2xl:text-[84px]">
        {slide.title}
      </h1>

      {slide.description && (
        <p className="mx-auto mt-3 max-w-[92vw] text-[16px] leading-relaxed text-[#4d3827] min-[445px]:max-w-[90vw] min-[445px]:text-[17px] sm:max-w-[88vw] sm:text-[17px] md:mx-0 md:max-w-[320px] md:text-[13px] lg:max-w-[380px] lg:text-[15px] xl:max-w-[430px] xl:text-[16px] 2xl:max-w-[470px] 2xl:text-[18px]">
          {slide.description}
        </p>
      )}

      <HeroButton slide={slide} settings={settings} />
    </div>
  );
}

function HeroButton({
  slide,
  settings,
}: {
  slide: Slide;
  settings: HeroSetting | null;
}) {
  return (
    <a
      href={slide.buttonLink}
      className="
        group relative mx-auto mt-5 inline-flex w-fit items-center justify-center
        overflow-hidden rounded-md border border-[#d8bf8a] bg-cover bg-center
        px-8 py-3 text-[10px] font-bold uppercase tracking-[0.18em]
        text-[#460e07] transition duration-300 hover:-translate-y-[1px]
        shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
        min-[445px]:px-9
        md:mx-0
        lg:px-9 lg:py-3.5
      "
      style={{
        backgroundImage: `url('${
          settings?.buttonBgImage || "/cardDuvar.png"
        }')`,
      }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
      <span className="pointer-events-none absolute inset-[4px] rounded-sm border border-[#e0c896]/60" />

      <span className="relative z-10 whitespace-nowrap">
        {slide.buttonText || "Keşfet ve Satın Al"}
      </span>
    </a>
  );
}

function FeaturedCards({
  cards,
  settings,
}: {
  cards: FeaturedCard[];
  settings: HeroSetting | null;
}) {
  return (
    <div className={`relative z-10 w-full shrink-0 ${HERO_SIZES.featured}`}>
      <div className="w-full md:mx-auto md:max-w-[860px] lg:mx-0 lg:max-w-none lg:pl-[17%] lg:pr-14 xl:pl-[35%] 2xl:pl-[40%] 2xl:pr-24 lg:mt-52 xl:-mt-24 2xl:-mt-6">
        <h2 className="px-8 font-[family-name:var(--font-caveat-brush)] text-[30px] leading-none text-[#8b4a2e] min-[445px]:text-[34px] md:px-0 md:text-[34px] lg:text-[30px] xl:text-[36px]">
          {settings?.featuredTitle || "Günün Öne Çıkanları"}
        </h2>

        <div className="hide-scrollbar w-full overflow-x-auto overflow-y-hidden px-8 pb-3 min-[445px]:px-10 md:overflow-visible md:px-0">
          <div className="flex w-max min-w-full gap-4 min-[445px]:gap-5 md:grid md:w-full md:min-w-0 md:grid-cols-2 md:gap-4 lg:flex lg:w-fit lg:min-w-0 lg:gap-8 xl:gap-8 2xl:gap-16">
            {cards.map((card, index) => (
              <FeaturedCardItem
                key={card.id}
                card={card}
                index={index}
                buttonText={settings?.featuredButtonText || "KEŞFET"}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 md:hidden">
          {cards.map((card, index) => (
            <span
              key={card.id}
              className={
                index === 0
                  ? "block h-1.5 w-8 rounded-full bg-[#b88a55]"
                  : "block h-1.5 w-1.5 rounded-full bg-[#c9aa7e]"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCardItem({
  card,
  index,
  buttonText,
}: {
  card: FeaturedCard;
  index: number;
  buttonText: string;
}) {
  return (
    <a
      href="/products"
      className="
        group relative flex shrink-0 flex-col items-center
        w-[66vw] max-w-[245px] px-3 pb-4 pt-2
        min-[445px]:w-[58vw] min-[445px]:max-w-[260px]
        sm:w-[50vw] sm:max-w-[265px]
        md:w-auto md:max-w-none md:min-w-0
        lg:w-[180px] lg:flex-none lg:px-1.5
        xl:w-[205px]
        2xl:w-[232px]
      "
    >
      {index !== 0 && (
        <span className="absolute left-0 top-[18%] hidden h-[68%] w-px bg-[#d8bf8a]/80 lg:block" />
      )}

      <h3
        title={card.title}
        className="z-20 -mb-5 line-clamp-2 max-w-full text-center font-[family-name:var(--font-cormorant)] text-[28px] font-bold leading-none text-[#2d1208] min-[445px]:text-[30px] md:text-[28px] lg:text-[24px] xl:text-[28px]"
      >
        {card.title}
      </h3>

      <div className="relative mt-1.5 h-[150px] w-full min-[445px]:h-[165px] md:h-[130px] lg:h-[115px] xl:h-[128px]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[112%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,246,0.95)_0%,rgba(255,247,224,0.70)_32%,rgba(245,224,178,0.28)_58%,rgba(232,202,145,0.08)_74%,transparent_88%)] blur-2xl opacity-95 transition duration-300 group-hover:scale-110" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[76%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,250,0.96)_0%,rgba(255,249,230,0.66)_42%,rgba(247,232,195,0.14)_70%,transparent_88%)] blur-[10px]" />
        <div className="pointer-events-none absolute left-1/2 top-[72%] z-0 h-[24%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,78,36,0.07)_0%,rgba(116,78,36,0.035)_40%,transparent_72%)] blur-xl" />

        <Image
          src={card.imageUrl}
          alt={card.title}
          fill
          sizes="(max-width: 768px) 66vw, 230px"
          className="relative z-10 object-contain scale-105 drop-shadow-[0_16px_20px_rgba(60,34,16,0.16)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-110"
        />
      </div>

      <span
        className="mt-2 rounded-full border-2 border-transparent px-6 py-1 text-[14px] font-bold uppercase tracking-[0.18em] text-[#e8dcc0]"
        style={{
          backgroundImage: `
            linear-gradient(#524528, #524528),
            linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
          `,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {buttonText}
      </span>
    </a>
  );
}

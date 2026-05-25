"use client";

import { useEffect, useState } from "react";
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

const CARD_COUNT = 4;

export function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [cards, setCards] = useState<FeaturedCard[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [slidesRes, cardsRes] = await Promise.all([
          api.get<Slide[]>("/api/hero-slides"),
          api.get<FeaturedCard[]>("/api/featured-cards"),
        ]);

        setSlides(slidesRes.data || []);
        setCards(cardsRes.data || []);
      } catch (error) {
        console.error("Hero data fetch error:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const featuredCards = cards.slice(0, CARD_COUNT);

  return (
    <section
      className="
        relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#efe3cc]

        pt-[92px]
        sm:pt-[100px]
        md:pt-[88px]
        lg:pt-[76px]
        xl:pt-[80px]
     
      "
    >
      <Image src="/heroB.png" alt="" fill priority />

      <div className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-[#f4ead5]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_45%,rgba(246,239,221,0.24)_0%,rgba(246,239,221,0.08)_42%,transparent_72%)]" />
        <div className="absolute bottom-[-10%] right-[-6%] h-[34%] w-[36%] rounded-full bg-[#fff5df]/50 blur-[26px]" />
      </div>

      {/* HERO */}
      <div
        className="
    relative z-10 grid w-full grid-cols-1 items-center
    gap-y-2 px-[clamp(16px,4vw,44px)] pb-0

    md:grid-cols-[48%_52%]
    md:gap-x-2
    md:px-[clamp(24px,4vw,40px)]

    lg:grid-cols-[51%_49%]
    lg:gap-x-0
    lg:px-[clamp(24px,3.5vw,64px)]

    xl:grid-cols-[60%_40%]
    xl:px-[clamp(80px,6vw,120px)]

    2xl:grid-cols-[55%_47%]
    2xl:px-[clamp(190px,5.5vw,170px)]
  "
      >
        {/* IMAGE */}
        <div
          className="
    order-2 z-20 flex items-center justify-center
    -mt-12

    md:order-1
    md:justify-center
    md:mt-0

    lg:justify-end
    lg:-mt-6

    xl:-mt-10
    2xl:-mt-12
  "
        >
          <div
            className="
      relative w-full
      h-[clamp(320px,72vw,420px)]
      max-w-[92vw]

      md:h-[clamp(420px,52vw,560px)]
      md:max-w-[520px]

      lg:h-[clamp(520px,52vw,690px)]
      lg:max-w-none

      xl:h-[clamp(620px,76vh,830px)]

      2xl:h-[clamp(640px,78vh,890px)]
    "
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority
              sizes="(max-width: 768px) 92vw, 50vw"
              className="
        object-cover
        drop-shadow-[0_24px_44px_rgba(50,28,12,0.22)]

        lg:translate-x-[40px]
        xl:translate-x-[70px]
        2xl:translate-x-[160px]

      "
            />
          </div>
        </div>

        {/* TEXT */}
        <div
          className="
    order-1 z-30 mx-auto flex w-full max-w-[500px]
    flex-col justify-center text-center text-[#460d07]

    md:order-2
    md:mx-0
    md:max-w-[420px]
    md:text-left
    md:mt-0

    lg:max-w-[480px]
    lg:-ml-[10px]
    lg:-mt-6

    xl:max-w-[540px]
    xl:-ml-[18px]
    xl:-mt-10

    2xl:max-w-[690px]
  "
        >
          <p className="text-[clamp(8px,1.25vw,12px)] font-medium uppercase tracking-[clamp(0.1em,0.35vw,0.26em)] text-[#b48a54]">
            Anadolu&apos;nun En Özel Lezzetleri
          </p>

          <h1 className="mt-[clamp(5px,0.9vw,10px)] font-serif text-[clamp(32px,7.2vw,58px)] leading-[0.94] tracking-[-0.04em] text-[#431208] md:text-[clamp(30px,4vw,46px)] lg:text-[clamp(38px,4vw,58px)] xl:text-[clamp(48px,4.4vw,74px)] 2xl:text-[clamp(56px,4.6vw,84px)]">
            {slide.title}
          </h1>

          {slide.description && (
            <p className="mx-auto mt-[clamp(7px,1.2vw,13px)] max-w-[min(86vw,370px)] text-[clamp(11px,2.2vw,14px)] leading-[1.42] text-[#4d3827] md:mx-0 md:max-w-[320px] md:text-[clamp(11px,1.1vw,13px)] lg:max-w-[380px] lg:text-[clamp(12px,1vw,15px)] xl:max-w-[420px] xl:text-[clamp(13px,1vw,17px)] 2xl:max-w-[470px] 2xl:text-[clamp(15px,1.05vw,18px)]">
              {slide.description}
            </p>
          )}

          <a
            href={slide.buttonLink}
            className="
              group relative mx-auto mt-[clamp(13px,2.2vw,24px)]
              inline-flex w-fit items-center justify-center overflow-hidden
              rounded-[6px] border border-[#d8bf8a]
              bg-cover bg-center
              px-[clamp(18px,3.5vw,36px)]
              py-[clamp(8px,1.3vw,13px)]
              text-[clamp(8px,1.15vw,10px)]
              font-bold uppercase tracking-[clamp(0.11em,0.25vw,0.2em)]
              text-[#460e07]
              shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
              transition duration-300 hover:-translate-y-[1px]
              md:mx-0
            "
            style={{ backgroundImage: "url('/cardDuvar.png')" }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
            <span className="pointer-events-none absolute inset-[4px] rounded-[2px] border border-[#e0c896]/60" />

            <span className="relative z-10 whitespace-nowrap">
              {slide.buttonText || "Keşfet ve Satın Al"}
            </span>
          </a>
        </div>
      </div>

      {/* FEATURED */}
      {!!featuredCards.length && (
        <div
          className="
            relative z-10 w-full shrink-0
            -mt-2 pb-[clamp(20px,4vw,36px)]

            md:-mt-6
            md:px-[clamp(16px,3vw,34px)]

            lg:-mt-10
            lg:px-0

            xl:-mt-14
            2xl:-mt-16
          "
        >
          <div
            className="
              w-full
              md:mx-auto md:max-w-[860px]
              lg:mx-0 lg:max-w-none lg:pl-[25%] lg:pr-[clamp(24px,4vw,70px)]
              xl:pl-[35%]
              2xl:pl-[35%] 2xl:pr-[clamp(46px,4.5vw,96px)]
            "
          >
            <h2 className="mb-2 px-8 font-serif text-[clamp(19px,4vw,28px)] leading-none text-[#351509] md:px-0 md:text-[clamp(20px,2.4vw,27px)] lg:text-[clamp(18px,1.45vw,24px)] xl:text-[clamp(20px,1.55vw,27px)]">
              Günün Öne Çıkanları
            </h2>

            <div className="w-full overflow-x-auto overflow-y-hidden px-8 pb-3 md:overflow-visible md:px-0">
              <div className="flex w-max min-w-full gap-4 md:grid md:w-full md:min-w-0 md:grid-cols-2 md:gap-x-3 md:gap-y-4 lg:flex lg:w-fit lg:min-w-0 lg:gap-8 xl:gap-16 2xl:gap-16">
                {featuredCards.map((card, index) => (
                  <a
                    key={card.id}
                    href="/products"
                    className="
                      group relative flex shrink-0 flex-col items-center
                      w-[66vw] max-w-[245px] px-3 pb-4 pt-2
                      sm:w-[50vw] sm:max-w-[265px]
                      md:w-auto md:max-w-none md:min-w-0 md:px-3
                      lg:w-[clamp(150px,10vw,190px)] lg:flex-none lg:px-1.5
                      xl:w-[clamp(165px,10vw,215px)]
                      2xl:w-[232px]
                    "
                  >
                    {index !== 0 && (
                      <span className="absolute left-0 top-[16%] hidden h-[68%] w-px bg-[#d8bf8a]/80 lg:block" />
                    )}

                    <h3
                      title={card.title}
                      className="
                        line-clamp-2 max-w-full text-center
                        font-serif leading-none text-[#2d1208]
                        text-[clamp(24px,5.5vw,31px)]
                        md:text-[clamp(22px,3.2vw,30px)]
                        lg:text-[clamp(20px,1.45vw,26px)]
                        xl:text-[clamp(22px,1.5vw,30px)]
                      "
                    >
                      {card.title}
                    </h3>

                    <div className="relative mt-1.5 w-full h-[clamp(122px,32vw,160px)] md:h-[clamp(112px,13vw,138px)] lg:h-[clamp(95px,7vw,118px)] xl:h-[clamp(104px,7.4vw,132px)]">
                      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[112%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,246,0.95)_0%,rgba(255,247,224,0.70)_32%,rgba(245,224,178,0.28)_58%,rgba(232,202,145,0.08)_74%,transparent_88%)] blur-[24px] opacity-95 transition duration-300 group-hover:scale-110" />

                      <div className="pointer-events-none absolute left-1/2 top-[50%] z-0 h-[76%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,250,0.96)_0%,rgba(255,249,230,0.66)_42%,rgba(247,232,195,0.14)_70%,transparent_88%)] blur-[10px]" />

                      <div className="pointer-events-none absolute left-1/2 top-[72%] z-0 h-[24%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,78,36,0.07)_0%,rgba(116,78,36,0.035)_40%,transparent_72%)] blur-[12px]" />

                      <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        sizes="(max-width:768px) 66vw, 230px"
                        className="relative z-10 object-contain scale-[1.02] drop-shadow-[0_16px_20px_rgba(60,34,16,0.16)] transition duration-300 group-hover:-translate-y-1 group-hover:scale-[1.08]"
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
                      KEŞFET
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 md:hidden">
              {featuredCards.map((_, index) => (
                <span
                  key={index}
                  className={
                    index === 0
                      ? "block h-[6px] w-[34px] rounded-full bg-[#b88a55]"
                      : "block h-[6px] w-[6px] rounded-full bg-[#c9aa7e]"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

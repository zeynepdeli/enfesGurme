"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

import { FaqBackground } from "@/components/shop/faq/faq-background";
import { FaqHero } from "@/components/shop/faq/faq-hero";
import { FaqCategories } from "@/components/shop/faq/faq-categories";
import { FaqCard } from "@/components/shop/faq/faq-card";
import { FaqCTA } from "@/components/shop/faq/faq-cta";

export type FaqSettings = {
  backgroundColor: string;
  backgroundImage: string;
  cardBgImage: string;
  textureImage: string;
  title: string;
  subtitle?: string;
  contactTitle: string;
  buttonText: string;
  buttonLink: string;
};

export type FaqCategory = {
  id: number;
  name: string;
  order: number;
  isActive?: boolean;
};

export type FaqItem = {
  id: number;
  categoryId?: number | null;
  question: string;
  answer: string;
  topIcon?: string | null;
  bottomIcon?: string | null;
  order: number;
  isActive?: boolean;
};

type FaqResponse = {
  settings: FaqSettings | null;
  categories: FaqCategory[];
  items: FaqItem[];
};

const DEFAULT_SETTINGS: FaqSettings = {
  backgroundColor: "#efe3cc",
  backgroundImage: "/duvarBg.png",
  cardBgImage: "/cardDuvar.png",
  textureImage: "/bkrr.png",
  title: "SIKÇA SORULAN SORULAR",
  subtitle: "Merak ettiğiniz tüm soruların cevaplarını burada bulabilirsiniz.",
  contactTitle: "Hala Sorunuz Mu Var?",
  buttonText: "Bize Yazın",
  buttonLink: "/contact",
};

const FAQ_LAYOUT = {
  main: "relative min-h-[90svh] overflow-hidden",

  section: `
    relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1540px]
    flex-col px-4 pb-4 pt-[78px]

    min-[445px]:px-5 min-[445px]:pt-[82px]

    sm:px-6 sm:pt-[86px]

    md:px-8 md:pt-[138px]

    lg:px-10 lg:pt-[140px]

    xl:px-12 xl:pt-[150px] xl:pb-4

    2xl:px-6 2xl:pt-[170px]
  `,

  heroWrap: `
    shrink-0
    [&_h1]:!text-[30px]
    [&_h1]:!leading-none

    min-[445px]:[&_h1]:!text-[32px]

    md:[&_h1]:!text-[36px]

    lg:[&_h1]:!text-[38px]

    xl:[&_h1]:!text-[40px]

    2xl:[&_h1]:!text-[52px]

    [&_p]:!text-[12px]
    md:[&_p]:!text-[13px]
    xl:[&_p]:!text-[14px]
    2xl:[&_p]:!text-[16px]
  `,

  categoriesWrap: `
    shrink-0
    -mt-1
    md:-mt-2
    lg:-mt-3
    xl:-mt-2

    [&_button]:!text-[10px]
    md:[&_button]:!text-[11px]
    xl:[&_button]:!text-[11px]
    2xl:[&_button]:!text-[12px]
  `,

  grid: `
    mx-auto grid w-full max-w-[1080px] grid-cols-1
    gap-3 pt-3

    min-[445px]:gap-3

    md:grid-cols-2 md:gap-3 md:pt-4

    lg:max-w-[1060px] lg:grid-cols-3 lg:gap-3

    xl:max-w-[1100px] xl:grid-cols-4 xl:gap-3 xl:pt-3

    2xl:max-w-[1240px] 2xl:gap-5
  `,

  cardWrap: `
    min-w-0

    [&_h3]:!text-[14px]
    [&_h3]:!leading-snug

    md:[&_h3]:!text-[14px]

    lg:[&_h3]:!text-[14px]

    xl:[&_h3]:!text-[14px]

    2xl:[&_h3]:!text-[17px]

    [&_p]:!text-[11px]
    [&_p]:!leading-relaxed

    md:[&_p]:!text-[11px]

    lg:[&_p]:!text-[11px]

    xl:[&_p]:!text-[11px]

    2xl:[&_p]:!text-[13px]

    [&>a]:!min-h-0
  `,

  ctaWrap: `
    shrink-0 pt-3
    md:pt-4
    xl:pt-4

    [&_h2]:!text-[20px]
    md:[&_h2]:!text-[22px]
    xl:[&_h2]:!text-[22px]
    2xl:[&_h2]:!text-[28px]

    [&_a]:!text-[10px]
    md:[&_a]:!text-[11px]
    xl:[&_a]:!text-[11px]
  `,
};

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["faq-page"],
    queryFn: async () => {
      const res = await api.get<FaqResponse>("/api/faq-page");

      if (!res.data) {
        throw new Error("SSS verisi bulunamadı.");
      }

      return res.data;
    },
  });

  const settings = useMemo<FaqSettings>(() => {
    return {
      ...DEFAULT_SETTINGS,
      ...(data?.settings ?? {}),
    };
  }, [data?.settings]);

  const categories = useMemo(() => {
    return (data?.categories ?? [])
      .filter((category) => category.isActive !== false)
      .sort((a, b) => a.order - b.order);
  }, [data?.categories]);

  const items = useMemo(() => {
    return (data?.items ?? [])
      .filter((item) => item.isActive !== false)
      .sort((a, b) => a.order - b.order);
  }, [data?.items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === null) return items;
    return items.filter((item) => item.categoryId === activeCategory);
  }, [items, activeCategory]);

  if (isLoading) {
    return (
      <LoadingSpinner text="Sıkça sorulan sorular hazırlanıyor..." fullScreen />
    );
  }

  if (error || !data) {
    return (
      <div className="py-28 text-center sm:py-32 lg:py-36 ">
        <ErrorMessage message="SSS sayfası yüklenemedi." />
      </div>
    );
  }

  return (
    <main
      className={FAQ_LAYOUT.main}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <FaqBackground settings={settings} />

      <section className={FAQ_LAYOUT.section}>
        <div className={FAQ_LAYOUT.heroWrap}>
          <FaqHero settings={settings} />
        </div>

        <div className={FAQ_LAYOUT.categoriesWrap}>
          <FaqCategories
            categories={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            cardBgImage={settings.cardBgImage}
          />
        </div>

        <FaqGrid items={filteredItems} settings={settings} />

        <div className={FAQ_LAYOUT.ctaWrap}>
          <FaqCTA settings={settings} />
        </div>
      </section>
    </main>
  );
}

function FaqGrid({
  items,
  settings,
}: {
  items: FaqItem[];
  settings: FaqSettings;
}) {
  if (!items.length) {
    return (
      <div className="mx-auto mt-5 max-w-[580px] rounded-3xl border border-dashed border-[#3d3020]/10 bg-[#efe6d6]/40 px-5 py-8 text-center">
        <p className="font-serif text-[18px] font-bold text-[#351509] md:text-[20px]">
          Bu kategoride henüz soru bulunmuyor.
        </p>

        <p className="mt-2 text-xs leading-relaxed text-[#5e4734] md:text-sm">
          Farklı bir kategori seçerek diğer sıkça sorulan sorulara göz
          atabilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className={FAQ_LAYOUT.grid}>
      {items.map((faq) => (
        <div key={faq.id} className={FAQ_LAYOUT.cardWrap}>
          <FaqCard
            faq={faq}
            cardBgImage={settings.cardBgImage}
            textureImage={settings.textureImage}
          />
        </div>
      ))}
    </div>
  );
}

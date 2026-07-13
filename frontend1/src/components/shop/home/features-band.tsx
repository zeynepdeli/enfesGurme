"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Gift,
  Heart,
  Leaf,
  Package,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";

import { api } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";

type FeatureItem = {
  id: number;
  icon: string;
  title: string;
  order: number;
  isActive: boolean;
};

type FeatureSectionData = {
  title: string;
  description: string;
  backgroundImage: string;
  cardTexture: string;
  items: FeatureItem[];
};

type FeatureVariant =
  | "mobile"
  | "xsMobile"
  | "tablet"
  | "desktop"
  | "xl"
  | "xxl";

type FeatureSize = {
  cardW: number;
  cardH: number;
  icon: number;
  number: number;
  title: number;
  px: number;
};

const FALLBACKS = {
  bg: "/duvarBg.png",
  texture: "/cardDuvar.png",
};

const FEATURE_SIZES: Record<FeatureVariant, FeatureSize> = {
  mobile: {
    cardW: 340,
    cardH: 340,
    icon: 50,
    number: 23,
    title: 24,
    px: 22,
  },

  xsMobile: {
    cardW: 340,
    cardH: 360,
    icon: 50,
    number: 23,
    title: 25,
    px: 22,
  },

  tablet: {
    cardW: 320,
    cardH: 320,
    icon: 48,
    number: 15,
    title: 23,
    px: 24,
  },

  desktop: {
    cardW: 190,
    cardH: 240,
    icon: 36,
    number: 13,
    title: 13,
    px: 16,
  },

  xl: {
    cardW: 220,
    cardH: 270,
    icon: 42,
    number: 14,
    title: 15,
    px: 18,
  },

  xxl: {
    cardW: 255,
    cardH: 320,
    icon: 48,
    number: 16,
    title: 18,
    px: 20,
  },
};

const ICON_MAP = {
  leaf: Leaf,
  award: Award,
  shield: ShieldCheck,
  truck: Truck,
  star: Star,
  gift: Gift,
  heart: Heart,
  package: Package,
};

function getFeatureIcon(icon: string) {
  return ICON_MAP[icon as keyof typeof ICON_MAP] || Leaf;
}

export function FeaturesBand() {
  const { data, isLoading } = useQuery({
    queryKey: ["features-section"],
    queryFn: async () => {
      const res = await api.get<FeatureSectionData>("/api/features-section");
      return res.data;
    },
  });

  const section = data;

  const features =
    data?.items
      ?.filter((item) => item.isActive)
      .sort((a, b) => a.order - b.order) || [];

  if (isLoading || !section || features.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-12 min-[445px]:py-14 md:py-16 lg:py-20 xl:py-24 2xl:py-28">
      <SectionBackground section={section} />

      <div className="relative z-10 mx-auto w-full max-w-[2200px] px-4 min-[445px]:px-5 md:px-6 lg:px-8 xl:px-10 2xl:px-16">
        <div className="flex flex-col items-center gap-9 md:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:gap-12 2xl:gap-16">
          <SectionIntro section={section} />

          <FeatureGrid features={features} texture={section.cardTexture} />
        </div>
      </div>
    </section>
  );
}

function SectionBackground({ section }: { section: FeatureSectionData }) {
  return (
    <>
      <Image
        src={section.backgroundImage || FALLBACKS.bg}
        alt=""
        fill
        className="absolute inset-0 object-cover"
      />

      <div className="absolute inset-0 bg-[#f3ead7]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,239,221,0.80)_0%,rgba(243,234,215,0.60)_40%,rgba(230,218,190,0.40)_70%,rgba(210,195,160,0.20)_100%)]" />
    </>
  );
}

function SectionIntro({ section }: { section: FeatureSectionData }) {
  return (
    <div className="w-full text-center lg:w-[32%] lg:text-left xl:w-[30%] 2xl:w-[28%]">
      <h2 className="font-[family-name:var(--font-merienda)] text-[34px] font-bold leading-tight text-[#460d07] min-[445px]:text-[40px] md:text-[46px] lg:text-[48px] xl:text-[56px] 2xl:text-[68px]">
        {section.title || "ANTEP'İN BEREKETİ"}
      </h2>

      <p className="mx-auto mt-4 max-w-[560px] text-[14px] leading-relaxed text-[#4d3725] min-[445px]:text-[15px] md:text-[16px] lg:mx-0 lg:max-w-[420px] lg:text-[15px] xl:max-w-[500px] xl:text-[16px] 2xl:max-w-[620px] 2xl:text-[18px]">
        {section.description ||
          "Gaziantep'in binlerce yıllık köklü mutfak mirasını, geleneksel yöntemlerle ve el emeğiyle modern sofralara taşıyoruz."}
      </p>
    </div>
  );
}

function FeatureGrid({
  features,
  texture,
}: {
  features: FeatureItem[];
  texture?: string;
}) {
  return (
    <div className="flex w-full justify-center lg:w-[68%] lg:justify-end xl:w-[70%] 2xl:w-[72%]">
      <div className="grid w-full grid-cols-1 place-items-center gap-5 min-[445px]:gap-6 md:hidden">
        {features.map((feature, index) => (
          <ResponsiveMobileFeatureCard
            key={feature.id}
            feature={feature}
            index={index}
            texture={texture}
          />
        ))}
      </div>

      <div className="hidden w-full grid-cols-2 place-items-center gap-x-6 gap-y-8 md:grid lg:hidden">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            index={index}
            title={feature.title}
            icon={feature.icon}
            variant="tablet"
            texture={texture}
          />
        ))}
      </div>

      <div className="hidden w-full grid-cols-4 place-items-center gap-4 lg:grid xl:hidden">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            index={index}
            title={feature.title}
            icon={feature.icon}
            variant="desktop"
            texture={texture}
          />
        ))}
      </div>

      <div className="hidden w-full grid-cols-4 place-items-center gap-6 xl:grid 2xl:hidden">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            index={index}
            title={feature.title}
            icon={feature.icon}
            variant="xl"
            texture={texture}
          />
        ))}
      </div>

      <div className="hidden w-full grid-cols-4 place-items-center gap-8 2xl:grid">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            index={index}
            title={feature.title}
            icon={feature.icon}
            variant="xxl"
            texture={texture}
          />
        ))}
      </div>
    </div>
  );
}

function ResponsiveMobileFeatureCard({
  feature,
  index,
  texture,
}: {
  feature: FeatureItem;
  index: number;
  texture?: string;
}) {
  return (
    <>
      <div className="block min-[445px]:hidden">
        <FeatureCard
          index={index}
          title={feature.title}
          icon={feature.icon}
          variant="mobile"
          texture={texture}
        />
      </div>

      <div className="hidden min-[445px]:block">
        <FeatureCard
          index={index}
          title={feature.title}
          icon={feature.icon}
          variant="xsMobile"
          texture={texture}
        />
      </div>
    </>
  );
}

function FeatureCard({
  index,
  title,
  icon,
  variant,
  texture,
}: {
  index: number;
  title: string;
  icon: string;
  variant: FeatureVariant;
  texture?: string;
}) {
  const Icon = getFeatureIcon(icon);
  const size = FEATURE_SIZES[variant];

  return (
    <div className="flex-none transition-all duration-500 hover:-translate-y-1">
      <ProductCard
        embossed
        wallTexture={texture || FALLBACKS.texture}
        clickable={false}
        showImage={false}
        showButton={false}
        showDescription={false}
        showPrice={false}
        card={{
          w: size.cardW,
          h: size.cardH,
        }}
        style={{
          width: size.cardW,
          height: size.cardH,
        }}
        content={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          align: "center",
          className: "justify-center",
        }}
        product={{
          name: title,
          description: "",
          price: 0,
          slug: "",
          images: [],
        }}
      >
        <div
          className="mb-3 font-semibold tracking-[0.18em] text-[#c9a96e]"
          style={{
            fontSize: size.number,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <Icon
          strokeWidth={1.2}
          className="mb-4 text-[#3a2e1e]"
          style={{
            width: size.icon,
            height: size.icon,
          }}
        />

        <h3
          className="text-center font-serif uppercase leading-snug tracking-[0.14em] text-[#2d1b10]"
          style={{
            fontSize: size.title,
            paddingInline: size.px,
          }}
        >
          {title}
        </h3>
      </ProductCard>
    </div>
  );
}

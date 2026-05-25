"use client";

import { Leaf, Award, Truck, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";

const FEATURES = [
  { icon: Leaf, title: "Doğal & Saf" },
  { icon: Award, title: "Yöresel Üreticiden" },
  { icon: ShieldCheck, title: "Kalite Güvencesi" },
  { icon: Truck, title: "Hızlı Teslimat" },
];

export function FeaturesBand() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28">
      {/* BG */}
      <img
        src="/duvarBg.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#f3ead7]/40" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(246,239,221,0.80)_0%,rgba(243,234,215,0.60)_40%,rgba(230,218,190,0.40)_70%,rgba(210,195,160,0.20)_100%)]" />

      {/* CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-[2200px] px-3 sm:px-4 md:px-5 lg:px-6 xl:px-10 2xl:px-16">
        <div
          className="
            flex flex-col items-center
            gap-8

            md:gap-10

            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-8

            xl:gap-12
            2xl:gap-16
          "
        >
          {/* LEFT */}
          <div
            className="
              w-full text-center

              lg:w-[32%]
              lg:text-left

              xl:w-[30%]

              2xl:w-[28%]
            "
          >
            <h2
              className="
                font-serif leading-tight text-[#460d07]

                text-[26px]

                sm:text-[32px]

                md:text-[42px]

                lg:text-[48px]

                xl:text-[56px]

                2xl:text-[68px]
              "
            >
              ANTEP&apos;İN BEREKETİ
            </h2>

            <p
              className="
                mx-auto mt-4
                max-w-[520px]
                leading-relaxed text-[#4d3725]

                text-[13px]

                sm:text-[14px]

                md:text-[15px]

                lg:mx-0
                lg:max-w-[420px]

                xl:max-w-[500px]
                xl:text-[16px]

                2xl:max-w-[620px]
                2xl:text-[18px]
              "
            >
              Gaziantep&apos;in binlerce yıllık köklü mutfak mirasını,
              geleneksel yöntemlerle ve el emeğiyle modern sofralara taşıyoruz.
            </p>
          </div>

          {/* RIGHT */}
          <div
            className="
              flex w-full justify-center

              lg:w-[68%]
              lg:justify-end

              xl:w-[70%]

              2xl:w-[72%]
            "
          >
            {/* MOBILE */}
            <div className="grid w-full grid-cols-2 place-items-center gap-3 sm:gap-4 md:hidden">
              {FEATURES.map((feature, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  title={feature.title}
                  Icon={feature.icon}
                  variant="mobile"
                />
              ))}
            </div>

            {/* TABLET */}
            <div className="hidden w-full grid-cols-4 place-items-center gap-4 md:grid lg:hidden">
              {FEATURES.map((feature, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  title={feature.title}
                  Icon={feature.icon}
                  variant="tablet"
                />
              ))}
            </div>

            {/* DESKTOP */}
            <div className="hidden w-full grid-cols-4 place-items-center gap-4 lg:grid xl:hidden">
              {FEATURES.map((feature, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  title={feature.title}
                  Icon={feature.icon}
                  variant="desktop"
                />
              ))}
            </div>

            {/* XL */}
            <div className="hidden w-full grid-cols-4 place-items-center gap-6 xl:grid 2xl:hidden">
              {FEATURES.map((feature, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  title={feature.title}
                  Icon={feature.icon}
                  variant="xl"
                />
              ))}
            </div>

            {/* XXL */}
            <div className="hidden w-full grid-cols-4 place-items-center gap-8 2xl:grid">
              {FEATURES.map((feature, i) => (
                <FeatureCard
                  key={i}
                  index={i}
                  title={feature.title}
                  Icon={feature.icon}
                  variant="xxl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  index,
  title,
  Icon,
  variant,
}: {
  index: number;
  title: string;
  Icon: React.ElementType;
  variant: "mobile" | "tablet" | "desktop" | "xl" | "xxl";
}) {
  const sizes = {
    mobile: {
      cardW: 192,
      cardH: 240,

      icon: 28,
      number: 11,
      title: 11,

      px: 14,
    },

    tablet: {
      cardW: 170,
      cardH: 210,

      icon: 32,
      number: 12,
      title: 12,

      px: 14,
    },

    desktop: {
      cardW: 190,
      cardH: 235,

      icon: 36,
      number: 13,
      title: 13,

      px: 16,
    },

    xl: {
      cardW: 220,
      cardH: 270,

      icon: 40,
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

  const current = sizes[variant];

  return (
    <div className="transition-all duration-500 hover:-translate-y-1">
      <ProductCard
        embossed
        wallTexture="/cardDuvar.png"
        clickable={false}
        showImage={false}
        showButton={false}
        showDescription={false}
        showPrice={false}
        card={{
          w: current.cardW,
          h: current.cardH,
        }}
        style={{
          width: current.cardW,
          height: current.cardH,
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
            fontSize: current.number,
          }}
        >
          0{index + 1}
        </div>

        <Icon
          strokeWidth={1.2}
          className="mb-4 text-[#3a2e1e]"
          style={{
            width: current.icon,
            height: current.icon,
          }}
        />

        <h3
          className="
            text-center
            font-serif uppercase
            leading-snug tracking-[0.14em]
            text-[#2d1b10]
          "
          style={{
            fontSize: current.title,
            paddingInline: current.px,
          }}
        >
          {title}
        </h3>
      </ProductCard>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/lib/api";
import { BestsellerCard } from "@/types";
import { ProductCard } from "@/components/products/product-card";

const PLATE_IMAGE = "/bakırPlate.png";

type Variant = "mobile" | "tablet" | "desktop" | "xlDesktop" | "xxlDesktop";

export function FeaturedBand() {
  const { data: products } = useQuery({
    queryKey: ["bestseller-cards"],
    queryFn: async () => {
      const res = await api.get<BestsellerCard[]>("/api/bestseller-cards");
      return res.data || [];
    },
  });

  if (!products?.length) return null;

  return (
    <section className="relative z-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/duvarBg.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(246,239,221,0.70)_5%,rgba(246,239,221,0.45)_30%,rgba(246,239,221,0.20)_45%,transparent_90%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(246,239,221,0.8)_35%,rgba(246,239,221,0.8)_45%,rgba(246,239,221,0.1)_100%)]" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col items-center pb-[24px] pt-[44px] md:pb-[32px] md:pt-[60px] 2xl:pt-8">
          <div className="relative">
            <div
              className="
                relative z-10 overflow-hidden rounded-[4px]
                border border-[#d8bf8a]
                bg-cover bg-center
                px-[28px] py-[9px]
                font-serif text-[15px]
                uppercase tracking-[0.1em]
                shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
                md:px-[52px] md:py-[12px]
                md:text-[24px]
              "
              style={{ backgroundImage: "url('/cardDuvar.png')" }}
            >
              <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
              <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,transparent_45%)]" />
              <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-[2px] border border-[#e0c896]/60" />

              <span className="relative z-10 font-bold text-[#460e07]">
                EN ÇOK SATANLAR
              </span>
            </div>

            <div className="absolute -bottom-1 -right-1 h-full w-full rounded-sm bg-[#3d3020]/20" />
          </div>

          <div className="mt-4 h-px w-24 bg-[#5c4a28]/30" />
        </div>

        <div className="mx-auto -mt-8 w-full max-w-[2240px] overflow-hidden px-3 pb-[64px] sm:px-4 md:px-6 lg:px-8 xl:px-16 2xl:px-28">
          <div className="grid w-full grid-cols-2 place-items-center gap-x-2 gap-y-4 md:flex md:items-start md:justify-center md:gap-12 lg:gap-14 xl:gap-20 2xl:gap-32">
            {products.map((product) => (
              <div key={product.id} className="min-w-0 shrink">
                <div className="block md:hidden">
                  <ProductItem product={product} variant="mobile" />
                </div>

                <div className="hidden md:block lg:hidden">
                  <ProductItem product={product} variant="tablet" />
                </div>

                <div className="hidden lg:block xl:hidden">
                  <ProductItem product={product} variant="desktop" />
                </div>

                <div className="hidden xl:block 2xl:hidden">
                  <ProductItem product={product} variant="xlDesktop" />
                </div>

                <div className="hidden 2xl:block">
                  <ProductItem product={product} variant="xxlDesktop" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductItem({
  product,
  variant,
}: {
  product: BestsellerCard;
  variant: Variant;
}) {
  const sizes = {
    mobile: {
      itemW: 145,
      itemH: 226,

      imageW: 148,
      imageTop: 50,

      plateW: 180,
      plateTop: 90,
      plateScaleX: 1.26,
      plateScaleY: 1,

      cardW: 149,
      cardH: 106,
      cardTop: 118,

      contentTop: 40,
      titleSize: 9,
      priceSize: 10,
      buttonSize: 6,
      buttonPx: 8,
      buttonPy: 2,
      buttonMt: 4,
      priceMt: 2,
    },

    tablet: {
      itemW: 160,
      itemH: 238,

      imageW: 178,
      imageTop: 28,

      plateW: 198,
      plateTop: 85,
      plateScaleX: 1.38,
      plateScaleY: 1,

      cardW: 178,
      cardH: 104,
      cardTop: 128,

      contentTop: 34,
      titleSize: 10,
      priceSize: 11,
      buttonSize: 7,
      buttonPx: 10,
      buttonPy: 3,
      buttonMt: 8,
      priceMt: 0,
    },

    desktop: {
      itemW: 172,
      itemH: 252,

      imageW: 210,
      imageTop: 19,

      plateW: 220,
      plateTop: 94,
      plateScaleX: 1.45,
      plateScaleY: 1,

      cardW: 212,
      cardH: 104,
      cardTop: 166,

      contentTop: 24,
      titleSize: 13,
      priceSize: 13,
      buttonSize: 8,
      buttonPx: 10,
      buttonPy: 3,
      buttonMt: 8,
      priceMt: 0,
    },

    xlDesktop: {
      itemW: 190,
      itemH: 278,

      imageW: 238,
      imageTop: 20,

      plateW: 245,
      plateTop: 104,
      plateScaleX: 1.47,
      plateScaleY: 1,

      cardW: 238,
      cardH: 114,
      cardTop: 184,

      contentTop: 26,
      titleSize: 15,
      priceSize: 14,
      buttonSize: 9,
      buttonPx: 11,
      buttonPy: 4,
      buttonMt: 8,
      priceMt: 0,
    },

    xxlDesktop: {
      itemW: 210,
      itemH: 306,

      imageW: 270,
      imageTop: 22,

      plateW: 280,
      plateTop: 116,
      plateScaleX: 1.45,
      plateScaleY: 1,

      cardW: 270,
      cardH: 122,
      cardTop: 204,

      contentTop: 28,
      titleSize: 18,
      priceSize: 16,
      buttonSize: 10,
      buttonPx: 12,
      buttonPy: 4,
      buttonMt: 8,
      priceMt: 0,
    },
  };

  const current = sizes[variant];

  return (
    <div
      className="group relative shrink-0 transition-all duration-300 lg:hover:-translate-y-1"
      style={{
        width: current.itemW,
        height: current.itemH,
      }}
    >
      {product.imageUrl && (
        <div
          className="pointer-events-none absolute left-1/2 z-50 overflow-hidden rounded-t-[14px] -translate-x-1/2"
          style={{
            width: current.imageW,
            top: current.imageTop,
          }}
        >
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={current.imageW}
            height={current.imageW}
            className="h-auto w-full rounded-t-[14px] object-contain transition-all duration-500 ease-out group-hover:scale-105"
            style={{
              filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.24))",
            }}
          />
        </div>
      )}

      <div
        className="pointer-events-none absolute left-1/2 z-40"
        style={{
          width: current.plateW,
          top: current.plateTop,
          transform: `translateX(-50%) scale(${current.plateScaleX}, ${current.plateScaleY})`,
          transformOrigin: "center center",
        }}
      >
        <Image
          src={PLATE_IMAGE}
          alt=""
          width={current.plateW}
          height={current.plateW * 0.53}
          className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            transform: "perspective(500px) rotateX(70deg)",
            transformOrigin: "center center",
            filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))",
          }}
        />
      </div>

      <div
        className="absolute left-1/2 z-10 -translate-x-1/2"
        style={{
          width: current.cardW,
          top: current.cardTop,
        }}
      >
        <ProductCard
          embossed
          wallTexture="/cardDuvar.png"
          href={`/products/${product.slug}`}
          showImage={false}
          showDescription={false}
          showPrice={false}
          showButton={false}
          card={{
            w: current.cardW,
            h: current.cardH,
          }}
          style={{
            overflow: "visible",
          }}
          content={{
            top: current.contentTop,
            left: 6,
            right: 6,
            bottom: 6,
            align: "center",
          }}
          product={{
            name: product.title,
            description: "",
            price: product.price,
            slug: product.slug,
            images: product.imageUrl
              ? [{ url: product.imageUrl, alt: product.title }]
              : [],
          }}
        >
          <span
            className="line-clamp-2 mt-2 text-center font-serif font-bold leading-snug tracking-wide text-[#2c1a0e]"
            style={{
              fontSize: current.titleSize,
            }}
          >
            {product.title}
          </span>

          <span
            className="block -mt-1  font-extrabold text-[#7a3b1e]"
            style={{
              fontSize: current.priceSize,
              marginTop: current.priceMt,
            }}
          >
            ₺{product.price}
          </span>

          <div
            className="rounded-full border-2 border-transparent font-bold uppercase tracking-[0.14em] text-[#e8dcc0]"
            style={{
              marginTop: current.buttonMt,
              fontSize: current.buttonSize,
              paddingInline: current.buttonPx,
              paddingBlock: current.buttonPy,
              backgroundImage: `
                linear-gradient(#524528, #524528),
                linear-gradient(
                  to right,
                  #6b3f18,
                  #c8893a,
                  #e8b060,
                  #c8893a,
                  #6b3f18
                )
              `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow:
                "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            Sepete Ekle
          </div>
        </ProductCard>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/lib/api";
import { BestsellerCard } from "@/types";
import { ProductCard } from "@/components/products/product-card";

type Variant =
  | "mobile"
  | "xsMobile"
  | "tablet"
  | "desktop"
  | "xlDesktop"
  | "xxlDesktop";

type BestsellerSection = {
  title: string;
  backgroundImage: string;
  buttonBackgroundImage: string;
  plateImage: string;
  addToCartText: string;
};

type ProductSize = {
  itemW: number;
  itemH: number;
  imageW: number;
  imageTop: number;
  plateW: number;
  plateTop: number;
  plateScaleX: number;
  plateScaleY: number;
  cardW: number;
  cardH: number;
  cardTop: number;
  contentTop: number;
  titleSize: number;
  titleMinH: number;
  priceSize: number;
  buttonSize: number;
  buttonPx: number;
  buttonPy: number;
  buttonMt: number;
  priceMt: number;
};

const FALLBACKS = {
  sectionBg: "/duvarBg.png",
  cardTexture: "/cardDuvar.png",
  plate: "/bakırPlate.png",
};

const PRODUCT_SIZES: Record<Variant, ProductSize> = {
  mobile: {
    itemW: 510,
    itemH: 420,
    imageW: 360,
    imageTop: 20,
    plateW: 345,
    plateTop: 155,
    plateScaleX: 1.6,
    plateScaleY: 1,
    cardW: 362,
    cardH: 230,
    cardTop: 194,
    contentTop: 94,
    titleSize: 24,
    titleMinH: 34,
    priceSize: 24,
    buttonSize: 16,
    buttonPx: 12,
    buttonPy: 4,
    buttonMt: 2,
    priceMt: 3,
  },

  xsMobile: {
    itemW: 540,
    itemH: 482,
    imageW: 438,
    imageTop: 0,
    plateW: 378,
    plateTop: 180,
    plateScaleX: 1.72,
    plateScaleY: 1,
    cardW: 438,
    cardH: 256,
    cardTop: 214,
    contentTop: 115,
    titleSize: 24,
    titleMinH: 38,
    priceSize: 24,
    buttonSize: 16,
    buttonPx: 13,
    buttonPy: 4,
    buttonMt: 7,
    priceMt: 3,
  },

  tablet: {
    itemW: 370,
    itemH: 410,
    imageW: 386,
    imageTop: 0,
    plateW: 386,
    plateTop: 140,
    plateScaleX: 1.52,
    plateScaleY: 1,
    cardW: 388,
    cardH: 196,
    cardTop: 232,
    contentTop: 60,
    titleSize: 24,
    titleMinH: 38,
    priceSize: 24,
    buttonSize: 16,
    buttonPx: 14,
    buttonPy: 5,
    buttonMt: 2,
    priceMt: 1,
  },

  desktop: {
    itemW: 230,
    itemH: 326,
    imageW: 228,
    imageTop: 32,
    plateW: 230,
    plateTop: 116,
    plateScaleX: 1.5,
    plateScaleY: 1,
    cardW: 230,
    cardH: 138,
    cardTop: 190,
    contentTop: 18,
    titleSize: 24,
    titleMinH: 34,
    priceSize: 20,
    buttonSize: 14,
    buttonPx: 11,
    buttonPy: 4,
    buttonMt: 0,
    priceMt: 2,
  },

  xlDesktop: {
    itemW: 270,
    itemH: 352,
    imageW: 262,
    imageTop: 30,
    plateW: 273,
    plateTop: 122,
    plateScaleX: 1.46,
    plateScaleY: 1,
    cardW: 260,
    cardH: 148,
    cardTop: 204,
    contentTop: 24,
    titleSize: 24,
    titleMinH: 20,
    priceSize: 20,
    buttonSize: 14,
    buttonPx: 12,
    buttonPy: 4,
    buttonMt: 2,
    priceMt: 6,
  },

  xxlDesktop: {
    itemW: 310,
    itemH: 392,
    imageW: 300,
    imageTop: 22,
    plateW: 310,
    plateTop: 130,
    plateScaleX: 1.45,
    plateScaleY: 1,
    cardW: 298,
    cardH: 164,
    cardTop: 228,
    contentTop: 26,
    titleSize: 26,
    titleMinH: 20,
    priceSize: 24,
    buttonSize: 16,
    buttonPx: 13,
    buttonPy: 5,
    buttonMt: 4,
    priceMt: 6,
  },
};

export function FeaturedBand() {
  const { data } = useQuery({
    queryKey: ["bestseller-band"],
    queryFn: async () => {
      const [productsRes, sectionRes] = await Promise.all([
        api.get<BestsellerCard[]>("/api/bestseller-cards"),
        api.get<BestsellerSection>("/api/bestseller-section"),
      ]);

      return {
        products: productsRes.data || [],
        section: sectionRes.data || null,
      };
    },
  });

  const products = data?.products || [];
  const section = data?.section;

  if (!products.length || !section) return null;

  return (
    <section className="relative z-20 overflow-hidden">
      <SectionBackground section={section} />

      <div className="relative z-10">
        <SectionTitle section={section} />

        <div className="mx-auto -mt-4 w-full max-w-[2240px] overflow-hidden px-2 pb-16 min-[445px]:px-3 md:px-4 lg:-mt-8 lg:px-4 xl:px-8 2xl:px-16">
          <div className="grid w-full grid-cols-1 place-items-center gap-y-8 min-[445px]:gap-y-10 md:grid-cols-2 md:gap-x-4 md:gap-y-10 lg:flex lg:items-start lg:justify-center lg:gap-2 xl:gap-[12px] 2xl:gap-20">
            {products.map((product) => (
              <div key={product.id} className="flex-none">
                <ResponsiveProduct product={product} section={section} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResponsiveProduct({
  product,
  section,
}: {
  product: BestsellerCard;
  section: BestsellerSection;
}) {
  return (
    <>
      <div className="block min-[445px]:hidden">
        <ProductItem product={product} variant="mobile" section={section} />
      </div>

      <div className="hidden min-[445px]:block md:hidden">
        <ProductItem product={product} variant="xsMobile" section={section} />
      </div>

      <div className="hidden md:block lg:hidden">
        <ProductItem product={product} variant="tablet" section={section} />
      </div>

      <div className="hidden lg:block xl:hidden">
        <ProductItem product={product} variant="desktop" section={section} />
      </div>

      <div className="hidden xl:block 2xl:hidden">
        <ProductItem product={product} variant="xlDesktop" section={section} />
      </div>

      <div className="hidden 2xl:block">
        <ProductItem product={product} variant="xxlDesktop" section={section} />
      </div>
    </>
  );
}

function SectionBackground({ section }: { section: BestsellerSection }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={section.backgroundImage || FALLBACKS.sectionBg}
        alt=""
        fill
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(246,239,221,0.70)_5%,rgba(246,239,221,0.45)_30%,rgba(246,239,221,0.20)_45%,transparent_90%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(246,239,221,0.8)_35%,rgba(246,239,221,0.8)_45%,rgba(246,239,221,0.1)_100%)]" />
    </div>
  );
}

function SectionTitle({ section }: { section: BestsellerSection }) {
  return (
    <div className="flex flex-col items-center pb-8 pt-11 md:pb-10 md:pt-14 2xl:pt-8">
      <div className="relative">
        <div
          className="
            relative z-10 overflow-hidden rounded border border-[#d8bf8a]
            bg-cover bg-center px-8 py-2.5 font-serif text-[16px]
            uppercase tracking-[0.1em]
            shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]
            min-[445px]:px-10 min-[445px]:text-[18px]
            md:px-14 md:py-3 md:text-[24px]
          "
          style={{
            backgroundImage: `url('${
              section.buttonBackgroundImage || FALLBACKS.cardTexture
            }')`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
          <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22)_0%,transparent_45%)]" />
          <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-sm border border-[#e0c896]/60" />

          <span className="relative z-10 font-[family-name:var(--font-merienda)] font-bold text-[#460e07]">
            {section.title || "EN ÇOK SATANLAR"}
          </span>
        </div>

        <div className="absolute -bottom-1 -right-1 h-full w-full rounded-sm bg-[#3d3020]/20" />
      </div>

      <div className="mt-4 h-px w-24 bg-[#5c4a28]/30" />
    </div>
  );
}

function ProductItem({
  product,
  variant,
  section,
}: {
  product: BestsellerCard;
  variant: Variant;
  section: BestsellerSection;
}) {
  const size = PRODUCT_SIZES[variant];

  return (
    <div
      className="group relative shrink-0 transition-all duration-300 lg:hover:-translate-y-1"
      style={{
        width: size.itemW,
        height: size.itemH,
      }}
    >
      <ProductImage product={product} size={size} />
      <ProductPlate section={section} size={size} />
      <ProductInfoCard product={product} section={section} size={size} />
    </div>
  );
}

function ProductImage({
  product,
  size,
}: {
  product: BestsellerCard;
  size: ProductSize;
}) {
  if (!product.imageUrl) return null;

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 overflow-hidden rounded-t-[14px]"
      style={{
        width: size.imageW,
        top: size.imageTop,
      }}
    >
      <Image
        src={product.imageUrl}
        alt={product.title}
        width={size.imageW}
        height={size.imageW}
        className="h-auto w-full rounded-t-[14px] object-contain transition-all duration-500 ease-out group-hover:scale-105"
        style={{
          filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.24))",
        }}
      />
    </div>
  );
}

function ProductPlate({
  section,
  size,
}: {
  section: BestsellerSection;
  size: ProductSize;
}) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 z-40"
      style={{
        width: size.plateW,
        top: size.plateTop,
        transform: `translateX(-50%) scale(${size.plateScaleX}, ${size.plateScaleY})`,
        transformOrigin: "center center",
      }}
    >
      <Image
        src={section.plateImage || FALLBACKS.plate}
        alt=""
        width={size.plateW}
        height={size.plateW * 0.53}
        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          transform: "perspective(500px) rotateX(70deg)",
          transformOrigin: "center center",
          filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.2))",
        }}
      />
    </div>
  );
}

function ProductInfoCard({
  product,
  section,
  size,
}: {
  product: BestsellerCard;
  section: BestsellerSection;
  size: ProductSize;
}) {
  return (
    <div
      className="absolute left-1/2 z-10 -translate-x-1/2"
      style={{
        width: size.cardW,
        top: size.cardTop,
      }}
    >
      <ProductCard
        embossed
        wallTexture={section.buttonBackgroundImage || FALLBACKS.cardTexture}
        href={`/products/${product.slug}`}
        showImage={false}
        showDescription={false}
        showPrice={false}
        showButton={false}
        card={{
          w: size.cardW,
          h: size.cardH,
        }}
        style={{
          overflow: "visible",
        }}
        content={{
          top: size.contentTop,
          left: 10,
          right: 10,
          bottom: 8,
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
        <ProductCardContent product={product} section={section} size={size} />
      </ProductCard>
    </div>
  );
}

function ProductCardContent({
  product,
  section,
  size,
}: {
  product: BestsellerCard;
  section: BestsellerSection;
  size: ProductSize;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <span
        className="line-clamp-2 mt-4 block text-center font-serif font-bold leading-[1.2] tracking-wide text-[#2c1a0e]"
        style={{
          fontSize: size.titleSize,
          minHeight: size.titleMinH,
        }}
      >
        {product.title}
      </span>

      <span
        className="mb-2  block font-extrabold leading-none text-[#7a3b1e]"
        style={{
          fontSize: size.priceSize,
          marginTop: size.priceMt,
        }}
      >
        ₺{product.price}
      </span>

      <AddToCartPill section={section} size={size} />
    </div>
  );
}

function AddToCartPill({
  section,
  size,
}: {
  section: BestsellerSection;
  size: ProductSize;
}) {
  return (
    <div
      className="mx-auto w-fit whitespace-nowrap rounded-full border-2 border-transparent font-bold uppercase tracking-[0.14em] text-[#e8dcc0]"
      style={{
        marginTop: size.buttonMt,
        fontSize: size.buttonSize,
        paddingInline: size.buttonPx,
        paddingBlock: size.buttonPy,
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
      {section.addToCartText || "Sepete Ekle"}
    </div>
  );
}

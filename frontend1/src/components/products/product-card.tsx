"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Offset = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

type SizeProps = {
  w: number;
  h: number;
  zIndex?: number;
};

type ProductImage = {
  url: string;
  alt?: string;
};

type Product = {
  name: string;
  price: number;
  slug: string;
  description?: string;
  stock?: number;
  images?: ProductImage[];
};

type ImageLayout = SizeProps &
  Offset & {
    scale?: number;
    objectFit?: CSSProperties["objectFit"];
    className?: string;
    shadow?: boolean;
    shadowTop?: number;
    shadowLeft?: number;
    shadowWidth?: number;
  };

type ContentLayout = Offset & {
  align?: "left" | "center" | "right";
  className?: string;
};

type ProductCardProps = {
  product: Product;

  card?: SizeProps;
  image?: ImageLayout;
  content?: ContentLayout;

  showImage?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  showButton?: boolean;

  actionText?: string;

  href?: string;
  clickable?: boolean;

  containerClass?: string;
  contentClass?: string;
  style?: CSSProperties;

  children?: ReactNode;
  className?: string;

  embossed?: boolean;

  /**
   * Örn:
   * wallTexture="/duvarBg.png"
   */
  wallTexture?: string;
};

export function ProductCard({
  product,

  card = {
    w: 150,
    h: 228,
  },

  image = {
    w: 118,
    h: 112,
    top: 24,
    left: 16,
    scale: 1,
    shadow: false,
  },

  content = {
    left: 0,
    right: 0,
    bottom: 10,
    align: "center",
  },

  showImage = true,
  showDescription = true,
  showPrice = false,
  showButton = true,

  actionText = "SEPETE EKLE",

  href,
  clickable = true,

  containerClass,
  contentClass,
  style,

  children,
  className,

  embossed = false,
  wallTexture,
}: ProductCardProps) {
  const productImage = product.images?.[0];
  const productImageSrc = productImage?.url;

  const textAlign =
    content.align === "left"
      ? "items-start text-left"
      : content.align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const hasWallTexture = Boolean(wallTexture);

  const CardInner = (
    <div
      className={cn(
        `
        relative overflow-visible rounded-[10px]
        border
        transition-all duration-300
        hover:-translate-y-[2px]

        before:pointer-events-none
        before:absolute
        before:inset-0
        before:z-[1]
        before:rounded-[10px]

        after:pointer-events-none
        after:absolute
        after:inset-0
        after:z-[2]
        after:rounded-[10px]
        `,
        hasWallTexture
          ? `
          bg-cover bg-center
          border-[#d8bf8a]

          before:bg-[linear-gradient(135deg,rgba(255,252,245,0.72),rgba(214,194,160,0.22))]

          after:bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.42)_0%,_rgba(255,255,255,0.10)_30%,_rgba(0,0,0,0)_62%,_rgba(120,92,58,0.10)_100%)]
          `
          : `
          bg-[#efe6cf]
          border-[#d0bc90]

          before:bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.99)_0%,_rgba(250,243,228,0.97)_38%,_rgba(246,236,214,0.92)_62%,_rgba(228,212,176,0.58)_88%,_rgba(188,170,126,0.34)_100%)]

          after:bg-[linear-gradient(to_bottom,_rgba(160,142,98,0.10)_0%,_rgba(255,255,255,0)_24%,_rgba(255,255,255,0)_76%,_rgba(160,142,98,0.10)_100%)]
          `,
        embossed
          ? `
  shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)]

  hover:shadow-[0_14px_24px_rgba(120,92,58,0.20),0_4px_0_rgba(190,166,118,0.40),inset_0_1px_3px_rgba(255,255,255,0.72),inset_0_-4px_10px_rgba(160,126,78,0.14)]
  `
          : `
  shadow-[0_2px_8px_rgba(148,128,82,0.14)]

  hover:shadow-[0_6px_14px_rgba(148,128,82,0.18)]
  `,
        clickable && "cursor-pointer",
        containerClass,
        className,
      )}
      style={{
        width: card.w,
        height: card.h,
        zIndex: card.zIndex,
        backgroundImage: wallTexture ? `url(${wallTexture})` : undefined,
        ...style,
      }}
    >
      {/* Alt büyük yumuşak gölge */}
      {embossed && (
        <div
          className="
      pointer-events-none
      absolute
      left-[4%]
      right-[4%]
      -bottom-3
      h-6
      rounded-full
      bg-[#8b6a42]/18
      blur-xl
      z-0
    "
        />
      )}

      {/* İç altın frame */}
      <div
        className={cn(
          `
          pointer-events-none
          absolute
          z-[5]
          rounded-[8px]
          border
          `,
          hasWallTexture
            ? `
            inset-[9px]
            border-[#e0c896]/80

            shadow-[inset_0_1px_0_rgba(255,252,242,0.82),inset_0_-1px_0_rgba(145,116,72,0.12)]
            `
            : `
            inset-0
            border-[#d6c49a]

            shadow-[inset_0_1px_0_rgba(255,252,242,0.55),inset_0_-1px_0_rgba(168,146,102,0.18)]
            `,
        )}
      />

      {/* Kenar vignette */}
      {hasWallTexture && (
        <div
          className="
            pointer-events-none
            absolute inset-0 z-[4]
            rounded-[10px]

            shadow-[inset_0_0_18px_rgba(120,92,58,0.10),inset_0_-4px_10px_rgba(120,92,58,0.08)]
          "
        />
      )}

      {/* Product Image */}
      {showImage && productImageSrc && (
        <div
          className={cn("pointer-events-none absolute z-10", image.className)}
          style={{
            width: image.w,
            height: image.h,
            top: image.top,
            left: image.left,
            right: image.right,
            bottom: image.bottom,
          }}
        >
          {image.shadow && (
            <div
              className="
                absolute z-[1]
                rounded-full
                bg-black/15
                blur-[10px]
              "
              style={{
                top: `${image.shadowTop ?? 72}%`,
                left: `${image.shadowLeft ?? 50}%`,
                width: `${image.shadowWidth ?? 70}%`,
                height: "18%",
                transform: "translateX(-50%)",
              }}
            />
          )}

          <Image
            src={productImageSrc}
            alt={productImage.alt ?? product.name}
            fill
            priority
            className="
              relative z-[2]
              object-contain
              drop-shadow-[0_12px_16px_rgba(45,28,12,0.22)]
            "
            style={{
              objectFit: image.objectFit ?? "contain",
              transform: `scale(${image.scale ?? 1})`,
              transformOrigin: "center center",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div
        className={cn(
          "absolute z-20 flex flex-col",
          textAlign,
          content.className,
          contentClass,
        )}
        style={{
          top: content.top,
          left: content.left,
          right: content.right,
          bottom: content.bottom,
        }}
      >
        {children ?? (
          <>
            <h3
              className="
                font-serif
                font-bold
                leading-[1.05]
                text-[#2f1f13]
              "
              style={{
                fontSize: Math.max(12, card.w * 0.07),
              }}
            >
              {product.name}
            </h3>

            {showDescription && product.description && (
              <p
                className="
                  mt-[5px]
                  line-clamp-2
                  font-serif
                  italic
                  leading-[1.2]
                  text-[#5e4734]
                "
                style={{
                  fontSize: Math.max(8, card.w * 0.04),
                }}
              >
                {product.description}
              </p>
            )}

            {showPrice && (
              <p
                className="
                  mt-[5px]
                  font-black
                  text-[#3a2a1c]
                "
                style={{
                  fontSize: Math.max(12, card.w * 0.055),
                }}
              >
                ₺{product.price}
              </p>
            )}

            {showButton && (
              <button
                type="button"
                className="
                  mt-auto
                  rounded-full
                  border-2
                  border-transparent
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#f2e7d2]
                  transition-all
                  duration-300
                  hover:brightness-110
                  active:scale-[0.98]
                "
                style={{
                  fontSize: Math.max(7, card.w * 0.028),

                  padding: `
                    ${Math.max(4, card.h * 0.035)}px
                    ${Math.max(12, card.w * 0.05)}px
                  `,

                  backgroundImage: `
                    linear-gradient(#6a5234, #6a5234),
                    linear-gradient(
                      to right,
                      #b38a52,
                      #e3c287,
                      #f1d9a7,
                      #e3c287,
                      #b38a52
                    )
                  `,

                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",

                  boxShadow:
                    "0 2px 6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                {actionText}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return clickable && href ? (
    <Link href={href} className="inline-block">
      {CardInner}
    </Link>
  ) : (
    CardInner
  );
}

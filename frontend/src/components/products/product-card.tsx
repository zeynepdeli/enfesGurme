import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Product } from "@/types";

type ProductCardProduct = Omit<
  Pick<Product, "name" | "price" | "slug" | "description" | "stock" | "images">,
  "images"
> & {
  images?: { url: string; alt?: string }[];
};

export type ImageStyle = "rounded" | "circle" | "square";
export type CardLayout = "vertical" | "horizontal";

interface ProductCardProps {
  product: ProductCardProduct;
  layout?: CardLayout; // "vertical" (default) | "horizontal"
  card?: { w?: number; h?: number };
  frame?: { w?: number; h?: number };
  offset?: { top?: number; left?: number };
  imageHeight?: number;
  imageWidth?: number;
  imageOffset?: { top?: number; left?: number; right?: number }; // horizontal layout'ta fotoğraf konumu
  imageStyle?: ImageStyle;
  showStock?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  href?: string; // override default /products/[slug]
  children?: React.ReactNode; // override content area completely
}

const DEFAULTS = {
  card: { w: 200, h: 260 },
  frame: { w: 240, h: 300 },
  imageHeight: 110,
};

/* ── Shared image node ──────────────────────────────── */
function ProductImage({
  product,
  imageStyle,
  width,
  height,
  className = "",
}: {
  product: ProductCardProduct;
  imageStyle: ImageStyle;
  width: number | string;
  height: number | string;
  className?: string;
}) {
  const shapeClass =
    imageStyle === "circle"
      ? "rounded-full"
      : imageStyle === "rounded"
        ? "rounded-xl"
        : "rounded-none";

  return (
    <div
      className={`overflow-hidden bg-gray/0 flex-shrink-0 ${shapeClass} ${className}`}
      style={{ width, height }}
    >
      {product.images?.[0] ? (
        <img
          src={product.images[0].url}
          alt={product.images[0].alt ?? product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl">
          🧀
        </div>
      )}
    </div>
  );
}

/* ── Main component ─────────────────────────────────── */
export function ProductCard({
  product,
  layout = "vertical",
  card = DEFAULTS.card,
  frame = DEFAULTS.frame,
  offset,
  imageHeight = DEFAULTS.imageHeight,
  imageWidth,
  imageOffset,
  imageStyle = "rounded",
  showStock = false,
  showDescription = true,
  showPrice = true,
  href,
  children,
}: ProductCardProps) {
  const cardW = card.w ?? DEFAULTS.card.w;
  const cardH = card.h ?? DEFAULTS.card.h;
  const frameW = frame.w ?? DEFAULTS.frame.w;
  const frameH = frame.h ?? DEFAULTS.frame.h;

  /* ── Vertical layout calculations ── */
  const isCircle = imageStyle === "circle";
  const circleSize = isCircle ? (imageWidth ?? Math.round(cardW * 0.78)) : 0;
  const circleTop = isCircle ? -(circleSize * 0.52) : 0;
  const imageInCard = isCircle
    ? Math.max(circleSize + circleTop, circleSize * 0.18)
    : imageHeight;
  const contentH = cardH - imageInCard;

  /* ── Horizontal layout: image taşma miktarı ── */
  // Görsel kartın sağından dışarı taşıyor, daire şeklinde
  const hImgSize = imageWidth ?? Math.round(cardH * 1.05);
  const hImgTop = imageOffset?.top ?? -(hImgSize - cardH) / 2;
  const hImgLeft =
    imageOffset?.left ??
    (imageOffset?.right != null
      ? cardW - imageOffset.right - hImgSize
      : cardW - Math.round(hImgSize * 0.45));

  return (
    <Link
      href={href ?? `/products/${product.slug}`}
      style={{ display: "contents" }}
    >
      <div
        className="relative group cursor-pointer flex-shrink-0"
        style={{ width: frameW, height: frameH }}
      >
        {/* FRAME */}
        <div
          className="absolute z-0 pointer-events-none rounded-sm"
          style={{ width: frameW, height: frameH, top: 0, left: 0 }}
        >
          <img
            src="/productCard.png"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              opacity: 0.9,
            }}
          />
        </div>

        {/* CARD */}
        <div
          className="absolute"
          style={{
            width: cardW,
            height: cardH,
            top: offset?.top ?? (frameH - cardH) / 2,
            left: offset?.left ?? (frameW - cardW) / 2,
          }}
        >
          {layout === "horizontal" ? (
            /* ══════════════════════════════
               HORIZONTAL LAYOUT
               Sol: metin  |  Sağ: yuvarlak fotoğraf (taşıyor)
            ══════════════════════════════ */
            <Card className="relative z-10 h-full rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-visible">
              {/* Metin — sol taraf */}
              <div className="flex flex-col justify-center h-full px-4 pr-[45%]">
                <h3 className="font-semibold text-sm text-white leading-tight line-clamp-2 group-hover:text-[#c8a44a] transition-colors">
                  {product.name}
                </h3>
                {showDescription && (
                  <p className="text-white/50 text-[10px] mt-1 line-clamp-1 leading-snug">
                    {product.description}
                  </p>
                )}
                {showPrice && (
                  <span className="text-xs font-bold text-[#c8a44a] mt-1.5">
                    {product.price} TL
                  </span>
                )}
              </div>

              {/* Görsel — sağdan taşan daire */}
              <div
                className="absolute z-20 overflow-hidden rounded-full ring-2 ring-white/20"
                style={{
                  width: hImgSize,
                  height: hImgSize,
                  top: hImgTop,
                  left: hImgLeft,
                }}
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.images[0].alt ?? product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl">
                    🧀
                  </div>
                )}
              </div>
            </Card>
          ) : (
            /* ══════════════════════════════
               VERTICAL LAYOUT (mevcut)
            ══════════════════════════════ */
            <Card className="relative z-10 h-full rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              {/* IMAGE — imageInCard 0 ise render etme */}
              {imageInCard > 0 && (
                <CardHeader
                  className="p-0 relative flex-shrink-0"
                  style={{ height: imageInCard }}
                >
                  {isCircle ? (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 overflow-hidden bg-[#1a3a1d] rounded-full ring-2 ring-white/20 z-20"
                      style={{
                        width: circleSize,
                        height: circleSize,
                        top: circleTop,
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt ?? product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl">
                          🧀
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`overflow-hidden bg-white/5 mx-auto ${
                        imageStyle === "rounded"
                          ? "rounded-t-xl"
                          : "rounded-none"
                      }`}
                      style={{
                        height: imageHeight,
                        width: imageWidth ?? "100%",
                      }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt ?? product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl">
                          🧀
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
              )}

              {/* CONTENT */}
              <div
                className="flex flex-col overflow-hidden"
                style={{ height: imageInCard > 0 ? contentH : cardH }}
              >
                {children ?? (
                  <>
                    <CardContent className="px-3 pt-2 pb-0">
                      <h3 className="font-semibold text-sm text-white leading-tight line-clamp-1 group-hover:text-[#c8a44a] transition-colors">
                        {product.name}
                      </h3>
                      {showDescription && (
                        <p className="text-white/50 text-[11px] mt-1 line-clamp-2 leading-snug">
                          {product.description}
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="px-3 pb-3 pt-0 flex items-center justify-between">
                      {showPrice && (
                        <span className="text-sm font-bold text-[#c8a44a]">
                          {product.price} TL
                        </span>
                      )}
                      {showStock && product.stock > 0 && (
                        <span className="text-[11px] text-white/40">
                          Stok: {product.stock}
                        </span>
                      )}
                    </CardFooter>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Link>
  );
}

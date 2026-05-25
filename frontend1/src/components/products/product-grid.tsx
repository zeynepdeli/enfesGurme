"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/product-card";
import { ProductListSkeleton } from "@/components/products/product-list-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorMessage } from "@/components/shared/error-message";
import { useProductFilters } from "@/hooks/use-product-filters";

type Variant = "mobile" | "tablet" | "desktop" | "xl" | "xxl";

export function ProductGrid({ externalSearch }: { externalSearch: string }) {
  const { filters: urlFilters } = useProductFilters();
  const categoryId = urlFilters.categoryId;

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => {
      const url = categoryId
        ? `/api/products?categoryId=${categoryId}`
        : "/api/products";

      const res = await api.get<Product[]>(url);
      return res.data || [];
    },
  });

  const filteredProducts = useMemo(() => {
    const search = externalSearch.trim().toLowerCase();

    if (!search) return products ?? [];

    return (products ?? []).filter((product) =>
      product.name.toLowerCase().includes(search),
    );
  }, [products, externalSearch]);

  return (
    <div className="flex min-h-screen flex-col gap-8 pb-20">
      {isLoading && <ProductListSkeleton />}

      {error && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#3d3020]/5 bg-[#efe6d6]/50 py-20 text-center">
          <ErrorMessage message={(error as Error).message} />

          <button
            onClick={() => refetch()}
            className="rounded bg-[#3d3020] px-8 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#efe6d6] transition-colors hover:bg-[#a67c3d]"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#3d3020]/10 bg-[#efe6d6]/30 py-20">
          <EmptyState
            title="Aradığınız lezzet bulunamadı"
            description="Farklı bir arama yapmayı veya filtreleri temizlemeyi deneyin."
          />
        </div>
      )}

      {!isLoading && !error && filteredProducts.length > 0 && (
        <div
          className="
            grid grid-cols-2 justify-items-center
            gap-x-2 gap-y-6
            sm:gap-x-3 sm:gap-y-7
            md:grid-cols-3 md:gap-x-4 md:gap-y-8
            lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10
            xl:grid-cols-4 xl:gap-x-6 xl:gap-y-12
            2xl:gap-x-8
          "
        >
          {filteredProducts.map((product) => (
            <div key={product.id}>
              <div className="block sm:hidden">
                <ProductItem product={product} variant="mobile" />
              </div>

              <div className="hidden sm:block md:hidden">
                <ProductItem product={product} variant="tablet" />
              </div>

              <div className="hidden md:block xl:hidden">
                <ProductItem product={product} variant="desktop" />
              </div>

              <div className="hidden xl:block 2xl:hidden">
                <ProductItem product={product} variant="xl" />
              </div>

              <div className="hidden 2xl:block">
                <ProductItem product={product} variant="xxl" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductItem({
  product,
  variant,
}: {
  product: Product;
  variant: Variant;
}) {
  const sizes = {
    mobile: {
      cardW: 150,
      cardH: 220,
      imageH: 160,
      contentH: "28%",
      titleSize: 10,
      priceSize: 12,
      buttonSize: 6,
      buttonPx: 7,
      buttonPy: 3,
    },

    tablet: {
      cardW: 175,
      cardH: 245,
      imageH: 178,
      contentH: "28%",
      titleSize: 11,
      priceSize: 13,
      buttonSize: 7,
      buttonPx: 9,
      buttonPy: 4,
    },

    desktop: {
      cardW: 220,
      cardH: 292,
      imageH: 215,
      contentH: "27%",
      titleSize: 13,
      priceSize: 15,
      buttonSize: 8,
      buttonPx: 11,
      buttonPy: 5,
    },

    xl: {
      cardW: 245,
      cardH: 320,
      imageH: 238,
      contentH: "26%",
      titleSize: 14,
      priceSize: 16,
      buttonSize: 9,
      buttonPx: 13,
      buttonPy: 5,
    },

    xxl: {
      cardW: 270,
      cardH: 350,
      imageH: 260,
      contentH: "26%",
      titleSize: 16,
      priceSize: 18,
      buttonSize: 10,
      buttonPx: 16,
      buttonPy: 6,
    },
  };

  const current = sizes[variant];

  return (
    <ProductCard
      product={product}
      clickable
      href={`/products/${product.slug}`}
      card={{
        w: current.cardW,
        h: current.cardH,
        zIndex: 10,
      }}
      image={{
        w: current.cardW,
        h: current.imageH,
        top: 0,
        left: 0,
        zIndex: 10,
        className: "rounded-t-lg",
      }}
      contentClass="absolute bottom-0 left-0 right-0 flex flex-col justify-center items-center rounded-b-lg px-2"
      style={{
        width: current.cardW,
        height: current.cardH,
      }}
    >
      <div
        className="flex w-full flex-col items-center justify-center gap-2"
        style={{
          height: current.contentH,
        }}
      >
        <h3
          className="line-clamp-2 w-full text-center font-serif font-bold uppercase leading-snug tracking-wide text-[#3d2b0e]"
          style={{
            fontSize: current.titleSize,
          }}
        >
          {product.name}
        </h3>

        <div className="flex w-full items-center justify-between gap-2 px-1">
          <span
            className="whitespace-nowrap font-black text-[#7a3b1e]"
            style={{
              fontSize: current.priceSize,
            }}
          >
            ₺{product.price}
          </span>

          <button
            onClick={(e) => e.preventDefault()}
            className="rounded-full border-2 border-transparent font-bold uppercase tracking-[0.14em] text-[#e8dcc0] transition-all duration-300 group-hover:brightness-110"
            style={{
              fontSize: current.buttonSize,
              paddingInline: current.buttonPx,
              paddingBlock: current.buttonPy,
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
            Sepete Ekle
          </button>
        </div>
      </div>
    </ProductCard>
  );
}

"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { ProductCard } from "@/components/products/product-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

type Tab = "hikaye" | "ozellikler" | "servis";
type DesktopVariant = "lg" | "xl" | "xxl";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("hikaye");

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get<Product>(`/api/products/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Ürün Hazırlanıyor..." fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="p-20 text-center">
        <ErrorMessage message="Ürün bulunamadı." />
      </div>
    );
  }

  const productImage = product.images?.[0]?.url;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6efdd]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-multiply">
        <Image src="/heroB.png" alt="" fill className="object-cover" />
      </div>

      {/* MOBILE / TABLET DECOR */}
      <div className="pointer-events-none absolute inset-0 z-[1] lg:hidden">
        <img
          src="/wo.png"
          alt=""
          className="absolute left-[-6%] top-[8%] w-[58%] opacity-[0.12] mix-blend-multiply sm:left-[30%] sm:top-[30%] sm:w-[4%] md:left-[2%] md:top-[15%]  md:w-[34%]"
        />

        <img
          src="/wo.png"
          alt=""
          className="absolute left-[-8%] top-[50%] w-[54%] rotate-[10deg] opacity-[0.10] mix-blend-multiply sm:left-[2%] sm:w-[40%] md:left-[2%] md:w-[30%] md:top-[60%]"
        />

        <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-[linear-gradient(to_bottom,transparent,rgba(205,190,148,0.20),rgba(246,239,221,0.10))]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[2200px] px-4 pb-12 pt-32 sm:px-6 sm:pt-36 md:px-8 md:pt-40 lg:px-8 lg:pt-28 xl:px-12 2xl:px-20">
        {/* MOBILE / TABLET */}
        <div className="flex flex-col items-center lg:hidden">
          <ProductInfoMobile
            product={product}
            productImage={productImage}
            quantity={quantity}
            setQuantity={setQuantity}
            addItem={addItem}
            routerPushCart={() => router.push("/cart")}
          />
        </div>

        {/* LG */}
        <div className="hidden lg:block xl:hidden">
          <DesktopLayout
            product={product}
            productImage={productImage}
            quantity={quantity}
            setQuantity={setQuantity}
            addItem={addItem}
            routerPushCart={() => router.push("/cart")}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            variant="lg"
          />
        </div>

        {/* XL */}
        <div className="hidden xl:block 2xl:hidden">
          <DesktopLayout
            product={product}
            productImage={productImage}
            quantity={quantity}
            setQuantity={setQuantity}
            addItem={addItem}
            routerPushCart={() => router.push("/cart")}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            variant="xl"
          />
        </div>

        {/* XXL */}
        <div className="hidden 2xl:block">
          <DesktopLayout
            product={product}
            productImage={productImage}
            quantity={quantity}
            setQuantity={setQuantity}
            addItem={addItem}
            routerPushCart={() => router.push("/cart")}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            variant="xxl"
          />
        </div>
      </div>
    </div>
  );
}

function ProductInfoMobile({
  product,
  productImage,
  quantity,
  setQuantity,
  addItem,
  routerPushCart,
}: {
  product: Product;
  productImage?: string;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  addItem: (id: string) => void;
  routerPushCart: () => void;
}) {
  return (
    <>
      <Label />

      <div className="mb-6 mt-7 text-center">
        <h1 className="font-serif text-[44px] font-extrabold uppercase leading-none tracking-wide text-[#2c1a0e] sm:text-[58px] md:text-[72px]">
          {product.name}
        </h1>

        {product.description && (
          <p className="mx-auto mt-3 max-w-[520px] font-serif text-[22px] italic leading-snug text-[#3d2b1d] sm:text-[28px] md:text-[32px]">
            {product.description}
          </p>
        )}
      </div>

      <div className="relative mb-8 h-[340px] w-full max-w-[620px] sm:h-[440px] md:h-[520px] md:max-w-[760px]">
        <ImageCard product={product} productImage={productImage} />
      </div>

      <BuyPanel
        product={product}
        quantity={quantity}
        setQuantity={setQuantity}
        addItem={addItem}
        routerPushCart={routerPushCart}
      />
    </>
  );
}

function DesktopLayout({
  product,
  productImage,
  quantity,
  setQuantity,
  addItem,
  routerPushCart,
  activeTab,
  setActiveTab,
  variant,
}: {
  product: Product;
  productImage?: string;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  addItem: (id: string) => void;
  routerPushCart: () => void;
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  variant: DesktopVariant;
}) {
  const sizes = {
    lg: {
      wrapH: 760,
      viewH: "82vh",
      centerH: 540,
      centerW: "38%",
      centerLeft: "42%",
      leftW: "42%",
      rightW: "58%",
      rightPl: "35%",
      rightPr: "4%",
      title: "text-[44px]",
      desc: "text-[17px]",
      price: "text-[50px]",
      maxText: "max-w-[500px]",
      btnW: "max-w-[360px]",
      gap: "space-y-5",
    },

    xl: {
      wrapH: 820,
      viewH: "84vh",
      centerH: 620,
      centerW: "38%",
      centerLeft: "42%",
      leftW: "63%",
      rightW: "57%",
      rightPl: "20%",
      rightPr: "5%",
      title: "text-[56px]",
      desc: "text-[19px]",
      price: "text-[62px]",
      maxText: "max-w-[560px]",
      btnW: "max-w-[420px]",
      gap: "space-y-8",
    },

    xxl: {
      wrapH: 930,
      viewH: "88vh",
      centerH: 760,
      centerW: "40%",
      centerLeft: "42%",
      leftW: "43%",
      rightW: "57%",
      rightPl: "35%",
      rightPr: "8%",
      title: "text-[76px]",
      desc: "text-[26px]",
      price: "text-[84px]",
      maxText: "max-w-[650px]",
      btnW: "max-w-[520px]",
      gap: "space-y-10",
    },
  };

  const s = sizes[variant];

  return (
    <div
      className="relative flex w-full items-center"
      style={{
        minHeight: s.wrapH,
        height: s.viewH,
      }}
    >
      {/* LEFT PANEL */}
      <div
        className="relative overflow-hidden rounded-r-[34px]"
        style={{
          width: s.leftW,
          minHeight: s.wrapH,
          height: "100%",
        }}
      >
        <DecorPanel />
      </div>

      {/* RIGHT PANEL */}
      <div
        className="relative"
        style={{
          width: s.rightW,
          minHeight: s.wrapH,
          height: "100%",
          top:"10px"
        }}
      >
        <div
          className="
            absolute right-0 top-1/2
            flex w-full -translate-y-1/2
            flex-col justify-between
          "
          style={{
            height: s.centerH,
            paddingLeft: s.rightPl,
            paddingRight: s.rightPr,
          }}
        >
          <div className={`${s.maxText} ${s.gap}`}>
            <Label />

            <div className="space-y-3">
              <h1
                className={`font-serif font-extrabold uppercase leading-tight tracking-wide text-[#2c1a0e] ${s.title}`}
              >
                {product.name}
              </h1>

              {product.description && (
                <p
                  className={`font-serif italic leading-relaxed text-[#5e4734] ${s.desc}`}
                >
                  {product.description}
                </p>
              )}
            </div>

            <Price product={product} className={s.price} />

            <QuantityControl
              quantity={quantity}
              setQuantity={setQuantity}
              large={variant === "xxl"}
            />

            <Buttons
              product={product}
              addItem={addItem}
              routerPushCart={routerPushCart}
              className={s.btnW}
              large={variant === "xxl"}
            />
          </div>

          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            large={variant === "xxl"}
          />
        </div>
      </div>

      {/* CENTER PRODUCT CARD */}
      <div
        className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: s.centerLeft,
          width: s.centerW,
          height: s.centerH,
        }}
      >
        <ImageCard product={product} productImage={productImage} desktop />
      </div>
    </div>
  );
}

function DecorPanel() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f0e4cd_0%,#e7dac0_14%,#c4be98_36%,#b3ad84_52%,#c9c39f_70%,#e8dcc5_88%,#f0e4cd_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,248,236,0.24),transparent_36%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(88,74,46,0.06)_50%,transparent_100%)]" />
      <div className="absolute right-[-10%] top-[8%] h-[320px] w-[320px] rounded-full bg-[#fff8ec]/10 blur-[90px]" />

      <img
        src="/wo.png"
        alt=""
        className="absolute left-[8%] top-[-8%] w-[58%] opacity-[0.12] mix-blend-multiply"
      />

      <img
        src="/wo.png"
        alt=""
        className="absolute left-[20%] top-[38%] w-[50%] rotate-[10deg] opacity-[0.10] mix-blend-multiply"
      />

      <div className="absolute bottom-[5%] left-[5%] h-24 w-24 opacity-[0.08]">
        <Image
          src="/logo.png"
          alt=""
          fill

    
          className="object-contain brightness-0"
        />
      </div>
    </>
  );
}

function Label() {
  return (
    <div className="relative inline-block">
      <div
        className="relative z-10 overflow-hidden rounded-[4px] border border-[#d8bf8a] bg-cover bg-center px-6 py-2 font-serif text-sm font-bold uppercase tracking-[0.16em] text-[#460e07] shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)] 2xl:px-8 2xl:py-3 2xl:text-base"
        style={{ backgroundImage: "url('/cardDuvar.png')" }}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.22)_0%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-[2px] border border-[#e0c896]/60" />

        <span className="relative z-10">Özel Lezzet</span>
      </div>

      <div className="absolute -bottom-1 -right-1 h-full w-full rounded-sm bg-[#3d3020]/20" />
    </div>
  );
}

function ImageCard({
  product,
  productImage,
  desktop = false,
}: {
  product: Product;
  productImage?: string;
  desktop?: boolean;
}) {
  return (
    <>
      <ProductCard
        product={{ ...product, images: [] }}
        clickable={false}
        embossed
        showImage={false}
        showDescription={false}
        showButton={false}
        showPrice={false}
        card={{ w: 760, h: 760, zIndex: 20 }}
        content={{ bottom: 0, left: 0, right: 0, align: "center" }}
        containerClass="!h-full !w-full rounded-[18px] shadow-[0_30px_70px_rgba(45,28,12,0.22)]"
        style={{ overflow: "hidden" }}
      >
        <></>
      </ProductCard>

      {productImage && (
        <Image
          src={productImage}
          alt={product.name}
          fill
          priority
          className={`
            pointer-events-none relative z-30 object-contain
            drop-shadow-[0_34px_58px_rgba(45,28,12,0.42)]
            ${desktop ? "p-10 xl:p-12 2xl:p-16" : "p-7 sm:p-10 md:p-12"}
          `}
        />
      )}

      <button
        type="button"
        aria-label="Görseli büyüt"
        className="absolute right-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bf8a]/70 bg-[#efe3cf]/82 text-[#6b3f18] shadow-[inset_0_1px_2px_rgba(255,255,255,0.55),0_2px_5px_rgba(0,0,0,0.08)] transition-all duration-300 hover:scale-105 hover:bg-[#f5ead7] 2xl:h-12 2xl:w-12"
      >
        <Maximize2 size={16} />
      </button>
    </>
  );
}

function Price({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div className="flex items-end gap-2">
      <span
        className={`font-serif font-black leading-none text-[#7a3b1e] ${className}`}
      >
        ₺{product.price.toLocaleString("tr-TR")}
      </span>

      <span className="pb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#7a3b1e]/70">
        TL
      </span>
    </div>
  );
}

function QuantityControl({
  quantity,
  setQuantity,
  large = false,
}: {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  large?: boolean;
}) {
  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d3020]/45 2xl:text-[13px]">
        Miktar
      </span>

      <div className="mt-3 flex w-fit items-center gap-3 rounded-full border border-[#d8bf8a]/70 bg-[#efe3cf]/70 p-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.55),inset_0_-3px_8px_rgba(160,126,78,0.14)]">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={`flex items-center justify-center rounded-full bg-[#6a5234] text-lg font-bold text-[#f2e7d2] ${
            large ? "h-10 w-10" : "h-8 w-8"
          }`}
        >
          −
        </button>

        <span
          className={`text-center font-black text-[#2c1a0e] ${
            large ? "w-10 text-base" : "w-8 text-sm"
          }`}
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className={`flex items-center justify-center rounded-full bg-[#6a5234] text-lg font-bold text-[#f2e7d2] ${
            large ? "h-10 w-10" : "h-8 w-8"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function Buttons({
  product,
  addItem,
  routerPushCart,
  className = "",
  large = false,
}: {
  product: Product;
  addItem: (id: string) => void;
  routerPushCart: () => void;
  className?: string;
  large?: boolean;
}) {
  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => addItem(product.id)}
        className={`relative overflow-hidden rounded-full border-2 border-transparent font-bold uppercase tracking-[0.18em] text-[#e8dcc0] transition-all duration-300 hover:brightness-110 active:scale-[0.98] ${
          large ? "h-16 text-lg" : "h-12"
        }`}
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
        Sepete Ekle
      </button>

      <button
        type="button"
        onClick={() => {
          addItem(product.id);
          routerPushCart();
        }}
        className={`relative z-10 overflow-hidden rounded-full border border-[#d8bf8a] bg-cover bg-center px-6 py-2 font-serif text-sm font-bold uppercase tracking-[0.16em] text-[#460e07] shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)] ${
          large ? "h-16 text-lg" : "h-12"
        }`}
        style={{ backgroundImage: "url('/cardDuvar.png')" }}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.22)_0%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-full border border-[#e0c896]/60" />

        <span className="relative z-10">Hemen Al</span>
      </button>
    </div>
  );
}

function BuyPanel({
  product,
  quantity,
  setQuantity,
  addItem,
  routerPushCart,
}: {
  product: Product;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  addItem: (id: string) => void;
  routerPushCart: () => void;
}) {
  return (
    <div className="relative w-full max-w-[760px] overflow-hidden rounded-t-[30px] px-4 pb-10 pt-4 text-center sm:px-8 md:px-12">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(246,239,221,0.15)_0%,rgba(232,220,190,0.72)_42%,rgba(246,239,221,0.22)_100%)]" />

      <div className="relative z-10 flex flex-col items-center">
        <Price
          product={product}
          className="text-[52px] sm:text-[64px] md:text-[76px]"
        />

        <div className="mt-6">
          <QuantityControl quantity={quantity} setQuantity={setQuantity} />
        </div>

        <div className="mt-8 w-full">
          <Buttons
            product={product}
            addItem={addItem}
            routerPushCart={routerPushCart}
            className="mx-auto max-w-[620px] gap-4"
          />
        </div>
      </div>
    </div>
  );
}

function Tabs({
  activeTab,
  setActiveTab,
  large = false,
}: {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  large?: boolean;
}) {
  return (
    <div className="flex justify-around pt-6">
      {[
        { label: "Hikaye", key: "hikaye" },
        { label: "Özellikler", key: "ozellikler" },
        { label: "Nasıl Servis Edilir?", key: "servis" },
      ].map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key as Tab)}
          className={`relative pb-2 font-bold uppercase tracking-[0.18em] transition ${
            large ? "text-sm" : "text-xs"
          } ${activeTab === tab.key ? "text-[#3d3020]" : "text-[#3d3020]/35"}`}
        >
          {tab.label}

          {activeTab === tab.key && (
            <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#9c5732]" />
          )}
        </button>
      ))}
    </div>
  );
}

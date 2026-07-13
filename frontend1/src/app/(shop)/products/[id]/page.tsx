"use client";

import { use, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
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

type ProductDetailSetting = {
  backgroundImage: string;
  decorImageOne: string;
  decorImageTwo: string;
  logoImage: string;
  cardTexture: string;
  labelText: string;
  addToCartText: string;
  buyNowText: string;
  quantityText: string;
  storyTabText: string;
  featuresTabText: string;
  servingTabText: string;
};

type ProductDetailActions = {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  addItem: (id: string) => void;
  routerPushCart: () => void;
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
};

const FALLBACKS = {
  bg: "/heroB.png",
  decor: "/wo.png",
  logo: "/logo.png",
  texture: "/cardDuvar.png",
};

const DEFAULT_SETTINGS: ProductDetailSetting = {
  backgroundImage: FALLBACKS.bg,
  decorImageOne: FALLBACKS.decor,
  decorImageTwo: FALLBACKS.decor,
  logoImage: FALLBACKS.logo,
  cardTexture: FALLBACKS.texture,
  labelText: "Özel Lezzet",
  addToCartText: "Sepete Ekle",
  buyNowText: "Hemen Al",
  quantityText: "Miktar",
  storyTabText: "Hikaye",
  featuresTabText: "Özellikler",
  servingTabText: "Nasıl Servis Edilir?",
};

const DESKTOP_LAYOUT = {
  lg: {
    wrapH: 520,
    viewH: "72vh",
    centerH: 640,
    centerW: "45%",
    centerLeft: "37%",
    leftW: "42%",
    rightW: "58%",
    rightPl: "32%",
    rightPr: "4%",
    title: "text-[38px]",
    desc: "text-[15px]",
    price: "text-[42px]",
    maxText: "max-w-[460px]",
    btnW: "max-w-[330px]",
    gap: "space-y-12",
    tabsPl: "51%",
    tabsPr: "4%",
    tabsMt: "-54px",
  },

  xl: {
    wrapH: 660,
    viewH: "74vh",
    centerH: 600,
    centerW: "45%",
    centerLeft: "39%",
    leftW: "48%",
    rightW: "65%",
    rightPl: "35%",
    rightPr: "5%",
    title: "text-[38px]",
    desc: "text-[17px]",
    price: "text-[50px]",
    maxText: "max-w-[520px]",
    btnW: "max-w-[380px]",
    gap: "space-y-12",
    tabsPl: "51%",
    tabsPr: "5%",
    tabsMt: "-60px",
  },

  xxl: {
    wrapH: 740,
    viewH: "85vh",
    centerH: 730,
    centerW: "46%",
    centerLeft: "39%",
    leftW: "45%",
    rightW: "55%",
    rightPl: "35%",
    rightPr: "7%",
    title: "text-[44px]",
    desc: "text-[21px]",
    price: "text-[56px]",
    maxText: "max-w-[760px]",
    btnW: "max-w-[460px]",
    gap: "space-y-10",
    tabsPl: "52%",
    tabsPr: "7%",
    tabsMt: "-70px",
  },
};

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

  const { data: settingsData } = useQuery({
    queryKey: ["product-detail-settings"],
    queryFn: async () => {
      const res = await api.get<ProductDetailSetting>(
        "/api/product-detail-settings",
      );
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

  const settings = settingsData || DEFAULT_SETTINGS;
  const productImage = product.images?.[0]?.url;

  const actions: ProductDetailActions = {
    quantity,
    setQuantity,
    addItem,
    routerPushCart: () => router.push("/cart"),
    activeTab,
    setActiveTab,
  };

  return (
    <main className="relative min-h-[90vh] overflow-hidden bg-[#f6efdd]">
      <ProductDetailBackground settings={settings} />

      <div className="relative z-10 mx-auto w-full max-w-[2200px] px-4 pb-8 pt-20 min-[445px]:px-5 min-[445px]:pt-24 sm:px-6 sm:pt-28 md:px-8 md:pt-36 lg:px-8 lg:pt-20 xl:px-12 2xl:px-16">
        <div className="flex flex-col items-center lg:hidden">
          <ProductInfoMobile
            product={product}
            productImage={productImage}
            actions={actions}
            settings={settings}
          />
        </div>

        <ResponsiveDesktopLayout
          product={product}
          productImage={productImage}
          actions={actions}
          settings={settings}
        />
      </div>
    </main>
  );
}

function ProductDetailBackground({
  settings,
}: {
  settings: ProductDetailSetting;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: `url('${settings.backgroundImage || FALLBACKS.bg}')`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[1] lg:hidden">
        <img
          src={settings.decorImageOne || FALLBACKS.decor}
          alt=""
          className="absolute left-[-6%] top-[8%] w-[58%] opacity-[0.12] mix-blend-multiply min-[445px]:left-[20%] min-[445px]:top-[25%] min-[445px]:w-[18%] md:left-[2%] md:top-[15%] md:w-[34%]"
        />

        <img
          src={settings.decorImageTwo || FALLBACKS.decor}
          alt=""
          className="absolute left-[-8%] top-[50%] w-[54%] rotate-[10deg] opacity-[0.10] mix-blend-multiply min-[445px]:left-[2%] min-[445px]:w-[36%] md:left-[2%] md:top-[60%] md:w-[30%]"
        />

        <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-[linear-gradient(to_bottom,transparent,rgba(205,190,148,0.20),rgba(246,239,221,0.10))]" />
      </div>
    </>
  );
}

function ProductInfoMobile({
  product,
  productImage,
  actions,
  settings,
}: {
  product: Product;
  productImage?: string;
  actions: ProductDetailActions;
  settings: ProductDetailSetting;
}) {
  return (
    <>
      <Label settings={settings} />

      <div className="mb-6 mt-7 text-center">
        <h1 className="font-serif text-[44px] font-extrabold uppercase leading-none tracking-wide text-[#2c1a0e] min-[445px]:text-[44px] sm:text-[44px] md:text-[52px]">
          {product.name}
        </h1>

        {product.description && (
          <p className="mx-auto mt-3 max-w-[520px] font-serif text-[22px] italic leading-snug text-[#3d2b1d] min-[445px]:text-[25px] sm:text-[28px] md:text-[32px]">
            {product.description}
          </p>
        )}
      </div>

      <div className="relative mb-8 h-[340px] w-full max-w-[620px] min-[445px]:h-[390px] sm:h-[440px] md:h-[520px] md:max-w-[760px]">
        <ImageCard
          product={product}
          productImage={productImage}
          settings={settings}
        />
      </div>

      <BuyPanel product={product} actions={actions} settings={settings} />

      <div className="mt-8 w-full max-w-[760px]">
        <Tabs
          activeTab={actions.activeTab}
          setActiveTab={actions.setActiveTab}
          settings={settings}
        />

        <TabContent
          product={product}
          activeTab={actions.activeTab}
          className="mt-5 text-center"
        />
      </div>
    </>
  );
}

function ResponsiveDesktopLayout({
  product,
  productImage,
  actions,
  settings,
}: {
  product: Product;
  productImage?: string;
  actions: ProductDetailActions;
  settings: ProductDetailSetting;
}) {
  return (
    <>
      <div className="hidden lg:block xl:hidden">
        <DesktopLayout
          product={product}
          productImage={productImage}
          actions={actions}
          variant="lg"
          settings={settings}
        />
      </div>

      <div className="hidden xl:block 2xl:hidden">
        <DesktopLayout
          product={product}
          productImage={productImage}
          actions={actions}
          variant="xl"
          settings={settings}
        />
      </div>

      <div className="hidden 2xl:block">
        <DesktopLayout
          product={product}
          productImage={productImage}
          actions={actions}
          variant="xxl"
          settings={settings}
        />
      </div>
    </>
  );
}

function DesktopLayout({
  product,
  productImage,
  actions,
  variant,
  settings,
}: {
  product: Product;
  productImage?: string;
  actions: ProductDetailActions;
  variant: DesktopVariant;
  settings: ProductDetailSetting;
}) {
  const size = DESKTOP_LAYOUT[variant];

  return (
    <div className="flex flex-col">
      <div
        className="relative flex w-full items-center"
        style={{
          minHeight: size.wrapH,
          height: size.viewH,
        }}
      >
        <div
          className="relative"
          style={{
            width: size.leftW,
            minHeight: size.wrapH,
            height: "100%",
          }}
        >
          <DecorPanel settings={settings} />
        </div>

        <div
          className="relative"
          style={{
            width: size.rightW,
            minHeight: size.wrapH,
            height: "100%",
          }}
        >
          <div
            className="absolute right-0 top-1/2 flex w-full -translate-y-1/2 flex-col justify-center"
            style={{
              height: size.centerH,
              paddingLeft: size.rightPl,
              paddingRight: size.rightPr,
            }}
          >
            <div className={`${size.maxText} ${size.gap}`}>
              <Label settings={settings} />

              <div className="space-y-3">
                <h1
                  className={`font-serif font-extrabold uppercase leading-tight tracking-wide text-[#2c1a0e] ${size.title}`}
                >
                  {product.name}
                </h1>

                {product.description && (
                  <p
                    className={`font-serif italic leading-relaxed text-[#5e4734] ${size.desc}`}
                  >
                    {product.description}
                  </p>
                )}
              </div>

              <Price product={product} className={size.price} />

              <QuantityControl
                quantity={actions.quantity}
                setQuantity={actions.setQuantity}
                large={variant === "xxl"}
                settings={settings}
              />

              <Buttons
                product={product}
                addItem={actions.addItem}
                routerPushCart={actions.routerPushCart}
                className={size.btnW}
                large={variant === "xxl"}
                settings={settings}
              />
            </div>
          </div>
        </div>

        <div
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: size.centerLeft,
            width: size.centerW,
            height: size.centerH,
          }}
        >
          <ImageCard
            product={product}
            productImage={productImage}
            desktop
            settings={settings}
          />
        </div>
      </div>

      <div
        className="relative z-10"
        style={{
          marginTop: size.tabsMt,
          paddingLeft: size.tabsPl,
          paddingRight: size.tabsPr,
        }}
      >
        <Tabs
          activeTab={actions.activeTab}
          setActiveTab={actions.setActiveTab}
          large={variant === "xxl"}
          settings={settings}
        />

        <TabContent
          product={product}
          activeTab={actions.activeTab}
          className="mt-5"
        />
      </div>
    </div>
  );
}

function DecorPanel({ settings }: { settings: ProductDetailSetting }) {
  return (
    <>
      <img
        src={settings.decorImageOne || FALLBACKS.decor}
        alt=""
        className="pointer-events-none absolute left-[6%] top-[-2%] z-0 w-[35%] opacity-10 mix-blend-multiply"
      />

      <img
        src={settings.decorImageTwo || FALLBACKS.decor}
        alt=""
        className="pointer-events-none absolute left-[4%] top-[48%] z-0 w-[35%] rotate-[8deg] opacity-[0.08] mix-blend-multiply"
      />
    </>
  );
}

function Label({ settings }: { settings: ProductDetailSetting }) {
  return (
    <div className="relative inline-block">
      <div
        className="relative z-10 overflow-hidden rounded border border-[#d8bf8a] bg-cover bg-center px-6 py-2 font-serif text-sm font-bold uppercase tracking-[0.16em] text-[#460e07] shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)] 2xl:px-8 2xl:py-3 2xl:text-base"
        style={{
          backgroundImage: `url('${settings.cardTexture || FALLBACKS.texture}')`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.22)_0%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-sm border border-[#e0c896]/60" />

        <span className="relative z-10">
          {settings.labelText || "Özel Lezzet"}
        </span>
      </div>

      <div className="absolute -bottom-1 -right-1 h-full w-full rounded-sm bg-[#3d3020]/20" />
    </div>
  );
}

function ImageCard({
  product,
  productImage,
  desktop = false,
  settings,
}: {
  product: Product;
  productImage?: string;
  desktop?: boolean;
  settings: ProductDetailSetting;
}) {
  return (
    <>
      <ProductCard
        product={{ ...product, images: [] }}
        clickable={false}
        embossed
        wallTexture={settings.cardTexture || FALLBACKS.texture}
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
          className={`pointer-events-none relative z-30 object-contain drop-shadow-[0_34px_58px_rgba(45,28,12,0.42)] ${
            desktop ? "p-10 xl:p-12 2xl:p-16" : "p-7 sm:p-10 md:p-12"
          }`}
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
        ₺{Number(product.price).toLocaleString("tr-TR")}
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
  settings,
}: {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  large?: boolean;
  settings: ProductDetailSetting;
}) {
  const buttonSize = large ? "h-10 w-10" : "h-8 w-8";
  const numberSize = large ? "w-10 text-base" : "w-8 text-sm";

  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d3020]/45 2xl:text-[13px]">
        {settings.quantityText || "Miktar"}
      </span>

      <div className="mt-3 flex w-fit items-center gap-3 rounded-full border border-[#d8bf8a]/70 bg-[#efe3cf]/70 p-1.5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.55),inset_0_-3px_8px_rgba(160,126,78,0.14)]">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={`flex items-center justify-center rounded-full bg-[#6a5234] text-lg font-bold text-[#f2e7d2] ${buttonSize}`}
        >
          −
        </button>

        <span className={`text-center font-black text-[#2c1a0e] ${numberSize}`}>
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className={`flex items-center justify-center rounded-full bg-[#6a5234] text-lg font-bold text-[#f2e7d2] ${buttonSize}`}
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
  settings,
}: {
  product: Product;
  addItem: (id: string) => void;
  routerPushCart: () => void;
  className?: string;
  large?: boolean;
  settings: ProductDetailSetting;
}) {
  const heightClass = large ? "h-16 text-lg" : "h-12";

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => addItem(product.id)}
        className={`relative overflow-hidden rounded-full border-2 border-transparent font-bold uppercase tracking-[0.18em] text-[#e8dcc0] transition-all duration-300 hover:brightness-110 active:scale-[0.98] ${heightClass}`}
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
        {settings.addToCartText || "Sepete Ekle"}
      </button>

      <button
        type="button"
        onClick={() => {
          addItem(product.id);
          routerPushCart();
        }}
        className={`relative z-10 overflow-hidden rounded-full border border-[#d8bf8a] bg-cover bg-center px-6 py-2 font-serif text-sm font-bold uppercase tracking-[0.16em] text-[#460e07] shadow-[0_10px_18px_rgba(120,92,58,0.16),0_3px_0_rgba(190,166,118,0.35),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.12)] ${heightClass}`}
        style={{
          backgroundImage: `url('${settings.cardTexture || FALLBACKS.texture}')`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.52),rgba(214,194,160,0.12))]" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.22)_0%,transparent_45%)]" />
        <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-full border border-[#e0c896]/60" />

        <span className="relative z-10">
          {settings.buyNowText || "Hemen Al"}
        </span>
      </button>
    </div>
  );
}

function BuyPanel({
  product,
  actions,
  settings,
}: {
  product: Product;
  actions: ProductDetailActions;
  settings: ProductDetailSetting;
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
          <QuantityControl
            quantity={actions.quantity}
            setQuantity={actions.setQuantity}
            settings={settings}
          />
        </div>

        <div className="mt-8 w-full">
          <Buttons
            product={product}
            addItem={actions.addItem}
            routerPushCart={actions.routerPushCart}
            className="mx-auto max-w-[620px] gap-4"
            settings={settings}
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
  settings,
}: {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  large?: boolean;
  settings: ProductDetailSetting;
}) {
  const tabs: { label: string; key: Tab }[] = [
    { label: settings.storyTabText || "Hikaye", key: "hikaye" },
    { label: settings.featuresTabText || "Özellikler", key: "ozellikler" },
    { label: settings.servingTabText || "Nasıl Servis Edilir?", key: "servis" },
  ];

  return (
    <div className="flex items-center justify-between gap-5 overflow-x-auto sm:gap-10">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key)}
          className={`relative whitespace-nowrap pb-3 font-bold uppercase tracking-[0.22em] transition sm:tracking-[0.28em] ${
            large ? "text-sm" : "text-xs"
          } ${
            activeTab === tab.key
              ? "text-[#3d3020]"
              : "text-[#3d3020]/35 hover:text-[#3d3020]/60"
          }`}
        >
          {tab.label}

          {activeTab === tab.key && (
            <span className="absolute bottom-[-1px] left-0 h-[3px] w-full bg-[#9c5732]" />
          )}
        </button>
      ))}
    </div>
  );
}

function TabContent({
  product,
  activeTab,
  className = "",
}: {
  product: Product;
  activeTab: Tab;
  className?: string;
}) {
  const contentMap: Record<Tab, string> = {
    hikaye: product.story || "Bu ürün için henüz hikaye bilgisi eklenmedi.",
    ozellikler:
      product.features || "Bu ürün için henüz özellik bilgisi eklenmedi.",
    servis:
      product.servingSuggestion ||
      "Bu ürün için henüz servis önerisi eklenmedi.",
  };

  return (
    <div
      className={`rounded-[18px] bg-[#efe3cf]/40 p-4 text-sm leading-relaxed text-[#5e4734] shadow-[inset_0_1px_2px_rgba(255,255,255,0.45)] 2xl:text-base ${className}`}
    >
      {contentMap[activeTab]}
    </div>
  );
}

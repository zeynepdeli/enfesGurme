"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  productId: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  usd: string;
  emoji: string;
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Çiğ Antep Fıstığı",
    description: "Gaziantep'in en kaliteli boz iç fıstığı.",
    price: 1350,
    usd: "4,30 USD/TL",
    emoji: "🥜",
  },
  {
    id: "2",
    name: "Divle Obruk Peyniri",
    description: "Toros mağaralarında olgunlaşan eşsiz peynir.",
    price: 2500,
    usd: "4,90 USD/TL",
    emoji: "🧀",
  },
];

const SHIPPING = 250;
const HEADER_HEIGHT = 116;

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([
    { productId: "1", quantity: 1 },
    { productId: "2", quantity: 1 },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id: string, q: number) => {
    if (q < 1) return;

    setItems((prev) =>
      prev.map((i) => (i.productId === id ? { ...i, quantity: q } : i)),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== id));
  };

  const summary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const p = PRODUCTS.find((x) => x.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    return {
      subtotal,
      total: subtotal + SHIPPING,
      count: items.reduce((a, b) => a + b.quantity, 0),
    };
  }, [items]);

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#f6efdd]"
      style={{ paddingTop: HEADER_HEIGHT }}
    >
      {/* GLOBAL BG */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-multiply">
        <img
          src="/heroB.png"
          alt=""
          className="fixed h-full w-full object-cover"
        />
      </div>

      {/* GLOBAL WO DECOR */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <img
          src="/wo.png"
          alt=""
          className="
            absolute left-[-18%] top-[18%]
            w-[70%] opacity-[0.08] mix-blend-multiply
            sm:left-[-12%] sm:w-[52%]
            md:left-[-8%] md:w-[42%]
            lg:left-[3%] lg:top-[4%] lg:w-[18%]
            xl:w-[20%]
            2xl:w-[22%]
          "
        />

        <img
          src="/wo.png"
          alt=""
          className="
            absolute left-[-10%] top-[58%]
            w-[64%] rotate-[10deg] opacity-[0.07] mix-blend-multiply
            sm:left-[0%] sm:w-[48%]
            md:left-[2%] md:w-[36%]
            lg:left-[8%] lg:top-[44%] lg:w-[18%]
            xl:w-[20%]
            2xl:w-[22%]
          "
        />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-116px)]">
        {/* DESKTOP LEFT PANEL */}
        <aside
          className="
            sticky hidden shrink-0 overflow-hidden
            lg:flex lg:w-[220px]
            xl:w-[260px]
            2xl:w-[320px]
          "
          style={{
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <DecorPanel />
        </aside>

        {/* CONTENT */}
        <main
          className="
            flex-1
            px-3 pb-10 pt-8
            sm:px-5 sm:pt-10
            md:px-6
            lg:px-8 lg:pb-8 lg:pt-10
            xl:px-10
            2xl:px-14
          "
        >
          <div className="mx-auto w-full max-w-[1800px]">
            {/* MOBILE / TABLET DECOR BANNER */}
            <div className="mb-6 block lg:hidden">
              <div className="relative h-[92px] overflow-hidden rounded-[22px] sm:h-[120px] md:h-[145px]">
                <DecorPanel />
              </div>
            </div>

            {/* HEADER */}
            <div
              className="
                mb-6 flex flex-col gap-3
                border-b border-[#3d3020]/10 pb-5
                sm:mb-7 sm:flex-row sm:items-end sm:justify-between
                md:mb-8
                xl:mb-10
              "
            >
              <div>
                <span
                  className="
                    text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]
                    sm:text-[11px]
                    2xl:text-[13px]
                  "
                >
                  Alışveriş Sepeti
                </span>

                <h1
                  className="
                    mt-2 font-serif text-[34px] font-black italic leading-none text-[#2c1a0e]
                    sm:text-[42px]
                    md:text-[50px]
                    xl:text-[58px]
                    2xl:text-[72px]
                  "
                >
                  Sepetim ({summary.count})
                </h1>
              </div>
            </div>

            <div
              className="
                grid gap-8
                lg:grid-cols-[1fr_340px] lg:gap-8
                xl:grid-cols-[1fr_400px] xl:gap-12
                2xl:grid-cols-[1fr_470px] 2xl:gap-16
              "
            >
              {/* PRODUCTS */}
              <section className="space-y-4 sm:space-y-5 2xl:space-y-7">
                {items.map((item) => {
                  const p = PRODUCTS.find((x) => x.id === item.productId);
                  if (!p) return null;

                  return (
                    <CartProductCard
                      key={p.id}
                      product={p}
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(p.id, item.quantity + 1)}
                      onDecrease={() => updateQuantity(p.id, item.quantity - 1)}
                      onRemove={() => removeItem(p.id)}
                    />
                  );
                })}
              </section>

              {/* SUMMARY */}
              <aside>
                <div
                  className="
                    relative overflow-hidden rounded-[20px]
                    border border-[#d0bc90]
                    bg-[#efe6cf]
                    p-5
                    shadow-[0_14px_28px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
                    sm:p-6
                    lg:sticky lg:top-36
                    xl:p-7
                    2xl:rounded-[24px] 2xl:p-9
                  "
                >
                  <CardBg />

                  <div className="relative z-10">
                    <h2
                      className="
                        border-b border-[#3d3020]/10 pb-4
                        font-serif text-[24px] font-black italic text-[#7a3b1e]
                        xl:text-[28px]
                        2xl:text-[36px]
                      "
                    >
                      Sipariş Özeti
                    </h2>

                    <div className="mt-6 space-y-4 text-sm 2xl:mt-8 2xl:space-y-5 2xl:text-base">
                      <div className="flex justify-between text-[#5e4734]">
                        <span>Ara Toplam</span>
                        <span>₺{summary.subtotal.toLocaleString("tr-TR")}</span>
                      </div>

                      <div className="flex justify-between text-[#5e4734]">
                        <span>Kargo</span>
                        <span>₺{SHIPPING}</span>
                      </div>

                      <div className="flex justify-between border-t border-[#3d3020]/10 pt-4 text-lg font-black text-[#2c1a0e] 2xl:text-2xl">
                        <span>Toplam</span>
                        <span className="text-[#7a3b1e]">
                          ₺{summary.total.toLocaleString("tr-TR")}
                        </span>
                      </div>
                    </div>

                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promosyon kodu"
                      className="
                        mt-6 w-full rounded-full
                        border border-[#bc7b56]
                        bg-[#fff5ea]/70 px-4 py-3
                        text-sm text-[#2c1a0e]
                        outline-none
                        placeholder:text-[#7a5a46]/55
                        focus:border-[#a95f38]
                        2xl:mt-8 2xl:px-5 2xl:py-4 2xl:text-base
                      "
                    />

                    <Button
                      onClick={() => router.push("/checkout")}
                      className="
                        mt-6 h-14 w-full overflow-hidden rounded-full
                        border-2 border-transparent
                        bg-transparent
                        text-[11px] font-bold uppercase tracking-[0.18em]
                        text-[#e8dcc0]
                        shadow-none
                        transition-all duration-300
                        hover:brightness-110
                        2xl:mt-8 2xl:h-16 2xl:text-sm
                      "
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
                      Ödemeye Geç <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <button
                      onClick={() => router.push("/products")}
                      className="
                        mt-4 w-full text-sm font-semibold text-[#6b3f18]/65
                        transition hover:text-[#6b3f18]
                        2xl:mt-6 2xl:text-base
                      "
                    >
                      Alışverişe devam et
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function CartProductCard({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="
        relative overflow-hidden rounded-[18px]
        border border-[#d0bc90]
        bg-[#efe6cf]
        p-3
        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
        sm:p-5
        md:p-6
        xl:p-7
        2xl:rounded-[24px] 2xl:p-9
      "
    >
      <CardBg />

      <div
        className="
          relative z-10 flex items-center gap-3
          sm:gap-5
          xl:gap-6
          2xl:gap-8
        "
      >
        {/* IMAGE */}
        <div
          className="
            flex shrink-0 items-center justify-center
            overflow-hidden rounded-2xl
            bg-cover bg-center
            text-[32px]
            shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.20)]
            h-[76px] w-[76px]
            xs:h-[82px] xs:w-[82px]
            sm:h-[100px] sm:w-[100px] sm:text-[42px]
            md:h-[112px] md:w-[112px]
            xl:h-[128px] xl:w-[128px] xl:text-[50px]
            2xl:h-[154px] 2xl:w-[154px] 2xl:text-[60px]
          "
          style={{
            backgroundImage: "url('/bkrr.png')",
          }}
        >
          {product.emoji}
        </div>

        {/* RIGHT CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="
                  line-clamp-2 font-serif text-[13px] font-black uppercase leading-snug tracking-wide text-[#2c1a0e]
                  sm:text-[18px]
                  xl:text-[22px]
                  2xl:text-[28px]
                "
              >
                {product.name}
              </h3>

              <p
                className="
                  mt-1 line-clamp-2 max-w-[520px]
                  text-[11px] leading-relaxed text-[#5e4734]/75
                  sm:text-sm
                  xl:text-[15px]
                  2xl:mt-2 2xl:max-w-[720px] 2xl:text-[17px]
                "
              >
                {product.description}
              </p>
            </div>

            <button
              onClick={onRemove}
              className="
                flex shrink-0 items-center justify-center
                rounded-full border border-[#d8bf8a]/70
                bg-[#efe3cf]/70
                text-[#6b3f18]/55
                transition hover:border-red-200 hover:bg-red-50 hover:text-red-500
                h-8 w-8
                sm:h-10 sm:w-10
                2xl:h-12 2xl:w-12
              "
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 2xl:h-5 2xl:w-5" />
            </button>
          </div>

          <div
            className="
              mt-3 flex items-center justify-between gap-3
              sm:mt-4
              xl:mt-5
              2xl:mt-7
            "
          >
            <QuantityControl
              quantity={quantity}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />

            <span
              className="
                whitespace-nowrap text-[15px] font-black text-[#a67c3d]
                sm:text-xl
                xl:text-[24px]
                2xl:text-[32px]
              "
            >
              ₺{(product.price * quantity).toLocaleString("tr-TR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div
      className="
        flex items-center rounded-full
        border border-[#d8bf8a]/70
        bg-[#efe3cf]/70 p-1
        shadow-[inset_0_2px_4px_rgba(255,255,255,0.55),inset_0_-3px_8px_rgba(160,126,78,0.14)]
        2xl:p-1.5
      "
    >
      <button
        onClick={onDecrease}
        className="
          flex items-center justify-center rounded-full
          text-[#6b3f18] transition
          hover:bg-[#6a5234] hover:text-[#f2e7d2]
          h-7 w-7
          sm:h-8 sm:w-8
          2xl:h-10 2xl:w-10
        "
      >
        <Minus size={13} />
      </button>

      <span className="w-7 text-center text-xs font-black text-[#2c1a0e] sm:w-9 sm:text-sm 2xl:w-11 2xl:text-base">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        className="
          flex items-center justify-center rounded-full
          text-[#6b3f18] transition
          hover:bg-[#6a5234] hover:text-[#f2e7d2]
          h-7 w-7
          sm:h-8 sm:w-8
          2xl:h-10 2xl:w-10
        "
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

function CardBg() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />
      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[14px] border border-[#d6c49a]/70 2xl:inset-[8px] 2xl:rounded-[18px]" />
    </>
  );
}

function DecorPanel() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#efe3cb_0%,#e8dcc4_14%,#c9c29d_36%,#b7b08a_52%,#cec6a3_70%,#e7dbc3_88%,#efe3cb_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_34%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,248,236,0.18),transparent_38%)]" />

      <img
        src="/wo.png"
        alt=""
        className="
          absolute left-[8%] top-[-6%]
          w-[72%]
          opacity-[0.11]
          mix-blend-multiply
          lg:w-[76%]
          2xl:w-[70%]
        "
      />

      <img
        src="/wo.png"
        alt=""
        className="
          absolute left-[25%] top-[42%]
          w-[62%] rotate-[10deg]
          opacity-[0.09]
          mix-blend-multiply
          lg:w-[68%]
          2xl:w-[62%]
        "
      />
    </>
  );
}

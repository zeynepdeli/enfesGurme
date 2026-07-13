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

      <div className="relative z-10 flex min-h-[calc(100vh-116px)]">
        {/* SOL PANEL */}
        <aside
          className="
            sticky hidden shrink-0 overflow-hidden
            px-4 py-6
            lg:flex lg:w-[240px] lg:flex-col lg:justify-between
          "
          style={{
            top: HEADER_HEIGHT,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#efe3cb_0%,#e8dcc4_14%,#c9c29d_36%,#b7b08a_52%,#cec6a3_70%,#e7dbc3_88%,#efe3cb_100%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.32),transparent_34%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,248,236,0.18),transparent_38%)]" />

          <img
            src="/wo.png"
            alt=""
            className="absolute left-[8%] top-[-6%] w-[72%] opacity-[0.11] mix-blend-multiply"
          />

          <img
            src="/wo.png"
            alt=""
            className="absolute left-[25%] top-[42%] w-[62%] rotate-[10deg] opacity-[0.09] mix-blend-multiply"
          />
        </aside>

        {/* İÇERİK */}
        <main className="flex-1 px-5 pb-2 pt-10 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1680px]">
            {/* BAŞLIK */}
            <div className="mb-4 flex flex-col gap-3 border-b border-[#3d3020]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
                  Alışveriş Sepeti
                </span>

                <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e] md:text-5xl">
                  Sepetim ({summary.count})
                </h1>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_380px] xl:gap-14">
              {/* ÜRÜNLER */}
              <section className="space-y-5">
                {items.map((item) => {
                  const p = PRODUCTS.find((x) => x.id === item.productId);
                  if (!p) return null;

                  return (
                    <div
                      key={p.id}
                      className="
                        relative overflow-hidden rounded-[18px]
                        border border-[#d0bc90]
                        bg-[#efe6cf]
                        p-5
                        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
                        sm:p-6
                      "
                    >
                      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

                      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[14px] border border-[#d6c49a]/70" />

                      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
                        {/* GÖRSEL */}
                        <div
                          className="
                            flex h-24 w-24 shrink-0 items-center justify-center
                            overflow-hidden rounded-2xl
                            bg-cover bg-center text-4xl
                            shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.20)]
                          "
                          style={{
                            backgroundImage: "url('/bkrr.png')",
                          }}
                        >
                          {p.emoji}
                        </div>

                        {/* BİLGİ */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-serif text-lg font-black uppercase tracking-wide text-[#2c1a0e]">
                            {p.name}
                          </h3>

                          <p className="mt-1 max-w-[480px] text-sm leading-relaxed text-[#5e4734]/75">
                            {p.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-5">
                            <div
                              className="
                                flex items-center rounded-full
                                border border-[#d8bf8a]/70
                                bg-[#efe3cf]/70 p-1
                                shadow-[inset_0_2px_4px_rgba(255,255,255,0.55),inset_0_-3px_8px_rgba(160,126,78,0.14)]
                              "
                            >
                              <button
                                onClick={() =>
                                  updateQuantity(p.id, item.quantity - 1)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b3f18] transition hover:bg-[#6a5234] hover:text-[#f2e7d2]"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="w-9 text-center text-sm font-black text-[#2c1a0e]">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(p.id, item.quantity + 1)
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6b3f18] transition hover:bg-[#6a5234] hover:text-[#f2e7d2]"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* SAĞ */}
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <span className="text-xl font-black text-[#a67c3d]">
                            ₺{(p.price * item.quantity).toLocaleString("tr-TR")}
                          </span>

                          <button
                            onClick={() => removeItem(p.id)}
                            className="
                              flex h-10 w-10 items-center justify-center
                              rounded-full border border-[#d8bf8a]/70
                              bg-[#efe3cf]/70
                              text-[#6b3f18]/55
                              transition hover:border-red-200 hover:bg-red-50 hover:text-red-500
                            "
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* SİPARİŞ ÖZETİ */}
              <aside>
                <div
                  className="
                    sticky top-36 overflow-hidden rounded-[20px]
                    border border-[#d0bc90]
                    bg-[#efe6cf]
                    p-6
                    shadow-[0_14px_28px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
                  "
                >
                  <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

                  <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

                  <div className="relative z-10">
                    <h2 className="border-b border-[#3d3020]/10 pb-4 font-serif text-2xl font-black italic text-[#7a3b1e]">
                      Sipariş Özeti
                    </h2>

                    <div className="mt-6 space-y-4 text-sm">
                      <div className="flex justify-between text-[#5e4734]">
                        <span>Ara Toplam</span>
                        <span>₺{summary.subtotal.toLocaleString("tr-TR")}</span>
                      </div>

                      <div className="flex justify-between text-[#5e4734]">
                        <span>Kargo</span>
                        <span>₺{SHIPPING}</span>
                      </div>

                      <div className="flex justify-between border-t border-[#3d3020]/10 pt-4 text-lg font-black text-[#2c1a0e]">
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
                      "
                    />

                    <Button
                      onClick={() => router.push("/checkout")}
                      className="
                        mt-6 h-14 w-full overflow-hidden rounded-full
                        border-2 border-transparent
                        bg-transparent
                        text-xs font-bold uppercase tracking-[0.18em]
                        text-[#e8dcc0]
                        shadow-none
                        transition-all duration-300
                        hover:brightness-110
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
                      className="mt-4 w-full text-sm font-semibold text-[#6b3f18]/65 transition hover:text-[#6b3f18]"
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

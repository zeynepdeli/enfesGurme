"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { CheckCircle2, Package, MapPin, ArrowRight } from "lucide-react";

const HEADER_HEIGHT = 116;
const SIDEBAR_WIDTH = 240;

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function SidePanel() {
  return (
    <aside
      className="
        fixed left-0 z-20 hidden overflow-hidden
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
        className="
          absolute left-[8%] top-[-6%]
          w-[72%]
          opacity-[0.11]
          mix-blend-multiply
        "
      />

      <img
        src="/wo.png"
        alt=""
        className="
          absolute left-[25%] top-[42%]
          w-[62%]
          rotate-[10deg]
          opacity-[0.09]
          mix-blend-multiply
        "
      />

      <div className="relative z-10 mt-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6b3f18]/70">
          Enfes Gurme
        </span>

        <h2 className="mt-3 font-serif text-3xl font-black italic leading-tight text-[#2c1a0e]">
          Sipariş Başarılı
        </h2>
      </div>

      <div className="relative z-10 mb-4 h-20 w-20 opacity-[0.08]">
        <img src="/logo.png" alt="" className="h-full w-full object-contain" />
      </div>
    </aside>
  );
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [show, setShow] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("iyzico_form");
    sessionStorage.removeItem("iyzico_token");
    sessionStorage.removeItem("iyzico_order_id");

    const t = setTimeout(() => setShow(true), 100);

    return () => clearTimeout(t);
  }, []);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get<Order>(`/api/orders/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

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

      <SidePanel />

      <div
        className="relative z-10 min-h-[calc(100vh-116px)] lg:pl-[240px]"
        style={
          {
            "--sidebar-width": `${SIDEBAR_WIDTH}px`,
          } as React.CSSProperties
        }
      >
        <div className="flex min-h-[calc(100vh-116px)] items-center justify-center px-4 py-12">
          <div
            className={`
              w-full max-w-2xl transition-all duration-700

              ${show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
            `}
          >
            {/* SUCCESS ICON */}
            <div className="mb-7 flex justify-center">
              <div
                className="
                  relative flex h-24 w-24 items-center justify-center

                  overflow-hidden rounded-full

                  border border-[#d8bf8a]

                  bg-cover bg-center

                  shadow-[0_12px_28px_rgba(120,92,58,0.18),inset_0_2px_5px_rgba(255,230,200,0.28)]
                "
                style={{
                  backgroundImage: "url('/bkrr.png')",
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,252,245,0.26),rgba(214,194,160,0.06))]" />

                <CheckCircle2
                  className="relative z-10 text-[#f6efdd]"
                  size={46}
                />
              </div>
            </div>

            {/* TITLE */}
            <div className="mb-9 text-center">
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
                Sipariş Tamamlandı
              </span>

              <h1 className="mt-3 font-serif text-4xl font-black italic text-[#2c1a0e] md:text-5xl">
                Siparişiniz Alındı
              </h1>

              <p className="mx-auto mt-4 max-w-[560px] text-sm leading-relaxed text-[#5e4734]/65">
                Siparişiniz başarıyla oluşturuldu. Ürünleriniz özenle hazırlanıp
                en kısa sürede kargoya verilecektir.
              </p>
            </div>

            {/* ORDER CARD */}
            {!isLoading && order && (
              <div
                className="
                  relative overflow-hidden rounded-[24px]

                  border border-[#d0bc90]

                  bg-[#efe6cf]

                  shadow-[0_14px_30px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
                "
              >
                {/* BG */}
                <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

                {/* INNER BORDER */}
                <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[18px] border border-[#d6c49a]/70" />

                <div className="relative z-10">
                  {/* HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3d3020]/10 px-7 py-6">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3d3020]/40">
                        Sipariş No
                      </span>

                      <p className="mt-1 font-mono text-lg font-black text-[#2c1a0e]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#3d3020]/40">
                        Tarih
                      </span>

                      <p className="mt-1 text-sm font-semibold text-[#5e4734]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div className="border-b border-[#3d3020]/10 px-7 py-6">
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#3d3020]/40">
                      Sipariş İçeriği
                    </p>

                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="
                            flex items-center gap-4 rounded-[16px]

                            border border-[#d0bc90]/70

                            bg-[#efe3cf]/70

                            p-4
                          "
                        >
                          {/* ICON */}
                          <div
                            className="
                              flex h-12 w-12 shrink-0 items-center justify-center

                              overflow-hidden rounded-full

                              bg-cover bg-center

                              text-[#2c1a0e]

                              shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.20)]
                            "
                            style={{
                              backgroundImage: "url('/bkrr.png')",
                            }}
                          >
                            <Package size={18} />
                          </div>

                          {/* INFO */}
                          <div className="min-w-0 flex-1">
                            <p className="font-serif text-sm font-black text-[#2c1a0e]">
                              {item.product.name}
                            </p>

                            <p className="mt-1 text-xs text-[#5e4734]/60">
                              {item.quantity} adet
                            </p>
                          </div>

                          {/* PRICE */}
                          <span className="shrink-0 font-black text-[#7a3b1e]">
                            ₺
                            {(
                              Number(item.price) * item.quantity
                            ).toLocaleString("tr-TR")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="border-b border-[#3d3020]/10 px-7 py-6">
                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#3d3020]/40">
                      Teslimat Adresi
                    </p>

                    <div className="flex items-start gap-4">
                      <div
                        className="
                          flex h-11 w-11 shrink-0 items-center justify-center

                          overflow-hidden rounded-full

                          bg-cover bg-center

                          text-[#2c1a0e]

                          shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.20)]
                        "
                        style={{
                          backgroundImage: "url('/bkrr.png')",
                        }}
                      >
                        <MapPin size={18} />
                      </div>

                      <div>
                        <p className="font-serif text-base font-black text-[#2c1a0e]">
                          {order.address.title}
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-[#5e4734]/65">
                          {order.address.address}, {order.address.district} /{" "}
                          {order.address.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="flex items-center justify-between px-7 py-6">
                    <span className="font-serif text-xl font-black italic text-[#2c1a0e]">
                      Toplam
                    </span>

                    <span className="text-3xl font-black text-[#7a3b1e]">
                      ₺{Number(order.total).toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* ORDERS */}
              <button
                onClick={() => router.push("/orders")}
                className="
                  relative h-14 flex-1 overflow-hidden rounded-full

                  border-2 border-transparent

                  font-bold uppercase tracking-[0.18em]

                  text-[#e8dcc0]

                  transition-all duration-300

                  hover:brightness-110
                  active:scale-[0.98]
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
                <span className="flex items-center justify-center gap-2">
                  Siparişlerime Git
                  <ArrowRight size={16} />
                </span>
              </button>

              {/* CONTINUE */}
              <button
                onClick={() => router.push("/products")}
                className="
                  h-14 flex-1 rounded-full

                  border border-[#bc7b56]

                  bg-[#fff5ea]/60

                  text-sm font-bold uppercase tracking-[0.18em]

                  text-[#6b3f18]

                  transition-all duration-300

                  hover:bg-[#efe3cf]
                "
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

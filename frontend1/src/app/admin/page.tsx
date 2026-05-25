"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  ShoppingCart,
  Users,
  LayoutGrid,
  ImageIcon,
  Plus,
  Star,
  Sparkles,
} from "lucide-react";

import StatsCard from "@/components/admin/dashboard/stats-card";
import SalesChart from "@/components/admin/dashboard/sales-chart";
import LowStockAlert from "@/components/admin/dashboard/low-stock-alert";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const router = useRouter();

  const menu = [
    {
      title: "Ürünler",
      icon: Package,
      href: "/admin/products",
      desc: "Ürünleri yönet",
    },
    {
      title: "Siparişler",
      icon: ShoppingCart,
      href: "/admin/orders",
      desc: "Siparişleri görüntüle",
    },
    {
      title: "Kategoriler",
      icon: LayoutGrid,
      href: "/admin/categories",
      desc: "Kategori düzenle",
    },
    {
      title: "Kullanıcılar",
      icon: Users,
      href: "/admin/users",
      desc: "Kullanıcıları yönet",
    },
    {
      title: "Slider",
      icon: ImageIcon,
      href: "/admin/hero-slides",
      desc: "Ana sayfa slider",
    },
    {
      title: "Öne Çıkan Kartlar",
      icon: Sparkles,
      href: "/admin/featured-cards",
      desc: "Hero altı kartları yönet",
    },
    {
      title: "En Çok Satan Kartlar",
      icon: Star,
      href: "/admin/bestseller-cards",
      desc: "Bestseller alanını yönet",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6efdd] pb-20 pt-28">
  

      <div className="container relative z-10 mx-auto px-4">
        {/* HEADER */}
        <div
          className="
            relative mb-12 overflow-hidden rounded-[28px]
            border border-[#d0bc90]
            bg-[#efe6cf]
            p-6
            shadow-[0_14px_30px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
            md:p-8
          "
        >
          <div
            className="
              pointer-events-none absolute inset-0 z-[1]
              bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]
            "
          />

          <div
            className="
              pointer-events-none absolute inset-[7px] z-[2]
              rounded-[21px]
              border border-[#d6c49a]/70
            "
          />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
                Yönetim Paneli
              </span>

              <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e] md:text-5xl">
                Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5e4734]/70">
                Yönetim paneline hoş geldiniz. Ürünleri, siparişleri,
                kategorileri ve ana sayfa vitrin alanlarını buradan
                yönetebilirsiniz.
              </p>
            </div>

            <Button
              onClick={() => router.push("/admin/products")}
              className="
                h-12 rounded-full border-2 border-transparent bg-transparent
                px-6 text-xs font-bold uppercase tracking-[0.18em]
                text-[#e8dcc0] shadow-none transition-all duration-300
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
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ürün
            </Button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <StatsCard title="Toplam Ürün" value="124" icon={Package} />
          <StatsCard title="Siparişler" value="32" icon={ShoppingCart} />
          <StatsCard title="Kullanıcılar" value="540" icon={Users} />
          <StatsCard title="Gelir" value="₺12.400" icon={ShoppingCart} />
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-14">
          <div className="mb-5 flex items-end justify-between border-b border-[#3d3020]/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
                Yönetim
              </span>

              <h2 className="mt-1 font-serif text-2xl font-black italic text-[#2c1a0e]">
                Hızlı Erişim
              </h2>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="
                    group relative overflow-hidden rounded-[20px]
                    border border-[#d0bc90]
                    bg-[#efe6cf]
                    p-5 text-left
                    shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
                    transition-all duration-300
                    hover:-translate-y-1
                  "
                >
                  <div
                    className="
                      pointer-events-none absolute inset-0 z-[1]
                      bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]
                    "
                  />

                  <div
                    className="
                      pointer-events-none absolute inset-[6px] z-[2]
                      rounded-[15px]
                      border border-[#d6c49a]/70
                    "
                  />

                  <div className="relative z-10">
                    <div className="mb-5 flex items-center gap-4">
                      <div
                        className="
                          flex h-12 w-12 shrink-0 items-center justify-center
                          overflow-hidden rounded-full
                          bg-cover bg-center
                          text-[#2c1a0e]
                          shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
                        "
                        style={{
                          backgroundImage: "url('/bkrr.png')",
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="font-serif text-lg font-black text-[#2c1a0e]">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-[#5e4734]/70">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ALT GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>

          <div>
            <LowStockAlert />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Product } from "@/types";
import { AlertTriangle } from "lucide-react";

interface LowStockAlertProps {
  products?: Product[];
}

export default function LowStockAlert({ products = [] }: LowStockAlertProps) {
  return (
    <div
      className="
        relative overflow-hidden rounded-[20px]
        border border-[#d0bc90]
        bg-[#efe6cf]
        p-6
        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
      "
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />
      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 items-center justify-center
              overflow-hidden rounded-full
              bg-cover bg-center
              text-[#2c1a0e]
              shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28)]
            "
            style={{ backgroundImage: "url('/bkrr.png')" }}
          >
            <AlertTriangle size={20} />
          </div>

          <div>
            <h3 className="font-serif text-xl font-black italic text-[#2c1a0e]">
              Düşük Stok Uyarıları
            </h3>
            <p className="text-xs text-[#5e4734]/60">
              Kritik seviyedeki ürünler
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <p className="py-8 text-center text-sm font-medium text-[#5e4734]/65">
            Düşük stoklu ürün yok
          </p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  flex items-center justify-between rounded-[14px]
                  border border-[#d0bc90]/60
                  bg-[#efe3cf]/70
                  px-4 py-3
                "
              >
                <span className="font-serif text-sm font-bold text-[#2c1a0e]">
                  {product.name}
                </span>

                <span className="rounded-full bg-[#7a3b1e]/10 px-3 py-1 text-xs font-bold text-[#7a3b1e]">
                  Stok: {product.stock ?? 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

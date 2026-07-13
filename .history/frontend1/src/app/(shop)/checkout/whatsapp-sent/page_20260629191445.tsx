"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, MessageCircle, ArrowLeft } from "lucide-react";

function WhatsappSentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center bg-[#f6efdd] px-4 py-20">
      <div className="relative max-w-[580px] overflow-hidden rounded-[24px] border border-[#d0bc90] bg-[#efe6cf] p-8 text-center shadow-[0_14px_30px_rgba(120,92,58,0.14)]">
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.96)_0%,_rgba(250,243,228,0.88)_44%,_rgba(246,236,214,0.72)_70%,_rgba(228,212,176,0.35)_100%)]" />
        <div className="pointer-events-none absolute inset-[7px] z-[2] rounded-[18px] border border-[#d6c49a]/70" />

        <div className="relative z-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#d8bf8a] bg-[#fff5ea] text-[#7a3b1e]">
            <MessageCircle size={30} />
          </div>

          <h1 className="font-serif text-3xl font-black italic text-[#2c1a0e]">
            WhatsApp Talebiniz Hazırlandı
          </h1>

          {orderId && (
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a67c3d]">
              Talep No: {orderId.slice(0, 8).toUpperCase()}
            </p>
          )}

          <div className="mt-6 rounded-2xl border border-[#d8bf8a]/70 bg-[#fff5ea]/70 px-5 py-4 text-left">
            <div className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-[#7a3b1e]" />

              <p className="text-sm leading-relaxed text-[#5e4734]">
                Bu işlem kesin sipariş onayı değildir. Ekibimiz WhatsApp
                üzerinden ödeme ve stok onayını tamamladıktan sonra talebiniz
                işleme alınacaktır.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#a67c3d]/40 px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#7a3b1e] transition hover:bg-[#a67c3d]/10"
          >
            <ArrowLeft size={14} />
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </main>
  );
}

export default function WhatsappSentPage() {
  return (
    <Suspense fallback={null}>
      <WhatsappSentContent />
    </Suspense>
  );
}

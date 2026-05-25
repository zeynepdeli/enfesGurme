"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, CreditCard, ChevronRight } from "lucide-react";

const HEADER_HEIGHT = 116;

export default function PaymentPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const formContent = sessionStorage.getItem("iyzico_form");
    if (!formContent || !containerRef.current) return;

    containerRef.current.innerHTML = formContent;

    const scripts = containerRef.current.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // İyzico widget yüklenince spinner'ı kaldır
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#f6efdd]"
      style={{ paddingTop: HEADER_HEIGHT }}
    >
      {/* BREADCRUMB */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#a67c3d] mb-8">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/")}
          >
            Anasayfa
          </span>
          <ChevronRight size={12} />
          <span
            className="cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/cart")}
          >
            Sepet
          </span>
          <ChevronRight size={12} />
          <span
            className="cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/checkout")}
          >
            Sipariş Ver
          </span>
          <ChevronRight size={12} />
          <span className="text-[#3d3020]/50">Ödeme</span>
        </div>

        {/* BAŞLIK */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif italic text-[#3d3020] mb-2">
            Güvenli Ödeme
          </h1>
          {orderId && (
            <p className="text-xs text-[#3d3020]/40 uppercase tracking-widest">
              Sipariş #{orderId.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>

        {/* GÜVENLİK ROZET BANDI */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-[#3d3020]/50">
            <Lock size={13} className="text-[#a67c3d]" />
            <span>256-bit SSL</span>
          </div>
          <div className="w-px h-4 bg-[#a67c3d]/20" />
          <div className="flex items-center gap-1.5 text-xs text-[#3d3020]/50">
            <ShieldCheck size={13} className="text-[#a67c3d]" />
            <span>3D Secure</span>
          </div>
          <div className="w-px h-4 bg-[#a67c3d]/20" />
          <div className="flex items-center gap-1.5 text-xs text-[#3d3020]/50">
            <CreditCard size={13} className="text-[#a67c3d]" />
            <span>iyzico ile korumalı</span>
          </div>
        </div>

        {/* İYZİCO FORM ALANI */}
        <div className="relative">
          {/* Yüklenirken spinner */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#f6efdd] z-10 rounded-2xl min-h-[300px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#a67c3d]/30 border-t-[#a67c3d] rounded-full animate-spin" />
                <p className="text-xs text-[#3d3020]/40 uppercase tracking-widest">
                  Ödeme formu yükleniyor...
                </p>
              </div>
            </div>
          )}

          <div
            ref={containerRef}
            className={`bg-white rounded-2xl shadow-sm border border-[#a67c3d]/10 p-2 transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* ALT BİLGİ */}
        <p className="text-center text-xs text-[#3d3020]/30 mt-6 mb-12">
          Kart bilgileriniz iyzico altyapısı üzerinden şifreli olarak işlenir,
          sunucularımızda saklanmaz.
        </p>
      </div>
    </div>
  );
}

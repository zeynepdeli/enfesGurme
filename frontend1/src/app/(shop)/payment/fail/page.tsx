"use client";

const HEADER_HEIGHT = 116;

export default function PaymentFailPage() {
  return (
    <div
      className="min-h-screen bg-[#f6efdd] flex items-center justify-center"
      style={{ paddingTop: HEADER_HEIGHT }}
    >
      <div className="text-center">
        <span className="text-6xl mb-4 block">✕</span>
        <h1 className="text-4xl font-serif italic text-[#3d3020] mb-3">
          Ödeme Başarısız
        </h1>
        <p className="text-[#3d3020]/60 mb-8">
          Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.
        </p>
        <button
          onClick={() => (window.location.href = "/cart")}
          className="text-sm uppercase tracking-widest text-[#a67c3d] border border-[#a67c3d]/40 rounded-full px-6 py-3 hover:bg-[#a67c3d]/10 transition"
        >
          Sepete Dön
        </button>
      </div>
    </div>
  );
}

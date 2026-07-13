"use client";

import type { FaqSettings } from "@/app/(shop)/faq/page";

export function FaqBackground({ settings }: { settings: FaqSettings }) {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-[0.38] mix-blend-multiply"
     
      />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_50%_22%,rgba(255,252,240,0.72)_0%,rgba(239,227,204,0.72)_48%,rgba(210,184,138,0.24)_100%)]" />

      <div className="pointer-events-none absolute left-[-12%] top-[12%] z-[2] h-[42vw] w-[42vw] rounded-full bg-[#fff3d6]/25 blur-[110px]" />

      <div className="pointer-events-none absolute bottom-[-18%] right-[-10%] z-[2] h-[36vw] w-[36vw] rounded-full bg-[#b5763d]/10 blur-[110px]" />
    </>
  );
}

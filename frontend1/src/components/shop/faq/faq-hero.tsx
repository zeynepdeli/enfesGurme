"use client";

import type { FaqSettings } from "@/app/(shop)/faq/page";

export function FaqHero({ settings }: { settings: FaqSettings }) {
  return (
    <div className="mx-auto mt-0 max-w-[900px] text-center">
      <h1 className="font-[family-name:var(--font-merienda)] text-[clamp(18px,3.2vw,30px)] font-bold leading-[0.98] text-[#460d07]">
        {settings.title}
      </h1>

      {settings.subtitle && (
        <p className="mx-auto mt-3 max-w-[580px] text-[clamp(12px,1vw,15px)] font-medium leading-[1.55] text-[#4b3123]/75">
          {settings.subtitle}
        </p>
      )}

      <div className="mx-auto mt-4 h-[1px] w-[170px] bg-[linear-gradient(to_right,transparent,#9c5732,transparent)] sm:w-[200px]" />

      <div className="mx-auto mt-[-5px] h-2.5 w-2.5 rotate-45 bg-[#9c5732]" />
    </div>
  );
}

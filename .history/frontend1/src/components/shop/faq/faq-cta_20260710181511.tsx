"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import type { FaqSettings } from "@/app/(shop)/faq/page";



export function FaqCTA({ settings }: { settings: FaqSettings }) {
  return (
    <div className="mx-auto mt-8 flex max-w-[620px] flex-col items-center text-center sm:mt-9 lg:mt-10">
      <h2 className="font-serif text-[clamp(22px,2vw,30px)] font-black tracking-[-0.035em] text-[#351509]">
        {settings.contactTitle}
      </h2>

      <Link
        href={settings.buttonLink || "/contact"}
        className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full px-7 text-[11px] font-black uppercase tracking-[0.15em] text-[#f5e7d1] shadow-[0_10px_22px_rgba(74,35,16,0.22),inset_0_1px_1px_rgba(255,255,255,0.28)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:h-12 sm:px-8 sm:text-xs"
        style={{
          backgroundImage: textureImage
            ? `url("${textureImage}")`
            : `url("/bkrr.png")`,
        }}
      >
        <Mail size={16} />
        {settings.buttonText}
      </Link>
    </div>
  );
}

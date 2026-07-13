"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { FaqItem } from "@/app/(shop)/faq/page";

type Props = {
  faq: FaqItem;
  cardBgImage: string;
  textureImage: string;
};

export function FaqCard({ faq, cardBgImage, textureImage }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className={`
        group relative min-h-[185px] overflow-hidden rounded-[18px]
        bg-cover bg-center p-4
        shadow-[0_14px_34px_rgba(76,48,22,0.12),inset_0_1px_2px_rgba(255,255,255,0.42),inset_0_-6px_12px_rgba(122,73,32,0.07)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_18px_42px_rgba(76,48,22,0.18),inset_0_1px_2px_rgba(255,255,255,0.48)]
        sm:min-h-[195px] sm:p-4
        lg:min-h-[205px]
        xl:min-h-[215px]
      `}
      style={{
        backgroundImage: cardBgImage
          ? `linear-gradient(
              rgba(255,248,236,0.38),
              rgba(255,248,236,0.28)
            ), url("${cardBgImage}")`
          : `linear-gradient(
              rgba(255,248,236,0.92),
              rgba(255,248,236,0.82)
            )`,
      }}
    >
      {/* Kart dokusu */}
      {textureImage && (
        <div
          className="
            pointer-events-none absolute inset-0 z-0
            bg-cover bg-center bg-no-repeat
            opacity-[0.08] mix-blend-multiply
          "
          style={{
            backgroundImage: `url("${textureImage}")`,
          }}
        />
      )}

      {/* Kart ışık efekti */}
      <div
        className="
          pointer-events-none absolute inset-0 z-[1]
          bg-[radial-gradient(circle_at_30%_12%,rgba(255,255,255,0.32),transparent_38%)]
        "
      />

      {/* Aç / kapat butonu */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          absolute right-3 top-3 z-20
          flex h-8 w-8 items-center justify-center
          overflow-hidden rounded-full
          bg-cover bg-center bg-no-repeat
          text-[#f5e7d1]
          shadow-[0_7px_14px_rgba(71,35,16,0.24),inset_0_1px_1px_rgba(255,255,255,0.35)]
          transition-transform duration-300
          group-hover:scale-105
          sm:h-9 sm:w-9
        "
        style={{
          backgroundImage: faq.topIcon
            ? `url("${faq.topIcon}")`
            : "linear-gradient(135deg,#5a2b16,#8f4f25,#b7773f,#5a2b16)",
        }}
        aria-label={open ? "Soruyu kapat" : "Soruyu aç"}
        aria-expanded={open}
      >
        {/* Görsel üstünde okunabilirliği artıran katman */}
        <span className="pointer-events-none absolute inset-0 bg-black/10" />

        <ChevronDown
          size={16}
          strokeWidth={2.3}
          className={`
            relative z-10
            transition-transform duration-300
            ${open ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* Soru ve cevap */}
      <div className="relative z-10 pr-10">
        <h2
          className="
            font-serif text-[17px] font-black
            leading-[1.08] tracking-[-0.03em]
            text-[#351509]
            sm:text-[18px]
            lg:text-[19px]
          "
        >
          {faq.question}
        </h2>

        <div
          className={`
            grid transition-[grid-template-rows] duration-300 ease-in-out
            ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
          `}
        >
          <div className="overflow-hidden">
            <p
              className="
                mt-3 whitespace-pre-line
                text-[12.5px] font-medium leading-[1.45]
                text-[#2d2117]/85
                sm:text-[13px]
              "
            >
              {faq.answer}
            </p>
          </div>
        </div>

        {!open && (
          <p
            className="
              mt-3 line-clamp-3 whitespace-pre-line
              text-[12.5px] font-medium leading-[1.42]
              text-[#2d2117]/78
              sm:text-[13px]
            "
          >
            {faq.answer}
          </p>
        )}
      </div>

      {/* Sağ alt dekor ikonu */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10">
        {faq.bottomIcon ? (
          <div className="relative h-[42px] w-[42px]">
            <Image
              src={faq.bottomIcon}
              alt=""
              fill
              sizes="42px"
              className="
                object-contain
                opacity-[0.38]
                mix-blend-multiply
              "
            />
          </div>
        ) : (
          <HelpCircle
            size={40}
            strokeWidth={1.4}
            className="text-[#9c5732]/32"
          />
        )}
      </div>
    </article>
  );
}

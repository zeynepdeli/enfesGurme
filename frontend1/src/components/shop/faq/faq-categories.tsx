"use client";

import type { FaqCategory } from "@/app/(shop)/faq/page";

type Props = {
  categories: FaqCategory[];
  activeCategory: number | null;
  onChange: (id: number | null) => void;
  cardBgImage: string;
};

export function FaqCategories({
  categories,
  activeCategory,
  onChange,
  cardBgImage,
}: Props) {
  if (!categories.length) return null;

  return (
    <div className="mx-auto mt-5 flex max-w-[980px] flex-wrap items-center justify-center gap-2 sm:mt-6 sm:gap-2.5 lg:mt-7">
      <CategoryButton
        label="Tümü"
        active={activeCategory === null}
        cardBgImage={cardBgImage}
        onClick={() => onChange(null)}
      />

      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          label={category.name}
          active={activeCategory === category.id}
          cardBgImage={cardBgImage}
          onClick={() => onChange(category.id)}
        />
      ))}
    </div>
  );
}

function CategoryButton({
  label,
  active,
  cardBgImage,
  onClick,
}: {
  label: string;
  active: boolean;
  cardBgImage: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-full px-4 py-2
        text-[10px] font-black uppercase tracking-[0.16em]
        shadow-[0_8px_18px_rgba(80,55,28,0.09),inset_0_1px_2px_rgba(255,255,255,0.45)]
        transition-all duration-300 hover:-translate-y-0.5
        sm:px-5 sm:py-2.5 sm:text-[11px]
        ${active ? "text-[#f5e7d1]" : "text-[#6b3f18] hover:text-[#351509]"}
      `}
      style={{
        backgroundImage: active
          ? "linear-gradient(135deg,#5a2b16,#8f4f25,#b7773f,#5a2b16)"
          : `linear-gradient(rgba(255,248,236,0.50),rgba(255,248,236,0.50)),url('${cardBgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {label}
    </button>
  );
}

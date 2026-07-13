"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { useProductFilters } from "@/hooks/use-product-filters";

const CATEGORY_SVGS: Record<string, JSX.Element> = {
  baharatlar: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M12 28 Q10 32 14 33 L26 33 Q30 32 28 28 Z" />
      <path d="M14 28 Q13 22 20 20 Q27 22 26 28" />
      <path d="M24 18 L30 10" />
      <path d="M28 8 Q32 6 31 10 Q30 14 26 16" />
      <path d="M10 33 L30 33" />
    </svg>
  ),
  kuruluklar: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M8 20 Q8 32 20 32 Q32 32 32 20" />
      <path d="M6 20 L34 20" />
      <path d="M15 20 Q14 14 18 12 Q20 11 20 14" />
      <path d="M20 20 Q20 13 23 11 Q26 10 25 14" />
      <path d="M25 20 Q26 14 29 13 Q31 13 30 16" />
    </svg>
  ),
  kuruyemişler: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M18 8 L18 12" />
      <path d="M16 12 L24 12" />
      <path d="M22 12 L24 16 L24 30 Q24 33 20 33 Q16 33 16 30 L16 16 Z" />
      <path d="M16 20 L24 20" />
      <circle cx="20" cy="26" r="2" />
    </svg>
  ),
  peynirler: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M6 28 L20 12 L34 28 Z" />
      <circle cx="16" cy="24" r="2" />
      <circle cx="23" cy="21" r="1.5" />
      <circle cx="19" cy="28" r="1.5" />
      <path d="M6 28 L34 28" />
    </svg>
  ),
  salçalar: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <rect x="12" y="16" width="16" height="18" rx="2" />
      <path d="M10 16 L30 16" />
      <path d="M14 16 L14 13 Q14 11 16 11 L24 11 Q26 11 26 13 L26 16" />
      <path d="M12 22 Q20 20 28 22" />
      <path d="M15 27 Q20 25.5 25 27" />
    </svg>
  ),
  turgular: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M12 20 Q12 10 20 10 Q28 10 28 20 Q28 30 20 30 Q12 30 12 20 Z" />
      <path d="M20 10 L20 8 Q21 6 23 7" />
      <path d="M14 17 Q20 15 26 17" />
      <path d="M14 20 Q20 18 26 20" />
      <path d="M14 23 Q20 21 26 23" />
    </svg>
  ),
  zeytinler: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <ellipse cx="20" cy="28" rx="13" ry="4" />
      <ellipse cx="16" cy="22" rx="4" ry="6" />
      <path d="M16 16 Q18 12 16 10" />
      <ellipse cx="25" cy="23" rx="4" ry="5.5" />
      <path d="M25 17 Q27 13 25 11" />
      <circle
        cx="16"
        cy="22"
        r="1.5"
        fill="currentColor"
        stroke="none"
        opacity="0.3"
      />
      <circle
        cx="25"
        cy="23"
        r="1.5"
        fill="currentColor"
        stroke="none"
        opacity="0.3"
      />
    </svg>
  ),
  default: (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M13 18 L10 30 L30 30 L27 18" />
      <path d="M8 18 L32 18" />
      <path d="M15 18 Q15 10 20 10 Q25 10 25 18" />
      <path d="M14 24 L26 24" />
    </svg>
  ),
};

function getCategoryIcon(name: string): JSX.Element {
  const lower = name.toLowerCase().trim();

  for (const [key, icon] of Object.entries(CATEGORY_SVGS)) {
    if (key === "default") continue;
    if (lower.includes(key) || key.includes(lower)) return icon;
  }

  return CATEGORY_SVGS.default;
}

export function CategorySidebar() {
  const { filters, setCategory } = useProductFilters();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get<Category[]>("/api/categories");
      return res.data || [];
    },
  });

  return (
    <aside className="w-full">
      <CategoryItem
        label="Tüm Ürünler"
        icon={CATEGORY_SVGS.default}
        isActive={!filters.categoryId}
        onClick={() => setCategory(null)}
      />

      <div className="my-1 h-px bg-[#3d3020]/10" />

      {isLoading ? (
        <CategorySkeleton />
      ) : (
        <ul className="space-y-1.5">
          {categories.map((cat) => (
            <li key={cat.id}>
              <CategoryItem
                label={cat.name}
                icon={getCategoryIcon(cat.name)}
                isActive={filters.categoryId === cat.id}
                onClick={() => setCategory(cat.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export function CategoryMobileTabs() {
  const { filters, setCategory } = useProductFilters();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get<Category[]>("/api/categories");
      return res.data || [];
    },
  });

  return (
    <div className="lg:hidden">
      <div className="relative overflow-hidden rounded-[18px] border border-[#a67c3d]/15 p-3 shadow-sm">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#eee1c9_5%,#c4be98_36%,#b3ad84_52%,#c9c39f_80%,#e8dcc5_98%,#f0e4cd_100%)]" />

        <img
          src="/fıstıkYapragı.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply"
        />

        <div className="absolute inset-0 bg-[#f6efdd]/35" />

        <div className="relative z-10">
          <div className="mb-3 border-b border-[#a67c3d]/20 pb-2 font-serif text-[13px] font-bold uppercase tracking-[0.18em] text-[#7a5a34]">
            Kategoriler
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <MobileCategoryItem
              label="Tümü"
              isActive={!filters.categoryId}
              onClick={() => setCategory(null)}
            />

            {!isLoading &&
              categories.map((category) => (
                <MobileCategoryItem
                  key={category.id}
                  label={category.name}
                  isActive={filters.categoryId === category.id}
                  onClick={() => setCategory(category.id)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: JSX.Element;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={
        isActive ? { backgroundImage: "url('/cardDuvar.png')" } : undefined
      }
      className={`
        relative flex w-full items-center justify-between overflow-hidden rounded-[10px]
        px-4 py-3 text-left text-sm transition-all duration-200
        ${
          isActive
            ? `
              border border-[#d8bf8a] bg-cover bg-center font-semibold text-[#460e07]
              shadow-[0_10px_18px_rgba(120,92,58,0.12),0_3px_0_rgba(190,166,118,0.25),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.10)]
            `
            : `
              border border-transparent bg-transparent font-normal text-[#3d3020]
              hover:bg-[#efe4cf]/55
            `
        }
      `}
    >
      {isActive && <ActiveOverlay />}

      <span
        className={`
          relative z-10 tracking-wide text-[13px]
          ${isActive ? "font-bold text-[#460e07]" : "font-medium text-[#4b3927]"}
        `}
      >
        {label}
      </span>

      <span
        className={`
          relative z-10 transition-all duration-200
          ${
            isActive
              ? "opacity-95 text-[#6b3f18] drop-shadow-[0_1px_0_rgba(255,240,220,0.55)]"
              : "opacity-55 text-[#6b3f22]"
          }
        `}
      >
        {icon}
      </span>
    </button>
  );
}

function MobileCategoryItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={
        isActive ? { backgroundImage: "url('/cardDuvar.png')" } : undefined
      }
      className={`
        relative shrink-0 overflow-hidden rounded-[10px]
        px-4 py-2.5 text-[11px] uppercase tracking-[0.14em]
        transition-all duration-200
        ${
          isActive
            ? `
              border border-[#d8bf8a] bg-cover bg-center font-semibold text-[#460e07]
              shadow-[0_10px_18px_rgba(120,92,58,0.12),0_3px_0_rgba(190,166,118,0.25),inset_0_1px_2px_rgba(255,255,255,0.65),inset_0_-3px_8px_rgba(160,126,78,0.10)]
            `
            : `
              border border-transparent bg-[#efe4cf]/55 font-medium text-[#4b3927]
              hover:bg-[#efe4cf]/80
            `
        }
      `}
    >
      {isActive && <ActiveOverlay />}

      <span className="relative z-10">{label}</span>
    </button>
  );
}

function ActiveOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(255,252,245,0.42),rgba(214,194,160,0.10))]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.18)_0%,transparent_42%)]" />
      <div className="pointer-events-none absolute inset-[4px] z-[3] rounded-[6px] border border-[#e0c896]/50" />
    </>
  );
}

function CategorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="h-[52px] animate-pulse rounded-[10px] border border-[#3d3020]/6 bg-[#3d3020]/4"
        />
      ))}
    </div>
  );
}

"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CrudPageLayoutProps {
  title: string;
  description: string;
  onCreateClick?: () => void;
  createButtonText?: string;
  stats?: ReactNode;
  children: ReactNode;
}

export function CrudPageLayout({
  title,
  description,
  onCreateClick,
  createButtonText = "Yeni Ekle",
  stats,
  children,
}: CrudPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="
          relative overflow-hidden rounded-[24px]
          border border-[#d0bc90]
          bg-[#efe6cf]
          p-6
          shadow-[0_14px_30px_rgba(120,92,58,0.14),inset_0_1px_2px_rgba(255,255,255,0.55)]
        "
      >
        {/* BG */}
        <div
          className="
            pointer-events-none absolute inset-0 z-[1]
            bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]
          "
        />

        {/* INNER BORDER */}
        <div
          className="
            pointer-events-none absolute inset-[7px] z-[2]
            rounded-[18px]
            border border-[#d6c49a]/70
          "
        />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#a67c3d]">
              Yönetim Paneli
            </span>

            <h1 className="mt-2 font-serif text-4xl font-black italic text-[#2c1a0e]">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5e4734]/70">
              {description}
            </p>
          </div>

          {/* BUTTON */}
          {onCreateClick && (
            <Button
              onClick={onCreateClick}
              className="
                h-12 rounded-full border-2 border-transparent
                bg-transparent px-6
                text-xs font-bold uppercase tracking-[0.18em]
                text-[#e8dcc0]
                shadow-none
                transition-all duration-300
                hover:brightness-110
              "
              style={{
                backgroundImage: `
                  linear-gradient(#524528, #524528),
                  linear-gradient(to right, #6b3f18, #c8893a, #e8b060, #c8893a, #6b3f18)
                `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow:
                  "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {createButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* STATS */}
      {stats && <div>{stats}</div>}

      {/* CONTENT */}
      <div>{children}</div>
    </div>
  );
}

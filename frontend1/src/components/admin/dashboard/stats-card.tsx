"use client";

import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden rounded-[20px]

        border border-[#d0bc90]

        bg-[#efe6cf]

        p-5

        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]

        transition-all duration-300

        hover:-translate-y-1
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
          pointer-events-none absolute inset-[6px] z-[2]

          rounded-[15px]

          border border-[#d6c49a]/70
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
            {title}
          </p>

          <h3 className="mt-3 font-serif text-3xl font-black italic leading-none text-[#2c1a0e]">
            {value}
          </h3>

          {trend && (
            <div
              className={`
                mt-4 inline-flex items-center gap-1.5 rounded-full
                px-3 py-1 text-xs font-bold

                ${
                  trendUp
                    ? "bg-[#dcebd4] text-[#476f3c]"
                    : "bg-[#f4dfdc] text-[#8f2f2f]"
                }
              `}
            >
              {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}

              {trend}
            </div>
          )}
        </div>

        {/* ICON */}
        {Icon && (
          <div
            className="
              relative flex h-14 w-14 shrink-0 items-center justify-center

              overflow-hidden rounded-full

              border border-[#d8bf8a]

              bg-cover bg-center

              text-[#2c1a0e]

              shadow-[inset_0_2px_5px_rgba(255,230,200,0.35),inset_0_-4px_7px_rgba(80,35,10,0.28),0_1px_2px_rgba(80,35,10,0.15)]
            "
            style={{
              backgroundImage: "url('/bkrr.png')",
            }}
          >
            {/* LIGHT */}
            <div
              className="
                pointer-events-none absolute inset-0

                bg-[linear-gradient(135deg,rgba(255,252,245,0.24),rgba(214,194,160,0.06))]
              "
            />

            <Icon className="relative z-10 h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
}

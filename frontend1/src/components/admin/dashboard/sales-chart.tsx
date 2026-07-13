"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data?: { month: string; total: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data || [
    { month: "Ocak", total: 0 },
    { month: "Şubat", total: 0 },
    { month: "Mart", total: 0 },
    { month: "Nisan", total: 0 },
    { month: "Mayıs", total: 0 },
    { month: "Haziran", total: 0 },
    { month: "Temmuz", total: 0 },
  ];

  return (
    <div
      className="
        relative overflow-hidden rounded-[20px]
        border border-[#d0bc90]
        bg-[#efe6cf]
        p-6
        shadow-[0_10px_22px_rgba(120,92,58,0.12),inset_0_1px_2px_rgba(255,255,255,0.55)]
      "
    >
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_rgba(252,247,236,0.98)_0%,_rgba(250,243,228,0.94)_42%,_rgba(246,236,214,0.86)_68%,_rgba(228,212,176,0.40)_100%)]" />

      <div className="pointer-events-none absolute inset-[6px] z-[2] rounded-[15px] border border-[#d6c49a]/70" />

      <div className="relative z-10">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a67c3d]">
            Rapor
          </span>

          <h3 className="mt-1 font-serif text-2xl font-black italic text-[#2c1a0e]">
            Satış Grafiği
          </h3>

          <p className="mt-1 text-sm text-[#5e4734]/65">
            Son aylık satış performansı
          </p>
        </div>

        <ChartContainer
          config={{
            total: {
              label: "Satışlar",
              color: "#7a3b1e",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="salesCopperFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#7a3b1e" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#7a3b1e" stopOpacity={0.04} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(94,71,52,0.18)"
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#5e4734", fontSize: 12 }}
                axisLine={{ stroke: "rgba(94,71,52,0.25)" }}
                tickLine={{ stroke: "rgba(94,71,52,0.25)" }}
              />

              <YAxis
                tick={{ fill: "#5e4734", fontSize: 12 }}
                axisLine={{ stroke: "rgba(94,71,52,0.25)" }}
                tickLine={{ stroke: "rgba(94,71,52,0.25)" }}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#7a3b1e"
                strokeWidth={2.4}
                fill="url(#salesCopperFill)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}

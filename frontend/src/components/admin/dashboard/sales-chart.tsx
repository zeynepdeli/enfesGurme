"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function SalesChart({ data }: SalesChartProps) {
  // Eğer veri yoksa varsayılan veri göster
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
    <Card>
      <CardHeader>
        <CardTitle>Satış Grafiği</CardTitle>
        <CardDescription>Son aylık satış performansı</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            total: {
              label: "Satışlar",
              color: "hsl(var(--chart-1)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

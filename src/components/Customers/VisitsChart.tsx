"use client";

import { Customer } from "@/types/metric";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Users, Award } from "lucide-react";
import { useMemo } from "react";

const chartConfig = {
  visits: {
    label: "Visitas",
    color: "#2C3E2D",
  },
} satisfies ChartConfig;

export function VisitsChart({ customers }: { customers: Customer[] }) {
  const chartData = useMemo(() => {
    const topVisits = [...customers]
      .sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0))
      .slice(0, 10)
      .map((c, index) => ({
        name: c.name.split(' ')[0].substring(0, 6),
        fullName: c.name,
        visits: c.visits ?? 0,
        email: c.email,
        rank: index + 1,
      }));

    return topVisits;
  }, [customers]);

  const stats = useMemo(() => {
    const totalVisits = chartData.reduce((sum, item) => sum + item.visits, 0);
    const avgVisits = totalVisits / chartData.length;
    const topCustomer = chartData[0];

    return {
      totalVisits,
      avgVisits: avgVisits.toFixed(1),
      topCustomer: topCustomer?.fullName || "N/A",
      topVisits: topCustomer?.visits || 0,
    };
  }, [chartData]);

  // Cores graduais baseadas na posição
  const getBarColor = (index: number) => {
    const colors = [
      "#2C3E2D", // Top 1 - Verde mais escuro
      "#3D5240", // Top 2
      "#4E6753", // Top 3
      "#607C5F", // Top 4-5
      "#607C5F",
      "#718B70", // Top 6-7
      "#718B70",
      "#8B9687", // Top 8-10
      "#8B9687",
      "#8B9687",
    ];
    return colors[index] || "#8B9687";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-[#2C3E2D]" />
              Top 10 Customers by Visits
            </CardTitle>
            <CardDescription className="mt-1">
              Most frequent customers in the last period
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Visits</p>
            <p className="text-xl font-bold text-[#2C3E2D]">{stats.totalVisits}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#F0F4EF] p-3 rounded-lg">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Award className="h-3 w-3" />
              <span>Top Customer</span>
            </div>
            <p className="text-sm font-semibold truncate">{stats.topCustomer}</p>
            <p className="text-xs text-muted-foreground">{stats.topVisits} visits</p>
          </div>

          <div className="bg-[#F0F4EF] p-3 rounded-lg">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              <span>Average</span>
            </div>
            <p className="text-lg font-bold text-[#607C5F]">{stats.avgVisits}</p>
            <p className="text-xs text-muted-foreground">visits/customer</p>
          </div>

          <div className="bg-[#F0F4EF] p-3 rounded-lg">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              <span>Customers</span>
            </div>
            <p className="text-lg font-bold text-[#8B9687]">{chartData.length}</p>
            <p className="text-xs text-muted-foreground">in top 10</p>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                angle={-30}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                width={35}
                label={{ 
                  value: 'Visits', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#6B7280' }
                }}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(96, 124, 95, 0.1)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="space-y-1">
                            <p className="font-semibold">{data.fullName}</p>
                            <p className="text-xs text-muted-foreground">{data.email}</p>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-xs">Rank #{data.rank}</span>
                            </div>
                          </div>
                        );
                      }
                      return "";
                    }}
                  />
                }
              />
              <Bar
                dataKey="visits"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Legend/Footer */}
        <div className="flex items-center gap-2 pt-4 text-sm border-t mt-4">
          <div className="flex items-center gap-1.5 font-medium text-[#607C5F]">
            <TrendingUp className="h-4 w-4" />
            Top performers
          </div>
          <div className="text-muted-foreground">
            representing {((stats.totalVisits / customers.reduce((sum, c) => sum + (c.visits ?? 0), 0)) * 100).toFixed(1)}% of total visits
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { Customer } from "@/types/metric";
import { segmentOf } from "@/lib/segments";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Users, TrendingUp, Award } from "lucide-react";
import { useMemo } from "react";

const chartConfig = {
  count: {
    label: "Clientes",
    color: "#607C5F",
  },
} satisfies ChartConfig;

// Cores por segmento
const segmentColors: Record<string, string> = {
  "VIP": "#2C3E2D",
  "Premium": "#3D5240",
  "Regular": "#607C5F",
  "New": "#8B9687",
  "At Risk": "#C2BDB0",
};

export function CustomersBySegmentChart({ customers }: { customers: Customer[] }) {
  const { segmentData, stats } = useMemo(() => {
    const bySegment = customers.reduce<Record<string, number>>((acc, c) => {
      const s = segmentOf(c);
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    
    const data = Object.entries(bySegment)
      .map(([segment, count]) => ({
        segment,
        count,
        percentage: (count / customers.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    const topSegment = data[0];
    const totalSegments = data.length;

    return {
      segmentData: data,
      stats: {
        topSegment: topSegment?.segment || "N/A",
        topCount: topSegment?.count || 0,
        topPercentage: topSegment?.percentage || 0,
        totalSegments,
      },
    };
  }, [customers]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-[#2C3E2D]" />
              Customers by Segment
            </CardTitle>
            <CardDescription className="mt-1">
              Distribution of customers across different segments
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Segments</p>
            <p className="text-xl font-bold text-[#2C3E2D]">{stats.totalSegments}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-6">
        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={segmentData}
              margin={{ top: 10, right: 10, left: 0, bottom: 50 }}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3"
                stroke="#E5E7EB"
              />
              <XAxis 
                dataKey="segment" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                angle={-30}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                width={40}
                label={{ 
                  value: 'Customers', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 11, fill: '#6B7280' }
                }}
              />
              <ChartTooltip 
                cursor={{ fill: 'rgba(96, 124, 95, 0.1)' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="space-y-1">
                            <p className="font-semibold">{data.segment}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span>{data.count} customers</span>
                              <span className="text-muted-foreground">
                                ({data.percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return value;
                    }}
                  />
                }
              />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              >
                {segmentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={segmentColors[entry.segment] || "#607C5F"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Segment Legend */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t mt-4">
          {segmentData.map((segment) => (
            <div 
              key={segment.segment}
              className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: segmentColors[segment.segment] || "#607C5F" }}
                />
                <span className="font-medium">{segment.segment}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{segment.count}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
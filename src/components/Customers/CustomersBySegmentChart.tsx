"use client";

import { Customer } from "@/types/metric";
import { segmentOf } from "@/lib/segments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

export function CustomersBySegmentChart({ customers }: { customers: Customer[] }) {
  const bySegment = customers.reduce<Record<string, number>>((acc, c) => {
    const s = segmentOf(c);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  
  const segmentData = Object.entries(bySegment).map(([segment, count]) => ({
    segment,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          Clientes por segmento
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <ChartContainer
          config={{
            count: { label: "Clientes" },
          }}
          className="h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={segmentData}
              margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis 
                dataKey="segment" 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis 
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                width={36} // <-- Mais espaço para os números
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]}
                fill="#607C5F"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
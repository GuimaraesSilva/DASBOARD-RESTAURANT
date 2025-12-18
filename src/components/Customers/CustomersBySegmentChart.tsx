"use client";

import { Customer } from "@/types/metric";
import { segmentOf } from "@/lib/segments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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
        <CardTitle className="text-sm font-medium">
          Clientes por segmento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: { label: "Clientes" },
          }}
          className="h-[280px]"
        >
          <BarChart data={segmentData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="segment" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
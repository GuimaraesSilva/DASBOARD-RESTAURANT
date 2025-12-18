"use client";

import { Customer } from "@/types/metric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export function VisitsChart({ customers }: { customers: Customer[] }) {
  const topVisits = [...customers]
    .sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0))
    .slice(0, 10)
    .map((c) => ({ name: c.name, visits: c.visits }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Top 10 por visitas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            visits: { label: "Visitas" },
          }}
          className="h-[280px]"
        >
          <BarChart data={topVisits}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="visits" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
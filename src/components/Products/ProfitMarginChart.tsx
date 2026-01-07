'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import productsData from "@/data/products.json";

export function ProfitMarginChart() {
  const chartData = productsData.products
    .map(product => ({
      name: product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name,
      margin: parseFloat((((product.price - product.cost) / product.price) * 100).toFixed(1)),
      category: product.category,
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Top 10 Profit Margins</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[400px]">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-medium">{payload[0].payload.name}</p>
                      <p className="text-sm text-muted-foreground">{payload[0].payload.category}</p>
                      <p className="text-sm font-bold text-green-600">{payload[0].value}% margin</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="margin" fill="#2C3E2D" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
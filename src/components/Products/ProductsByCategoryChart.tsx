'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import productsData from "@/data/products.json";
import { Package } from "lucide-react";

const chartConfig = {
  count: {
    label: "Products",
    color: "#2C3E2D",
  },
  stockValue: {
    label: "Stock Value",
    color: "#607C5F",
  },
};

export function ProductsByCategoryChart() {
  const categoryData = productsData.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { count: 0, stockValue: 0 };
    }
    acc[product.category].count += 1;
    acc[product.category].stockValue += product.price * product.stock;
    return acc;
  }, {} as Record<string, { count: number; stockValue: number }>);

  const chartData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    count: data.count,
    stockValue: Math.round(data.stockValue),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Products by Category</CardTitle>
        <CardDescription>Distribution of products and stock value</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar yAxisId="left" dataKey="count" fill="#2C3E2D" radius={4} />
            <Bar yAxisId="right" dataKey="stockValue" fill="#607C5F" radius={4} />
          </BarChart>
        </ChartContainer>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{productsData.products.length} total products</span>
        </div>
      </CardContent>
    </Card>
  );
}
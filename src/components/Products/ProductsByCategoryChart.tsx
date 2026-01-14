'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import productsData from "@/data/products.json";
import { Package, TrendingUp, DollarSign } from "lucide-react";

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

// Cores para cada categoria
const categoryColors: Record<string, string> = {
  "Entradas": "#2C3E2D",
  "Pratos Principais": "#536657",
  "Sobremesas": "#607C5F",
  "Bebidas": "#8B9687",
  "Vinhos": "#89726B",
};

export function ProductsByCategoryChart() {
  const categoryData = productsData.products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { 
        count: 0, 
        stockValue: 0,
        totalRevenue: 0,
        avgPrice: 0,
      };
    }
    acc[product.category].count += 1;
    acc[product.category].stockValue += product.price * product.stock;
    acc[product.category].totalRevenue += product.price * product.stock;
    return acc;
  }, {} as Record<string, { count: number; stockValue: number; totalRevenue: number; avgPrice: number }>);

  // Calcular preço médio
  Object.keys(categoryData).forEach(category => {
    const categoryProducts = productsData.products.filter(p => p.category === category);
    const totalPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0);
    categoryData[category].avgPrice = totalPrice / categoryProducts.length;
  });

  const chartData = Object.entries(categoryData)
    .map(([category, data]) => ({
      category,
      count: data.count,
      stockValue: Math.round(data.stockValue),
      avgPrice: data.avgPrice,
      totalRevenue: data.totalRevenue,
    }))
    .sort((a, b) => b.stockValue - a.stockValue);

  const totalProducts = productsData.products.length;
  const totalStockValue = chartData.reduce((sum, item) => sum + item.stockValue, 0);
  const mostValuableCategory = chartData[0];
  const avgProductsPerCategory = totalProducts / chartData.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-[#2C3E2D]" />
              Products by Category
            </CardTitle>
            <CardDescription>Distribution of products and stock value across categories</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Stock Value</p>
            <p className="text-xl font-bold text-[#2C3E2D]">€{totalStockValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-[350px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tick={{ fontSize: 11 }}
                label={{ value: 'Number of Products', angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 11 }}
                label={{ value: 'Stock Value (€)', angle: 90, position: 'insideRight', fontSize: 11 }}
              />
              <Legend 
                iconType="circle"
                wrapperStyle={{ fontSize: '10px' }}
              />
              <Bar yAxisId="left" dataKey="count" name="Products" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[entry.category] || "#2C3E2D"} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="stockValue" name="Stock Value (€)" fill="#607C5F" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Details */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Category Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {chartData.map((category) => (
              <div 
                key={category.category}
                className="grid grid-cols-4 items-center gap-3 p-3 rounded-lg border bg-gray-50"
              >
                <div className="flex items-center gap-2 col-span-2">

                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: categoryColors[category.category] || "#2C3E2D" }}
                />
                <span className="text-sm font-medium">{category.category}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {category.count} items
                </Badge>
                <span className="text-xs font-semibold text-green-600 text-right">
                  €{category.stockValue.toLocaleString('pt-PT')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
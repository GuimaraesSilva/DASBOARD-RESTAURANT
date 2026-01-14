'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package } from "lucide-react";
import productsData from "@/data/products.json";

export function ProfitMarginChart() {
  const chartData = productsData.products
    .map(product => ({
      name: product.name,
      fullName: product.name,
      margin: parseFloat((((product.price - product.cost) / product.price) * 100).toFixed(1)),
      category: product.category,
      price: product.price,
      cost: product.cost,
      profit: product.price - product.cost,
    }))
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 10);

  const averageMargin = chartData.reduce((sum, item) => sum + item.margin, 0) / chartData.length;
  const bestProduct = chartData[0];
  const totalProducts = productsData.products.length;

  // Cores baseadas na margem
  const getBarColor = (margin: number) => {
    if (margin >= 60) return "#2C3E2D"; // Verde escuro - excelente
    if (margin >= 40) return "#607C5F"; // Verde médio - boa
    if (margin >= 20) return "#8B9687"; // Verde claro - ok
    return "#C2BDB0"; // Bege - baixa
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              Top 10 Profit Margins
            </CardTitle>
            <CardDescription>Products with highest profit percentages</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Average Margin</p>
            <p className="text-xl font-bold text-green-600">{averageMargin.toFixed(1)}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div className="bg-[#F0F4EF] p-3 rounded-lg border border-[#CDDBC8]">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3 text-green-600" />
              <span>Best Margin</span>
            </div>
            <div className="text-lg font-bold text-[#2C3E2D]">{bestProduct.margin}%</div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">{bestProduct.fullName}</div>
          </div>

          <div className="bg-[#F0F4EF] p-3 rounded-lg border border-[#CDDBC8]">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Package className="w-3 h-3 text-blue-600" />
              <span>Products Analyzed</span>
            </div>
            <div className="text-lg font-bold text-[#536657]">{chartData.length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">of {totalProducts} total</div>
          </div>

          <div className="bg-[#F0F4EF] p-3 rounded-lg border border-[#CDDBC8]">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3 text-orange-600" />
              <span>Avg Profit/Unit</span>
            </div>
            <div className="text-lg font-bold text-[#89726B]">
              €{(chartData.reduce((sum, p) => sum + p.profit, 0) / chartData.length).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">per product</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-xs font-medium text-muted-foreground">Margin Range:</span>
          <Badge variant="outline" className="bg-[#2C3E2D] text-white border-[#2C3E2D]">≥60% Excellent</Badge>
          <Badge variant="outline" className="bg-[#607C5F] text-white border-[#607C5F]">40-59% Good</Badge>
          <Badge variant="outline" className="bg-[#8B9687] text-white border-[#8B9687]">20-39% OK</Badge>
          <Badge variant="outline" className="bg-[#C2BDB0] text-[#3C2F2C] border-[#C2BDB0]">&lt;20% Low</Badge>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                label={{ value: 'Profit Margin (%)', position: 'insideBottom', offset: 0, fontSize: 10 }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80}
                tick={{ fontSize: 10 }}
              />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg min-w-[200px]">
                        <p className="font-semibold text-sm mb-2">{data.fullName}</p>
                        <Badge variant="outline" className="mb-2">{data.category}</Badge>
                        <div className="space-y-1.5 text-xs mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold">€{data.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Cost:</span>
                            <span className="font-semibold">€{data.cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t">
                            <span className="text-muted-foreground">Profit/Unit:</span>
                            <span className="font-bold text-green-600">€{data.profit.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Margin:</span>
                            <span className="font-bold text-green-600">{data.margin}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="margin" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.margin)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ordersData from "@/data/orders.json";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2C3E2D",
  },
  orders: {
    label: "Orders",
    color: "#607C5F",
  },
} satisfies ChartConfig;

function calculateDailySales(days: number = 30) {
  const salesByDate: Record<string, { date: Date; revenue: number; orders: number }> = {};

  ordersData.orders.forEach(order => {
    const orderDate = new Date(order.created_at);
    const dateKey = orderDate.toISOString().split('T')[0];
    
    if (!salesByDate[dateKey]) {
      salesByDate[dateKey] = { date: orderDate, revenue: 0, orders: 0 };
    }
    
    salesByDate[dateKey].revenue += order.total;
    salesByDate[dateKey].orders += 1;
  });

  return Object.values(salesByDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-days)
    .map(item => ({
      date: item.date.toISOString().split('T')[0],
      revenue: Number(item.revenue.toFixed(2)),
      orders: item.orders,
    }));
}

export function SalesTrendChart() {
  const [timeRange, setTimeRange] = React.useState("30d");
  
  const daysMap: { [key: string]: number } = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };
  
  const filteredData = calculateDailySales(daysMap[timeRange]);
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = filteredData.reduce((sum, d) => sum + d.orders, 0);
  const averageRevenue = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl font-bold">Sales Trend</CardTitle>
          <CardDescription>
            Daily revenue and orders analysis
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-40 rounded-lg"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 90 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 md:px-6 md:pt-6">
        <div className="grid grid-cols-3 gap-1 md:gap-4 mb-6">
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Total Revenue</div>
            <div className="text-base md:text-2xl font-bold text-[#2C3E2D]">
              €{totalRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Total Orders</div>
            <div className="text-base md:text-2xl font-bold text-[#607C5F]">
              {totalOrders}
            </div>
          </div>
          <div>
            <div className="text-xs md:text-sm text-muted-foreground mb-1">Avg Daily Revenue</div>
            <div className="text-base md:text-2xl font-bold text-gray-700">
              €{averageRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2C3E2D" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2C3E2D" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#607C5F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#607C5F" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                const day = date.getDate();
                const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const month = monthNames[date.getMonth()];
                return `${day} ${month}`;
              }}
            />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `€${value}`}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    const day = date.getDate();
                    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                    const month = monthNames[date.getMonth()];
                    const year = date.getFullYear();
                    return `${day} ${month} ${year}`;
                  }}
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [`€${Number(value).toFixed(2)}`, 'Revenue'];
                    }
                    return [value, 'Orders'];
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              yAxisId="orders"
              dataKey="orders"
              type="monotone"
              fill="url(#fillOrders)"
              stroke="#607C5F"
              strokeWidth={2}
              name="Orders"
            />
            <Area
              yAxisId="revenue"
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="#2C3E2D"
              strokeWidth={2}
              name="Revenue"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>

        <div className="flex items-center gap-2 mt-4 text-xs md:text-sm">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="font-medium">
            Showing sales trend for {timeRange === "7d" ? "last 7 days" : timeRange === "30d" ? "last 30 days" : "last 90 days"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
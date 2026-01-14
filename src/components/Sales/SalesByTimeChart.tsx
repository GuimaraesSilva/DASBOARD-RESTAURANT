'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import ordersData from "@/data/orders.json";
import { Clock, TrendingUp, Package, Calendar } from "lucide-react";

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#536657",
  },
  revenue: {
    label: "Revenue",
    color: "#2C3E2D",
  },
  avgTicket: {
    label: "Avg Ticket",
    color: "#89726B",
  },
} satisfies ChartConfig;

function calculateSalesByHour() {
  const salesByHour: Record<number, { orders: number; revenue: number }> = {};

  // Inicializar todas as horas
  for (let i = 0; i < 24; i++) {
    salesByHour[i] = { orders: 0, revenue: 0 };
  }

  ordersData.orders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    salesByHour[hour].orders += 1;
    salesByHour[hour].revenue += order.total;
  });

  return Object.entries(salesByHour)
    .map(([hour, data]) => ({
      hour: `${hour.padStart(2, '0')}:00`,
      hourNum: parseInt(hour),
      orders: data.orders,
      revenue: Number(data.revenue.toFixed(2)),
      avgTicket: data.orders > 0 ? Number((data.revenue / data.orders).toFixed(2)) : 0,
    }));
}

function getPeriodLabel(hour: number): string {
  if (hour >= 6 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 24) return "Evening";
  return "Night";
}

function getPeriodHourRange(period: string): number {
  switch(period) {
    case "Morning": return 6; // 6h-12h
    case "Afternoon": return 6; // 12h-18h
    case "Evening": return 6; // 18h-24h
    case "Night": return 6; // 0h-6h
    default: return 6;
  }
}

export function SalesByTimeChart() {
  const data = calculateSalesByHour();
  const activeHours = data.filter(item => item.orders > 0);
  
  // Métricas de pico
  const peakHour = activeHours.reduce((max, item) => 
    item.revenue > max.revenue ? item : max, 
    activeHours[0]
  );
  
  const peakOrders = activeHours.reduce((max, item) => 
    item.orders > max.orders ? item : max, 
    activeHours[0]
  );

  const bestTicket = activeHours.reduce((max, item) => 
    item.avgTicket > max.avgTicket ? item : max, 
    activeHours[0]
  );

  // Estatísticas por período COM contagem de horas ativas
  const periodStats = activeHours.reduce((acc, item) => {
    const period = getPeriodLabel(item.hourNum);
    if (!acc[period]) {
      acc[period] = { orders: 0, revenue: 0, activeHours: 0 };
    }
    acc[period].orders += item.orders;
    acc[period].revenue += item.revenue;
    acc[period].activeHours += 1; // Contar horas com vendas
    return acc;
  }, {} as Record<string, { orders: number; revenue: number; activeHours: number }>);

  const totalRevenue = activeHours.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = activeHours.reduce((sum, item) => sum + item.orders, 0);
  const avgTicketOverall = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calcular totais dos 3 períodos principais (excluindo Night)
  const mainPeriods = ['Morning', 'Afternoon', 'Evening'];
  const mainPeriodsTotal = mainPeriods.reduce((acc, period) => {
    const stats = periodStats[period];
    if (stats) {
      acc.orders += stats.orders;
      acc.revenue += stats.revenue;
      acc.activeHours += stats.activeHours;
    }
    return acc;
  }, { orders: 0, revenue: 0, activeHours: 0 });

  const mainPeriodsAvgTicket = mainPeriodsTotal.orders > 0 
    ? mainPeriodsTotal.revenue / mainPeriodsTotal.orders 
    : 0;
  
  const mainPeriodsRevenuePerHour = mainPeriodsTotal.activeHours > 0 
    ? mainPeriodsTotal.revenue / mainPeriodsTotal.activeHours 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Sales by Time of Day</CardTitle>
            <CardDescription>Detailed hourly analysis of revenue and orders</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4 text-orange-600" />
            <span>{activeHours.length} active hours</span>
          </div>
        </div>

        {/* KPIs de Pico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="bg-[#F0F4EF] p-3 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Peak Revenue Hour
            </div>
            <div className="text-lg font-bold text-[#2C3E2D]">{peakHour?.hour}</div>
            <div className="text-xs text-muted-foreground mt-1">
              €{peakHour?.revenue.toFixed(2)} • {peakHour?.orders} orders
            </div>
          </div>

          <div className="bg-[#F0F4EF] p-3 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Package className="h-3 w-3" />
              Most Orders
            </div>
            <div className="text-lg font-bold text-[#536657]">{peakOrders?.hour}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {peakOrders?.orders} orders • €{peakOrders?.revenue.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#F0F4EF] p-3 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Best Avg Ticket
            </div>
            <div className="text-lg font-bold text-[#89726B]">{bestTicket?.hour}</div>
            <div className="text-xs text-muted-foreground mt-1">
              €{bestTicket?.avgTicket.toFixed(2)} per order
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Gráfico principal */}
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis 
                dataKey="hour" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis 
                yAxisId="revenue"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `€${value}`}
                className="text-xs"
              />
              <YAxis 
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border">
                      <p className="font-semibold mb-2">{data.hour}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#2C3E2D]" />
                            Revenue
                          </span>
                          <span className="font-medium">€{data.revenue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#536657]" />
                            Orders
                          </span>
                          <span className="font-medium">{data.orders}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-2 border-t">
                          <span className="text-muted-foreground">Avg Ticket</span>
                          <span className="font-semibold text-[#89726B]">
                            €{data.avgTicket.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-1">
                          Period: {getPeriodLabel(data.hourNum)}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend 
                formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Bar 
                yAxisId="revenue"
                dataKey="revenue" 
                fill="#2C3E2D" 
                radius={[4, 4, 0, 0]}
                name="revenue"
              />
              <Bar 
                yAxisId="orders"
                dataKey="orders" 
                fill="#536657" 
                radius={[4, 4, 0, 0]}
                name="orders"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Estatísticas por Período */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(periodStats)
            .filter(([period]) => mainPeriods.includes(period))
            .map(([period, stats]) => {
              const revenuePerHour = stats.activeHours > 0 ? stats.revenue / stats.activeHours : 0;
              
              return (
                <div key={period} className="text-center p-3 bg-[#536657]/10 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">{period}</div>
                  <div className="text-lg font-bold text-[#2C3E2D]">
                    €{stats.revenue.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats.orders} orders • €{(stats.revenue / stats.orders).toFixed(2)}/order
                  </div>
                  <div className="text-xs font-semibold text-[#536657] mt-1">
                    {((stats.revenue / totalRevenue) * 100).toFixed(1)}% of revenue
                  </div>
                  <div className="text-xs font-medium text-[#89726B] mt-1.5 pt-1.5 border-t border-muted-foreground/20">
                    €{revenuePerHour.toFixed(2)}/hour • {stats.activeHours}h active
                  </div>
                </div>
              );
            })}

          {/* Card TOTAL dos 3 períodos principais */}
          <div className="text-center p-3 bg-linear-to-br from-[#2C3E2D] to-[#536657] rounded-lg text-white shadow-md">
            <div className="flex items-center justify-center gap-1 text-xs font-semibold mb-1">
              <Calendar className="h-3 w-3" />
              TOTAL DAY
            </div>
            <div className="text-lg font-bold">
              €{mainPeriodsTotal.revenue.toFixed(0)}
            </div>
            <div className="text-xs opacity-90 mt-1">
              {mainPeriodsTotal.orders} orders • €{mainPeriodsAvgTicket.toFixed(2)}/order
            </div>
            <div className="text-xs font-semibold mt-1 opacity-95">
              {((mainPeriodsTotal.revenue / totalRevenue) * 100).toFixed(1)}% of revenue
            </div>
            <div className="text-xs font-medium mt-1.5 pt-1.5 border-t border-white/20 opacity-90">
              €{mainPeriodsRevenuePerHour.toFixed(2)}/hour • {mainPeriodsTotal.activeHours}h active
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
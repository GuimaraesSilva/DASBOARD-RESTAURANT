'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import reservationsData from "@/data/reservations.json";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  confirmed: {
    label: "Confirmed",
    color: "#2C3E2D",
  },
  cancelled: {
    label: "Cancelled",
    color: "#8C7A6B",
  },
} satisfies ChartConfig;

export function ReservationsByDayChart() {
  const [timeRange, setTimeRange] = React.useState("all");
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Filtrar reservas por período
  const filteredReservations = React.useMemo(() => {
    if (timeRange === "all") {
      return reservationsData.reservations;
    }
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case "7d":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        return reservationsData.reservations;
    }
    
    return reservationsData.reservations.filter(reservation => 
      new Date(reservation.date) >= cutoffDate && new Date(reservation.date) <= now
    );
  }, [timeRange]);
  
  const dayCount = filteredReservations.reduce((acc, reservation) => {
    const day = new Date(reservation.date).getDay();
    if (!acc[day]) {
      acc[day] = { confirmed: 0, cancelled: 0 };
    }
    if (reservation.status === 'confirmed') {
      acc[day].confirmed++;
    } else if (reservation.status === 'cancelled') {
      acc[day].cancelled++;
    }
    return acc;
  }, {} as Record<number, { confirmed: number; cancelled: number }>);

  const chartData = dayNames.map((name, index) => ({
    day: name.substring(0, 3),
    confirmed: dayCount[index]?.confirmed || 0,
    cancelled: dayCount[index]?.cancelled || 0,
  }));

  const totalConfirmed = chartData.reduce((sum, d) => sum + d.confirmed, 0);
  const totalCancelled = chartData.reduce((sum, d) => sum + d.cancelled, 0);
  const totalReservations = totalConfirmed + totalCancelled;
  const confirmedPercentage = totalReservations > 0 
    ? ((totalConfirmed / totalReservations) * 100).toFixed(1) 
    : '0.0';

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center gap-2 space-y-0 py-2 sm:flex-row">
        <div className="grid flex-1 gap-1 text-left">
          <CardTitle className="text-xl">Reservations per Day</CardTitle>
          <CardDescription>Confirmed vs Cancelled reservations</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-32 md:w-40 rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="All time" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All time
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 90 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {totalReservations === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No reservations found for the selected period
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="confirmed"
                stackId="a"
                fill="var(--color-confirmed)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="cancelled"
                stackId="a"
                fill="var(--color-cancelled)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4 mt-4">
        <div className="flex gap-2 leading-none font-medium">
          {confirmedPercentage}% confirmation rate <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total: {totalReservations} reservations ({totalConfirmed} confirmed, {totalCancelled} cancelled)
        </div>
      </CardFooter>
    </Card>
  );
}
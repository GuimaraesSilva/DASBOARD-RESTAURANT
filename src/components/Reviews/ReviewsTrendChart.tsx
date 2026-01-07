'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, ComposedChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import reviewsData from "@/data/reviews.json";
import { TrendingUp, TrendingDown, Star } from "lucide-react";

const chartConfig = {
  averageRating: {
    label: "Avaliação Média",
    color: "#2C3E2D",
  },
  reviewCount: {
    label: "Número de Reviews",
    color: "#8B9687",
  },
  trendLine: {
    label: "Média Geral",
    color: "#89726B",
  },
} satisfies ChartConfig;

export function ReviewsTrendChart() {
  const [timeRange, setTimeRange] = React.useState("6m");

  // Agrupar reviews por mês
  const monthlyData = reviewsData.reviews.reduce((acc, review) => {
    const date = new Date(review.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        ratings: [],
        count: 0,
      };
    }
    
    acc[monthKey].ratings.push(review.rating);
    acc[monthKey].count++;
    
    return acc;
  }, {} as Record<string, { month: string; ratings: number[]; count: number }>);

  const allChartData = Object.values(monthlyData)
    .map(data => {
      const [year, month] = data.month.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        date: data.month,
        month: date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }),
        monthSort: data.month,
        averageRating: Number((data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length).toFixed(2)),
        reviewCount: data.count,
      };
    })
    .sort((a, b) => a.monthSort.localeCompare(b.monthSort));

  // Filtrar dados baseado no período selecionado
  const filteredData = React.useMemo(() => {
    let monthsToShow = 6;
    if (timeRange === "3m") {
      monthsToShow = 3;
    } else if (timeRange === "12m") {
      monthsToShow = 12;
    }
    return allChartData.slice(-monthsToShow);
  }, [timeRange, allChartData]);

  const latestRating = filteredData[filteredData.length - 1]?.averageRating || 0;
  const previousRating = filteredData[filteredData.length - 2]?.averageRating || 0;
  const trend = latestRating >= previousRating ? 'up' : 'down';
  const trendPercentage = previousRating > 0 
    ? (((latestRating - previousRating) / previousRating) * 100).toFixed(1)
    : '0.0';

  const totalReviews = filteredData.reduce((sum, d) => sum + d.reviewCount, 0);
  const overallAverage = filteredData.length > 0
    ? (filteredData.reduce((sum, d) => sum + (d.averageRating * d.reviewCount), 0) / totalReviews).toFixed(2)
    : '0.0';

  // Adicionar linha de tendência (média móvel simples)
  const dataWithTrend = filteredData.map((item) => ({
    ...item,
    trendLine: Number(overallAverage),
  }));

  return (
    <Card className="col-span-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-left">
          <CardTitle>Tendência de Avaliações</CardTitle>
          <CardDescription>
            Evolução das avaliações e número de reviews ao longo do tempo
          </CardDescription>
        </div>
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold">{overallAverage}</span>
              <span className="text-muted-foreground">média</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="text-muted-foreground">
              {totalReviews} reviews
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-40 rounded-lg sm:ml-auto"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder="Últimos 6 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="3m" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                Últimos 6 meses
              </SelectItem>
              <SelectItem value="12m" className="rounded-lg">
                Últimos 12 meses
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <ComposedChart 
            data={dataWithTrend} 
            margin={{ top: 20, right: 12, left: 12, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis 
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 5]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `${value}`}
                  formatter={(value, name) => {
                    if (name === 'averageRating') {
                      return [`${Number(value).toFixed(2)} `, 'Avaliação Média'];
                    }
                    if (name === 'trendLine') {
                      return [`${Number(value).toFixed(2)} `, 'Média Geral'];
                    }
                    return [`${value} reviews`, 'Total de Reviews'];
                  }}
                  indicator="line"
                />
              }
            />
            <Bar
              yAxisId="left"
              dataKey="reviewCount"
              fill="#8B9687"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="averageRating"
              fill="#2C3E2D"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="trendLine"
              stroke="#89726B"
              strokeWidth={2}
              dot={true}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
        
        <div className="flex items-center gap-2 pt-4 text-sm border-t mt-4">
          <div className={`flex items-center gap-1.5 font-medium ${trend === 'up' ? 'text-[#607C5F]' : 'text-[#8C7A6B]'}`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {trend === 'up' ? 'Aumento' : 'Diminuição'} de {Math.abs(Number(trendPercentage))}%
          </div>
          <div className="text-muted-foreground">
            comparado com o mês anterior
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
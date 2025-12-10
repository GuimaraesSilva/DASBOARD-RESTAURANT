"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { calculateBusinessOverview } from "@/lib/calculationsOverview"
import { TrendingUp, TrendingDown } from "lucide-react"

const chartConfig = {
  revenue: {
    label: "Receitas",
    color: "#536657",
  },
  expenses: {
    label: "Despesas",
    color: "#C3CEC4",
  },
  profit: {
    label: "Lucro",
    color: "#1B2B1F",
  },
} satisfies ChartConfig

export function BusinessOverviewChart() {
  const data = calculateBusinessOverview()
  
  // Calcular totais
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = (totalProfit / totalRevenue) * 100

  // Calcular tendência (comparando último mês com média anterior)
  const lastMonth = data[data.length - 1]
  const previousMonths = data.slice(0, -1)
  const avgPreviousProfit = previousMonths.reduce((sum, item) => sum + item.profit, 0) / previousMonths.length
  const profitTrend = lastMonth.profit > avgPreviousProfit

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visão Geral do Negócio</CardTitle>
            <CardDescription>
              Comparação entre receitas, despesas e lucro mensal
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">€{totalProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {profitTrend ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Lucro em crescimento</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Lucro em queda</span>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Margem: {profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                className="text-xs"
                tickFormatter={(value) => `€${value}`}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value, name) => [
                      `€${Number(value).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
                      chartConfig[name as keyof typeof chartConfig]?.label || name
                    ]}
                  />
                }
              />
              <Legend 
                formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Bar 
                dataKey="revenue" 
                fill="var(--color-revenue)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="var(--color-expenses)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="profit" 
                fill="var(--color-profit)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Receitas</p>
            <p className="text-2xl font-bold text-[#536657]">
              €{totalRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Despesas</p>
            <p className="text-2xl font-bold text-[#C3CEC4]">
              €{totalExpenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lucro Total</p>
            <p className="text-2xl font-bold text-[#1B2B1F]">
              €{totalProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
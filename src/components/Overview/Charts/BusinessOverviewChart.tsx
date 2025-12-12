"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { calculateBusinessOverview } from "@/lib/calculationsOverview"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const chartConfig = {
  revenue: {
    label: "Receitas",
    color: "#536657",
  },
  expenses: {
    label: "Despesas",
    color: "#C3CEC4",
  },
} satisfies ChartConfig

export function BusinessOverviewChart() {
  const data = calculateBusinessOverview()
  
  // Calcular totais
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Calcular tendência (comparar últimos 2 meses)
  let profitTrend: 'up' | 'down' | 'stable' = 'stable'
  
  if (data.length >= 2) {
    const lastMonth = data[data.length - 1]
    const previousMonth = data[data.length - 2]
    
    if (lastMonth.profit > previousMonth.profit) {
      profitTrend = 'up'
    } else if (lastMonth.profit < previousMonth.profit) {
      profitTrend = 'down'
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Business Overview</CardTitle>
            <CardDescription>
              Monthly analysis of revenue and expenses
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Total Profit</div>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{totalProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              {profitTrend === 'up' ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Positive Trend </span>
                </>
              ) : profitTrend === 'down' ? (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Negative Trend</span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-500">Stable</span>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Profit Margin: {profitMargin.toFixed(1)}%
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
                tickFormatter={(value) => `€${value.toLocaleString('pt-PT')}`}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null
                  
                  const monthData = data.find(d => d.month === label)
                  if (!monthData) return null
                  
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border">
                      <p className="font-semibold mb-2">{label}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#536657]" />
                            Revenue
                          </span>
                          <span className="font-medium">
                            €{monthData.revenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#89726B]" />
                            Expenses
                          </span>
                          <span className="font-medium">
                            €{monthData.expenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-2 border-t">
                          <span className="font-semibold">{monthData.profit >= 0 ? 'Lucro' : 'Perda'}</span>
                          <span className={`font-bold ${monthData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            €{Math.abs(monthData.profit).toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }}
              />
              <Legend 
                formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Bar 
                dataKey="revenue" 
                fill="#536657" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                fill="#89726B" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-[#536657]">
              €{totalRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">
              {data.length} {data.length === 1 ? 'month' : 'months'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-[#89726B]">
              €{totalExpenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">
              {totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : 0}% of revenue
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{totalProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">
              Margin: {profitMargin.toFixed(1)}%
            </p>
          </div>
        </div>
        
        {/* Tabela de detalhes mensais */}
        <div className="mt-6 border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F0F4EF]">
                <TableHead className="text-left">Month</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Profit / Loss</TableHead>
                <TableHead className="text-right">Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.month}</TableCell>
                  <TableCell className="text-right text-[#536657] font-medium">
                    {item.revenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}€
                  </TableCell>
                  <TableCell className="text-right text-[#89726B] font-medium">
                    {item.expenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}€
                  </TableCell>
                  <TableCell className={`text-right font-medium ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.profit.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}€
                  </TableCell>
                  <TableCell className="text-right">
                    {item.revenue > 0 ? ((item.profit / item.revenue) * 100).toFixed(1) : '0.0'}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
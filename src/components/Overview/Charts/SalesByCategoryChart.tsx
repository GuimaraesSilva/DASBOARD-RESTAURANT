"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import ordersData from "@/data/orders.json"
import productsData from "@/data/products.json"

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "#2C3E2D",
  },
} satisfies ChartConfig

const categoryColors: Record<string, string> = {
  "Carne": "#2C3E2D",
  "Bebidas": "#607C5F",
  "Acompanhamento": "#8B9687",
  "Entrada": "#C2BDB0",
  "Sobremesas": "#8C7A6B",
}

export function SalesByCategoryChart() {
  // Calcular vendas por categoria
  const salesByCategory = ordersData.order_items.reduce((acc, item) => {
    const product = productsData.products.find(p => p.id === item.product_id)
    if (product) {
      if (!acc[product.category]) {
        acc[product.category] = 0
      }
      acc[product.category] += item.subtotal
    }
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(salesByCategory).map(([category, revenue]) => ({
    category,
    revenue: Number(revenue.toFixed(2)),
    fill: categoryColors[category] || "#2C3E2D",
  }))

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Vendas por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value) => `€${value}`} />}
            />
            <Bar dataKey="revenue" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total de receita: €{totalRevenue.toFixed(2)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Baseado em {ordersData.orders.length} pedidos
        </div>
      </CardFooter>
    </Card>
  )
}
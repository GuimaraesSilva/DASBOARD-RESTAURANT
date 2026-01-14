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
  "Monitoring": "#8B9687",
  "Entrada": "#C2BDB0",
  "Sobremesas": "#8C7A6B",
}

// Função para truncar texto longo
const truncateText = (text: string, maxLength: number = 10): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function SalesByCategoryChart() {
  // Calcular vendas por categoria baseado nos pedidos reais
  // Primeiro, criar um mapa de categoria por produto para melhor performance
  const productCategoryMap = new Map<number, string>()
  productsData.products.forEach(product => {
    productCategoryMap.set(product.id, product.category)
  })

  // Calcular a proporção de cada item dentro de cada pedido
  const salesByCategory: Record<string, number> = {}
  
  ordersData.orders.forEach(order => {
    // Obter todos os itens deste pedido
    const orderItems = ordersData.order_items.filter(item => item.order_id === order.id)
    
    // Calcular o subtotal dos itens (sem impostos/taxas)
    const itemsSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0)
    
    // Se o subtotal dos itens for 0, pular este pedido
    if (itemsSubtotal === 0) return
    
    // Distribuir o total do pedido proporcionalmente entre as categorias
    orderItems.forEach(item => {
      const category = productCategoryMap.get(item.product_id)
      if (category) {
        // Calcular a proporção deste item no pedido
        const itemProportion = item.subtotal / itemsSubtotal
        // Aplicar a proporção ao total real do pedido (que inclui impostos)
        const itemRealValue = order.total * itemProportion
        
        salesByCategory[category] = (salesByCategory[category] || 0) + itemRealValue
      }
    })
  })

  const chartData = Object.entries(salesByCategory).map(([category, revenue]) => ({
    category,
    categoryFull: category, // Nome completo para o tooltip
    revenue: Number(revenue.toFixed(2)),
    fill: categoryColors[category] || "#2C3E2D",
  }))

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Sales by Category</CardTitle>
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
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => truncateText(value, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                labelFormatter={(_, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.categoryFull
                  }
                  return ''
                }}
                formatter={(value) => `€${value}`} 
              />}
            />
            <Bar dataKey="revenue" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total revenue: €{totalRevenue.toFixed(2)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on {ordersData.orders.length} orders
        </div>
      </CardFooter>
    </Card>
  )
}
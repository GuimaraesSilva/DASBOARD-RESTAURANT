"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { PaymentMethod } from "@/types/payment"
import ordersData from "@/data/orders.json"

interface PaymentMethodsChartProps {
  data: PaymentMethod[]
}

const chartConfig = {
  transactions: {
    label: "Transactions",
  },
  MBWay: {
    label: "MBWay",
    color: "#1B2B1F", // Verde escuro
  },
  Multibanco: {
    label: "ATM",
    color: "#C3CEC4", // Verde claro
  },
  Numérico: {
    label: "Cash",
    color: "#BDA69F", // Bege
  },
  Visa: {
    label: "Visa",
    color: "#3B2F2C", // Marrom escuro
  },
  Mastercard: {
    label: "Mastercard",
    color: "#536657", // Verde médio
  },
} satisfies ChartConfig

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  // Se não houver data, calcular dos pedidos
  const chartData = data || calculatePaymentMethods();

  const totalTransactions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.transactions, 0)
  }, [chartData])

  const topMethod = React.useMemo(() => {
    if (chartData.length === 0) return null
    return chartData.reduce((prev, current) => 
      current.transactions > prev.transactions ? current : prev
    )
  }, [chartData])

  const getColor = (method: string): string => {
    const config = chartConfig[method as keyof typeof chartConfig]
    if (config && typeof config === 'object' && 'color' in config) {
      return config.color as string
    }
    return "#8884d8" // cor padrão
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center">
        <CardTitle className="text-xl font-bold">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="flex">
        <ChartContainer
          config={chartConfig}
          className="aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend 
              content={<ChartLegendContent nameKey="method" />}
              verticalAlign="bottom"
            />
            <Pie
              data={chartData}
              dataKey="transactions"
              nameKey="method"
              innerRadius={55}
              strokeWidth={10}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold"
                          fill="#000000"
                        >
                          {totalTransactions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Transactions
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {topMethod && (
          <div className="flex items-center gap-2 leading-none font-medium">
            {topMethod.method} is the most used method <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="text-muted-foreground leading-none">
          Showing used payment methods in orders
        </div>
      </CardFooter>
    </Card>
  )
}

// Adicionar função para calcular se data não for fornecido
function calculatePaymentMethods() {
  const paymentCounts: Record<string, number> = {};
  
  ordersData.orders.forEach(order => {
    paymentCounts[order.payment_method] = (paymentCounts[order.payment_method] || 0) + 1;
  });

  return Object.entries(paymentCounts).map(([method, count]) => ({
    method,
    count,
    fill: getPaymentMethodColor(method),
  }));
}

function getPaymentMethodColor(method: string): string {
  const colors: Record<string, string> = {
    "Credit Card": "#2C3E2D",
    "Debit Card": "#607C5F",
    "Cash": "#8B9687",
    "MBWay": "#C2BDB0",
  };
  return colors[method] || "#8C7A6B";
}

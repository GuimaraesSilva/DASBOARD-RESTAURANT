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

interface PaymentMethodsChartProps {
  data: PaymentMethod[]
}

const chartConfig = {
  transactions: {
    label: "Transações",
  },
  MBWay: {
    label: "MBWay",
    color: "#1B2B1F", // Verde escuro
  },
  Multibanco: {
    label: "Multibanco",
    color: "#C3CEC4", // Verde claro
  },
  Numérico: {
    label: "Numerário",
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
  console.log('Payment Methods Data:', data); // Debug
  
  const totalTransactions = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.transactions, 0)
  }, [data])

  const topMethod = React.useMemo(() => {
    if (data.length === 0) return null
    return data.reduce((prev, current) => 
      current.transactions > prev.transactions ? current : prev
    )
  }, [data])

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
        <CardTitle className="text-xl font-bold">Métodos de Pagamento</CardTitle>
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
              data={data}
              dataKey="transactions"
              nameKey="method"
              innerRadius={55}
              strokeWidth={10}
            >
              {data.map((entry, index) => (
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
                          Transações
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
            {topMethod.method} é o método mais utilizado <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="text-muted-foreground leading-none">
          Mostrando métodos de pagamento utilizados
        </div>
      </CardFooter>
    </Card>
  )
}

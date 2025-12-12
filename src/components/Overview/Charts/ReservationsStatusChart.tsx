"use client"

import { Calendar } from "lucide-react"
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

import reservationsData from "@/data/reservations.json"

const chartConfig = {
  confirmed: {
    label: "Confirmadas",
    color: "#2C3E2D",
  },
  pending: {
    label: "Pendentes",
    color: "#8B9687",
  },
  cancelled: {
    label: "Canceladas",
    color: "#8C7A6B",
  },
} satisfies ChartConfig

export function ReservationsStatusChart() {
  // Contar reservas por status
  const statusCounts = reservationsData.reservations.reduce((acc, reservation) => {
    acc[reservation.status] = (acc[reservation.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const chartData = [
    {
      status: "Confirmadas",
      count: statusCounts.confirmed || 0,
      fill: "#2C3E2D",
    },
    {
      status: "Pendentes",
      count: statusCounts.pending || 0,
      fill: "#8B9687",
    },
    {
      status: "Canceladas",
      count: statusCounts.cancelled || 0,
      fill: "#8C7A6B",
    },
  ]

  const totalReservations = reservationsData.reservations.length
  const confirmedPercentage = ((statusCounts.confirmed / totalReservations) * 100).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Reservation Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {confirmedPercentage}% of confirmed reservations <Calendar className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total: {totalReservations} reservations
        </div>
      </CardFooter>
    </Card>
  )
}
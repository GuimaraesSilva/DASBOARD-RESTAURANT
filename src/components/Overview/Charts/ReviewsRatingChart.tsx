"use client"

import { Star } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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

import reviewsData from "@/data/reviews.json"

const chartConfig = {
  reviews: {
    label: "Avaliações",
  },
  "5": {
    label: "5 Estrelas",
    color: "#2C3E2D",
  },
  "4": {
    label: "4 Estrelas",
    color: "#607C5F",
  },
  "3": {
    label: "3 Estrelas",
    color: "#8B9687",
  },
  "2": {
    label: "2 Estrelas",
    color: "#C2BDB0",
  },
  "1": {
    label: "1 Estrela",
    color: "#8C7A6B",
  },
} satisfies ChartConfig

export function ReviewsRatingChart() {
  // Contar avaliações por rating
  const ratingCounts = reviewsData.reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const ratingColors: Record<string, string> = {
    "5": "#2C3E2D",
    "4": "#607C5F",
    "3": "#8B9687",
    "2": "#C2BDB0",
    "1": "#8C7A6B",
  }

  const chartData = Object.entries(ratingCounts).map(([rating, count]) => ({
    rating: `${rating}`,
    count,
    fill: ratingColors[rating],
  }))

  const totalReviews = reviewsData.reviews.length
  const averageRating = (
    reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
  ).toFixed(1)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold">Reviews</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="rating"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {averageRating}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Average
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
        <div className="flex items-center gap-2 font-medium leading-none">
          {averageRating} out of 5 stars <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on {totalReviews} reviews
        </div>
      </CardFooter>
    </Card>
  )
}
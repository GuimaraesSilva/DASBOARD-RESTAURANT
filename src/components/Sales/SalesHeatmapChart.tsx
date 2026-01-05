"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import ordersData from "@/data/orders.json"
import { useMemo } from "react"

export function SalesHeatmapChart() {
  const heatmapData = useMemo(() => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const periods = ['Morning', 'Afternoon', 'Evening']
    
    // Inicializar matriz de contagem (7 dias x 3 períodos)
    const salesMatrix = Array(7).fill(0).map(() => Array(3).fill(0))
    
    ordersData.orders.forEach(order => {
      const date = new Date(order.created_at)
      const dayIndex = (date.getDay() + 6) % 7
      const hour = date.getHours()
      
      // 3 períodos: Manhã (6-14h), Tarde (14-20h), Noite (20h+)
      let periodIndex = 0
      if (hour >= 6 && hour < 14) periodIndex = 0
      else if (hour >= 14 && hour < 20) periodIndex = 1
      else periodIndex = 2
      
      salesMatrix[dayIndex][periodIndex] += order.total
    })
    
    const maxSales = Math.max(...salesMatrix.flat())
    
    return { salesMatrix, maxSales, dayNames, periods }
  }, [])

  const getColorIntensity = (value: number) => {
    const intensity = (value / heatmapData.maxSales) * 100
    
    if (intensity === 0) return 'bg-gray-100'
    if (intensity < 25) return 'bg-[#E8F3E5]'
    if (intensity < 50) return 'bg-[#C3E4B8]'
    if (intensity < 75) return 'bg-[#607C5F]'
    return 'bg-[#2C3E2D]'
  }

  const getTextColor = (value: number) => {
    const intensity = (value / heatmapData.maxSales) * 100
    return intensity > 50 ? 'text-white' : 'text-gray-700'
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          Sales Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-1">
          {/* Header com períodos */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1 mb-1">
            <div className="text-xs font-medium text-muted-foreground w-16"></div>
            {heatmapData.periods.map((period) => (
              <div 
                key={period} 
                className="text-sm font-medium text-center text-muted-foreground"
              >
                {period}
              </div>
            ))}
          </div>
          
          {/* Matriz de calor */}
          {heatmapData.salesMatrix.map((dayData, dayIndex) => (
            <div key={dayIndex} className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1">
              <div className="text-sm font-medium text-muted-foreground flex items-center w-16">
                {heatmapData.dayNames[dayIndex]}
              </div>
              {dayData.map((sales, periodIndex) => (
                <div
                  key={periodIndex}
                  className={`
                    ${getColorIntensity(sales)}
                    ${getTextColor(sales)}
                    rounded p-1 text-center text-xs font-semibold
                    transition-all hover:scale-105 cursor-pointer
                    flex items-center justify-center min-h-7
                  `}
                  title={`${heatmapData.dayNames[dayIndex]} ${heatmapData.periods[periodIndex]}: €${sales.toFixed(2)}`}
                >
                  {sales > 0 ? `€${sales.toFixed(0)}` : '-'}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legenda compacta */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex gap-1">
            <div className="flex-1 h-2 bg-gray-100 rounded-l"></div>
            <div className="flex-1 h-2 bg-[#E8F3E5]"></div>
            <div className="flex-1 h-2 bg-[#C3E4B8]"></div>
            <div className="flex-1 h-2 bg-[#607C5F]"></div>
            <div className="flex-1 h-2 bg-[#2C3E2D] rounded-r"></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Low</span>
            <span className="text-xs text-muted-foreground">€{heatmapData.maxSales.toFixed(0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
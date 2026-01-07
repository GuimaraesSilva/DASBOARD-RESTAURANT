'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import reservationsData from "@/data/reservations.json";
import { Clock, TrendingUp, Calendar } from "lucide-react";

export function ReservationsByTimeChart() {
  // Criar objeto com contagem de reservas por hora
  const timeSlots = reservationsData.reservations.reduce((acc, reservation) => {
    const hour = reservation.time.split(':')[0];
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Gerar todos os horários de 11h às 23h (horário de funcionamento típico de restaurante)
  const allHours = Array.from({ length: 13 }, (_, i) => i + 11); // 11 até 23
  
  const chartData = allHours.map(hour => ({
    time: `${hour.toString().padStart(2, '0')}:00`,
    reservations: timeSlots[hour.toString()] || 0,
    hourNum: hour
  }));

  const totalReservations = chartData.reduce((sum, d) => sum + d.reservations, 0);
  const maxValue = Math.max(...chartData.map(d => d.reservations));
  const peakHour = chartData.find(d => d.reservations === maxValue);
  const avgReservationsPerHour = (totalReservations / chartData.length).toFixed(1);

  const lunchReservations = chartData
    .filter(d => d.hourNum >= 12 && d.hourNum <= 15)
    .reduce((sum, d) => sum + d.reservations, 0);
  
  const dinnerReservations = chartData
    .filter(d => d.hourNum >= 19 && d.hourNum <= 23)
    .reduce((sum, d) => sum + d.reservations, 0);

  const lunchPercentage = ((lunchReservations / totalReservations) * 100).toFixed(1);
  const dinnerPercentage = ((dinnerReservations / totalReservations) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#263321]" />
              Reservations by Time
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Distribution of {totalReservations} reservations throughout the day
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* KPIs Principais */}
        <div className="grid grid-cols-6 gap-3">
          <div className="bg-[#F5EDE8] p-3 rounded-lg border border-[#BDA69F]">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3 text-[#89726B]" />
              <span>Peak Hour</span>
            </div>
            <div className="text-lg font-bold text-[#263321]">{peakHour?.time}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {peakHour?.reservations} reservations
            </div>
          </div>

          <div className="bg-[#F5EDE8] p-3 rounded-lg border border-[#BDA69F]">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3 h-3 text-[#607C5F]" />
              <span>Lunch Period</span>
            </div>
            <div className="text-lg font-bold text-[#263321]">{lunchReservations}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {lunchPercentage}% of total
            </div>
          </div>

          <div className="bg-[#F5EDE8] p-3 rounded-lg border border-[#BDA69F]">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3 h-3 text-[#3C2F2C]" />
              <span>Dinner Period</span>
            </div>
            <div className="text-lg font-bold text-[#263321]">{dinnerReservations}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {dinnerPercentage}% of total
            </div>
          </div>

        {/* Insights */}
        <div className="bg-[#F5EDE8] p-3 rounded-lg border border-[#BDA69F] col-span-3">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-[#263321] mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-[#3C2F2C]">Key Insights:</p>
              <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
                <li>
                  Average of <span className="font-semibold text-[#263321]">{avgReservationsPerHour}</span> reservations per active hour
                </li>
                <li>
                  Peak time at <span className="font-semibold text-[#263321]">{peakHour?.time}</span> with {peakHour?.reservations} bookings
                </li>
                <li>
                  {dinnerReservations > lunchReservations ? 'Dinner' : 'Lunch'} period is busier with{' '}
                  <span className="font-semibold text-[#263321]">
                    {Math.max(dinnerReservations, lunchReservations)}
                  </span> reservations
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>

        {/* Gráfico */}
        <ChartContainer
          config={{
            reservations: { label: "Reservations", color: "#263321" },
          }}
          className="h-80 w-full"
        >
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#263321" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#607C5F" stopOpacity={0.75} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="#CDDBC8" 
              opacity={0.5}
            />
            <XAxis 
              dataKey="time" 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#89726B', fontSize: 11 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: '#89726B', fontSize: 11 }}
              label={{ 
                value: 'Reservations', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#89726B', fontSize: 12 }
              }}
            />
            <ChartTooltip 
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                
                const data = payload[0].payload;
                const percentage = ((data.reservations / totalReservations) * 100).toFixed(1);
                
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-[#BDA69F]">
                    <p className="font-semibold text-sm mb-2 text-[#263321]">{data.time}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Reservations:</span>
                        <span className="font-bold text-[#263321]">{data.reservations}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Percentage:</span>
                        <span className="font-semibold text-[#607C5F]">{percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">vs Average:</span>
                        <span className={`font-semibold ${
                          data.reservations > parseFloat(avgReservationsPerHour) 
                            ? 'text-[#607C5F]' 
                            : 'text-[#89726B]'
                        }`}>
                          {data.reservations > parseFloat(avgReservationsPerHour) ? '+' : ''}
                          {(data.reservations - parseFloat(avgReservationsPerHour)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
              cursor={{ fill: 'rgba(205, 219, 200, 0.15)' }}
            />
            <Bar 
              dataKey="reservations" 
              fill="url(#colorReservations)" 
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ChartContainer>

      </CardContent>
    </Card>
  );
}

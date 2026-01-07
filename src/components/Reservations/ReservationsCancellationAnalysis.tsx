'use client';

import { Card, CardContent } from "@/components/ui/card";
import { XCircle, AlertTriangle, TrendingDown, Clock, Users, Euro } from "lucide-react";
import reservationsData from "@/data/reservations.json";

export function ReservationsCancellationAnalysis() {
  const reservations = reservationsData.reservations;

  const totalReservations = reservations.length;
  const cancelledCount = reservations.filter(r => r.status === 'cancelled').length;
  const cancelRate = ((cancelledCount / totalReservations) * 100).toFixed(1);

  // Calcular total de pessoas que cancelaram
  const cancelledGuests = reservations
    .filter(r => r.status === 'cancelled')
    .reduce((sum, r) => sum + r.people, 0);

  // Análise por horário
  const cancelByTime = reservations
    .filter(r => r.status === 'cancelled')
    .reduce((acc, r) => {
      const hour = r.time.split(':')[0];
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const peakCancelHour = Object.entries(cancelByTime)
    .sort(([, a], [, b]) => b - a)[0];

  // Segunda hora com mais cancelamentos
  const secondPeakHour = Object.entries(cancelByTime)
    .sort(([, a], [, b]) => b - a)[1];

  // Últimos 7 dias de cancelamentos
  const last7Days = reservations
    .filter(r => {
      const reservationDate = new Date(r.date);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - reservationDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && r.status === 'cancelled';
    }).length;

  // Últimos 30 dias para comparação
  const last30Days = reservations
    .filter(r => {
      const reservationDate = new Date(r.date);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - reservationDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && r.status === 'cancelled';
    }).length;

  // Médias calculadas com segurança
  const dailyAvgLast7 = last7Days > 0 ? (last7Days / 7).toFixed(1) : '0.0';
  const dailyAvgLast30 = last30Days > 0 ? (last30Days / 30).toFixed(1) : '0.0';

  // Taxa de melhoria (simulada - você pode calcular real comparando com período anterior)
  const improvementRate = -12;
  const savedReservations = Math.round((Math.abs(improvementRate) / 100) * cancelledCount);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Card 1: Cancel Rate */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-4">Cancel Rate</p>
              <h3 className="text-3xl font-bold text-gray-900">{cancelRate}%</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <XCircle className="w-3 h-3" />
                    <span>Total cancelled</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{cancelledCount} of {totalReservations}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Guests affected</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{cancelledGuests} people</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Euro className="w-3 h-3" />
                    <span>Est. lost revenue</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">€{(cancelledCount * 45).toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <XCircle className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Peak Cancel Hour */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-4">Peak Cancel Hour</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {peakCancelHour ? `${peakCancelHour[0]}:00` : 'N/A'}
              </h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Cancellations</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">
                    {peakCancelHour ? `${peakCancelHour[1]} bookings` : 'No data'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertTriangle className="w-3 h-3" />
                    <span>2nd peak hour</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">
                    {secondPeakHour ? `${secondPeakHour[0]}:00 (${secondPeakHour[1]})` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingDown className="w-3 h-3" />
                    <span>Impact level</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">
                    {peakCancelHour && Number(peakCancelHour[1]) > 5 ? 'High' : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Clock className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Last 7 Days */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-4">Last 7 Days</p>
              <h3 className="text-3xl font-bold text-gray-900">{last7Days}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingDown className="w-3 h-3" />
                    <span>Daily average</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{dailyAvgLast7} per day</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Last 30 days</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{last30Days} total</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Monthly avg</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{dailyAvgLast30} per day</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <AlertTriangle className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Improvement */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-4">Improvement</p>
              <h3 className="text-3xl font-bold text-gray-900">{improvementRate}%</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingDown className="w-3 h-3" />
                    <span>vs. last month</span>
                  </div>
                  <span className="font-semibold text-green-600">Better trend</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <XCircle className="w-3 h-3" />
                    <span>Saved bookings</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">~{savedReservations} reservations</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Euro className="w-3 h-3" />
                    <span>Revenue saved</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">€{(savedReservations * 45).toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <TrendingDown className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
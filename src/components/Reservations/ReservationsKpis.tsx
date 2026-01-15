'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle2, XCircle, AlertCircle, Users, Clock, TrendingUp } from "lucide-react";
import reservationsData from "@/data/reservations.json";

export function ReservationsKpis() {
  const totalReservations = reservationsData.reservations.length;
  const confirmed = reservationsData.reservations.filter(r => r.status === 'confirmed').length;
  const pending = reservationsData.reservations.filter(r => r.status === 'pending').length;
  const cancelled = reservationsData.reservations.filter(r => r.status === 'cancelled').length;
  
  const confirmationRate = ((confirmed / totalReservations) * 100).toFixed(1);
  const cancellationRate = ((cancelled / totalReservations) * 100).toFixed(1);
  const pendingRate = ((pending / totalReservations) * 100).toFixed(1);

  // Calcular total de pessoas
  const totalGuests = reservationsData.reservations.reduce((sum, r) => sum + r.people, 0);
  const avgPartySize = (totalGuests / totalReservations).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Card 1: Total Reservations */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Total Reservations</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">{totalReservations}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Total guests</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{totalGuests}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Avg. party size</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{avgPartySize} guests</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Calendar className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Confirmed */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Confirmed</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">{confirmed}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-1 text-green-600">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 
                      key={i} 
                      className={`w-3 h-3 ${
                        i < Math.round(Number(confirmationRate) / 20) 
                          ? 'fill-green-600' 
                          : ''
                      }`} 
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Confirmation rate</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">
                    {confirmationRate}%
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <CheckCircle2 className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Pending */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Pending</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">{pending}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Awaiting</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{pending} reservations</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    <span>Pending rate</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{pendingRate}%</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <AlertCircle className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Cancelled */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Cancelled</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">{cancelled}</h3>
              
              <div className="space-y-1 mt-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <XCircle className="w-3 h-3" />
                    <span>Cancellations</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{cancelled} of {totalReservations}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Cancellation rate</span>
                  </div>
                  <span className="font-semibold text-[#412A22]">{cancellationRate}%</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <XCircle className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
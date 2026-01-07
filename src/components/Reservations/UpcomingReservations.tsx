"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users } from "lucide-react";
import reservationsData from "@/data/reservations.json";
import customersData from "@/data/customers.json";

export function UpcomingReservations() {
  // Pegar as próximas 7 reservas confirmadas, ordenadas por data (mais recentes primeiro)
  const upcomingReservations = reservationsData.reservations
    .filter((r) => r.status === "confirmed")
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 5);

  const getCustomerName = (customerId: number) => {
    const customer = customersData.customers.find((c) => c.id === customerId);
    return customer?.name || "Unknown";
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Se não houver reservas confirmadas
  if (upcomingReservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Confirmed Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No confirmed reservations found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Confirmed Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingReservations.map((reservation, index) => {
            const customerName = getCustomerName(reservation.customer_id);
            return (
              <div
                key={reservation.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/70 hover:bg-muted/90 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#263321] text-white font-semibold">
                      {getInitials(customerName)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-[#BDA69F] text-[#412A22] text-xs font-bold"
                  >
                    {index + 1}
                  </Badge>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{customerName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span className="font-medium">
                        {new Date(reservation.date).toLocaleDateString("pt-PT", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span>{reservation.time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {reservation.people}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Customer } from "@/types/metric";
import { activeCount, computeKpis } from "@/lib/metrics";
import { Users, CalendarCheck, CalendarClock, TrendingDown } from "lucide-react";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export function CustomersKpis({ customers }: { customers: Customer[] }) {
  const k = computeKpis(customers);
  const active30 = activeCount(customers, 30);
  const active90 = activeCount(customers, 90);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">Clients</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{k.totalCustomers}</h3>
              <div className="text-xs text-muted-foreground mt-2">
                Active 30d: {active30} • Active 90d: {active90}
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Users className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">Visits</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{k.totalVisits}</h3>
              <div className="text-xs text-muted-foreground mt-2">
                Average per client: {k.avgVisits.toFixed(1)}
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <CalendarCheck className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">Reservations</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{k.totals.made}</h3>
              <div className="text-xs text-muted-foreground mt-2">
                Cancelled: {k.totals.cancelled} • No-shows: {k.totals.noShows}
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <CalendarClock className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="font-medium text-gray-600 mb-2 md:mb-4">Rates</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{pct(k.noShowRateTotal)}</h3>
              <div className="text-xs text-muted-foreground mt-2">
                No-show • Cancellation: {pct(k.cancelRateTotal)}
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

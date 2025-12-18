"use client";

import type { Customer } from "@/types/metric";
import {
  cancelRate,
  noShowRate,
  formatDatePT,
  maskEmail,
  maskPhone,
  daysSince,
} from "@/lib/metrics";
import { segmentOf } from "@/lib/segments";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export function CustomerSheet({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customer: Customer | null;
}) {
  if (!customer) return null;

  const seg = segmentOf(customer);
  const ds = daysSince(customer.last_visit_date);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {customer.name}
            <Badge variant="secondary">{seg}</Badge>
          </SheetTitle>
          <SheetDescription>
            Última visita: {formatDatePT(customer.last_visit_date)} ({ds} dias)
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium">{maskEmail(customer.email)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Telefone</div>
              <div className="font-medium">{maskPhone(customer.phone)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Visitas</div>
              <div className="font-medium">{customer.visits}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Reservas feitas</div>
              <div className="font-medium">{customer.reservations.made}</div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Canceladas</div>
              <div className="font-medium">
                {customer.reservations.cancelled}
              </div>
              <div className="text-xs text-muted-foreground">
                {pct(cancelRate(customer))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">No-shows</div>
              <div className="font-medium">
                {customer.reservations.no_shows}
              </div>
              <div className="text-xs text-muted-foreground">
                {pct(noShowRate(customer))}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Score simples</div>
              <div className="font-medium">
                {(customer.visits * (1 - noShowRate(customer))).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                fidelização vs no-show
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

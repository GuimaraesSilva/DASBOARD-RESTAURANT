"use client";

import type { Customer } from "@/types/metric";
import {
  cancelRate,
  noShowRate,
  formatDatePT,
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
import { Card } from "@/components/ui/card";
import {
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  XCircle,
  AlertCircle,
  Award,
} from "lucide-react";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

function getSegmentColor(segment: string) {
  const colors: Record<string, string> = {
    VIP: "bg-purple-100 text-purple-800 border-purple-200",
    Regular: "bg-blue-100 text-blue-800 border-blue-200",
    Novo: "bg-green-100 text-green-800 border-green-200",
    Inativo: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return colors[segment] || "bg-gray-100 text-gray-800";
}

function getScoreColor(score: number) {
  if (score >= 20) return "text-green-600";
  if (score >= 10) return "text-blue-600";
  if (score >= 5) return "text-orange-600";
  return "text-red-600";
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatPhone(phone?: string | null): string {
  if (!phone) return "—";
  // Remover todos os espaços e caracteres especiais
  const cleaned = phone.replace(/\s+/g, "").replace(/\D/g, "");
  // Formato esperado: +351 903105183
  if (cleaned.length === 12 && cleaned.startsWith("351")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  // Se o número começar com 351 mas tiver 11 dígitos
  if (cleaned.length === 11 && cleaned.startsWith("351")) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  // Se o número tiver 9 dígitos (número português sem código de país)
  if (cleaned.length === 9) {
    return `+351 ${cleaned}`;
  }
  // Retornar o telefone original se não corresponder aos formatos esperados
  return phone;
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
  const score = (customer.visits * (1 - noShowRate(customer))).toFixed(1);
  const cancelRateVal = cancelRate(customer);
  const noShowRateVal = noShowRate(customer);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-[90vw] sm:max-w-md overflow-y-auto px-3 sm:px-4 bg-[#F5F5F5]">
        <SheetHeader className="space-y-3 pt-16 sm:pt-20 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#263321] flex items-center justify-center text-white font-semibold shadow-sm shrink-0">
                {getInitials(customer.name)}
              </div>
              <SheetTitle className="text-xl sm:text-2xl font-bold wrap-break-word">
                {customer.name}
              </SheetTitle>
            </div>
            <Badge
              variant="outline"
              className={`${getSegmentColor(seg)} font-semibold text-xs sm:text-sm self-start sm:self-auto`}
            >
              {seg}
            </Badge>
          </div>
          <SheetDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              Última visita: {formatDatePT(customer.last_visit_date)}
            </div>
            <span className="text-muted-foreground ml-5 sm:ml-0">({ds} dias)</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 sm:space-y-4 pb-6">
          {/* Informações de Contato */}
          <Card className="p-3 sm:p-4 bg-muted/30">
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Informações de Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium text-sm sm:text-base break-all">{customer.email || "—"}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">Telefone</div>
                  <div className="font-medium text-sm sm:text-base">{formatPhone(customer.phone)}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Estatísticas de Visitas */}
          <Card className="p-3 sm:p-4 bg-muted/30">
            <h3 className="text-xs sm:text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Histórico de Reservas
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  <div className="text-xs text-muted-foreground">Visitas</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {customer.visits}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  <div className="text-xs text-muted-foreground">
                    Reservas
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {customer.reservations.made}
                </div>
              </div>
            </div>
          </Card>

          <Separator className="my-2 sm:my-4"/>

          {/* Métricas de Comportamento */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Métricas de Comportamento
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <Card className="p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mx-auto" />
                <div className="text-xs text-muted-foreground mt-1 sm:mt-2">
                  Cancel.
                </div>
                <div className="text-lg sm:text-xl font-bold mt-1">
                  {customer.reservations.cancelled}
                </div>
              </Card>

              <Card className="p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mx-auto" />
                <div className="text-xs text-muted-foreground mt-1 sm:mt-2">
                  No-show
                </div>
                <div className="text-lg sm:text-xl font-bold mt-1">
                  {customer.reservations.no_shows}
                </div>
              </Card>

              <Card className="p-3 sm:p-4 text-center hover:shadow-md transition-shadow">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mx-auto" />
                <div className="text-xs text-muted-foreground mt-1 sm:mt-2">
                  Score
                </div>
                <div className={`text-lg sm:text-xl font-bold mt-1 ${getScoreColor(Number(score))}`}>
                  {score}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
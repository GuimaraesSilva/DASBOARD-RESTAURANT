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
      <SheetContent className="sm:max-w-sm overflow-y-auto px-4 bg-[#F5F5F5]">
        <SheetHeader className="space-y-3 pt-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#263321] flex items-center justify-center text-white font-semibold shadow-sm">
                {getInitials(customer.name)}
              </div>
              <SheetTitle className="text-2xl font-bold">
                {customer.name}
              </SheetTitle>
            </div>
            <Badge
              variant="outline"
              className={`${getSegmentColor(seg)} font-semibold`}
            >
              {seg}
            </Badge>
          </div>
          <SheetDescription className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Última visita: {formatDatePT(customer.last_visit_date)}
            <span className="text-muted-foreground">({ds} dias)</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-2">
          {/* Informações de Contato */}
          <Card className="p-4 bg-muted/30">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações de Contato
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="font-medium">{customer.email || "—"}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-6 w-6 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Telefone</div>
                  <div className="font-medium">{formatPhone(customer.phone)}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Estatísticas de Visitas */}
          <Card className="p-4 bg-muted/30">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Histórico de Reservas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <div className="text-xs text-muted-foreground">Visitas</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {customer.visits}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <div className="text-xs text-muted-foreground">
                    Reservas feitas
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {customer.reservations.made}
                </div>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Métricas de Comportamento */}
          <div>
            <h3 className="text-sm font-semibold mt-4 mb-2 text-muted-foreground uppercase tracking-wide">
              Métricas de Comportamento
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <XCircle className="h-8 w-8 text-orange-500 mx-auto" />
                <div className="text-sm text-muted-foreground">
                  Canceladas
                </div>
                <div className="text-xl font-bold">
                  {customer.reservations.cancelled}
                </div>
              </Card>

              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                <div className="text-sm text-muted-foreground">
                  No-shows
                </div>
                <div className="text-xl font-bold">
                  {customer.reservations.no_shows}
                </div>
              </Card>

              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <Award className="h-8 w-8 text-purple-500 mx-auto" />
                <div className="text-sm text-muted-foreground">
                  Score
                </div>
                <div className={`text-xl font-bold ${getScoreColor(Number(score))}`}>
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
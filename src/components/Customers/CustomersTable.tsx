"use client";

import * as React from "react";
import type { Customer } from "@/types/metric";
import { segmentOf, Segment } from "@/lib/segments";
import { cancelRate, noShowRate, formatDatePT, daysSince } from "@/lib/metrics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerSheet } from "@/components/Customers/CustomersSheet";

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

const segmentOptions: (Segment | "Todos")[] = [
  "Todos",
  "VIP",
  "Novo",
  "Em risco",
  "Risco no-show",
  "Cancelador frequente",
  "Regular",
];

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = React.useState("");
  const [segmentFilter, setSegmentFilter] = React.useState<Segment | "Todos">("Todos");
  const [selected, setSelected] = React.useState<Customer | null>(null);
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return customers
      .filter((c) => {
        const seg = segmentOf(c);
        if (segmentFilter !== "Todos" && seg !== segmentFilter) return false;

        if (!q) return true;
        const hay = `${c.name} ${c.email ?? ""} ${c.phone ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0));
  }, [customers, query, segmentFilter]);

  function openCustomer(c: Customer) {
    setSelected(c);
    setOpen(true);
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

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Pesquisar por nome, email, telefone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Segmento: {segmentFilter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {segmentOptions.map((s) =>
                s === "Todos" ? (
                  <React.Fragment key={s}>
                    <DropdownMenuItem onClick={() => setSegmentFilter("Todos")}>
                      Todos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </React.Fragment>
                ) : (
                  <DropdownMenuItem key={s} onClick={() => setSegmentFilter(s)}>
                    {s}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => { setQuery(""); setSegmentFilter("Todos"); }}>
            Limpar
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Última visita</TableHead>
              <TableHead className="text-right">Visitas</TableHead>
              <TableHead className="text-right">Reservas</TableHead>
              <TableHead className="text-right">No-show</TableHead>
              <TableHead className="text-right">Cancel.</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((c) => {
              const seg = segmentOf(c);
              const ds = daysSince(c.last_visit_date);

              return (
                <TableRow key={String(c.id)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{c.name}</div>
                      <Badge
                        variant="outline"
                        className={`${getSegmentColor(seg)} font-semibold`}
                      >
                        {seg}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.email ?? c.phone ?? "—"}
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm">{formatDatePT(c.last_visit_date)}</div>
                    <div className="text-xs text-muted-foreground">{ds} dias</div>
                  </TableCell>

                  <TableCell className="text-right font-medium">{c.visits}</TableCell>

                  <TableCell className="text-right">
                    <div className="text-sm">{c.reservations.made}</div>
                    <div className="text-xs text-muted-foreground">
                      C:{c.reservations.cancelled} • N:{c.reservations.no_shows}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="font-medium">{pct(noShowRate(c))}</div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="font-medium">{pct(cancelRate(c))}</div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openCustomer(c)}>
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerSheet open={open} onOpenChange={setOpen} customer={selected} />
    </div>
  );
}
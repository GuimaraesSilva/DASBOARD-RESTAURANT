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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 10;

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = React.useState("");
  const [segmentFilter, setSegmentFilter] = React.useState<Segment | "Todos">("Todos");
  const [selected, setSelected] = React.useState<Customer | null>(null);
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

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

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [query, segmentFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCustomers = filtered.slice(startIndex, endIndex);

  function openCustomer(c: Customer) {
    setSelected(c);
    setOpen(true);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Pesquisar por nome, email, telefone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
        />

        <div className="flex items-center gap-2">
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
            {paginatedCustomers.map((c) => {
              const seg = segmentOf(c);
              const ds = daysSince(c.last_visit_date);

              return (
                <TableRow key={String(c.id)}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{c.name}</div>
                      <Badge variant="secondary">{seg}</Badge>
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

            {!paginatedCustomers.length && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filtered.length)} de {filtered.length} clientes
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <CustomerSheet open={open} onOpenChange={setOpen} customer={selected} />
    </div>
  );
}
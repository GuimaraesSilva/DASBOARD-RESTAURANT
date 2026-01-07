'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import productsData from "@/data/products.json";
import { AlertTriangle, TrendingUp } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Carne": "bg-[#3C2F2C] text-white border-[#3C2F2C]",
  "Bebidas": "bg-[#536657] text-white border-[#536657]",
  "Acompanhamento": "bg-[#8B9687] text-white border-[#8B9687]",
  "Entrada": "bg-[#263321] text-white border-[#263321]",
  "Sobremesas": "bg-[#BDA69F] text-[#3C2F2C] border-[#BDA69F]",
};

export function ProductsTable() {
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All");

  const categories = ["All", ...Array.from(new Set(productsData.products.map(p => p.category)))];

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return productsData.products
      .filter(p => {
        if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
        if (!q) return true;
        return p.name.toLowerCase().includes(q);
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, categoryFilter]);

  const calculateMargin = (price: number, cost: number) => {
    return ((price - cost) / price * 100).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">All Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <Input
            placeholder="Search by product name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="sm:max-w-sm"
          />

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Category: {categoryFilter}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((cat, idx) =>
                  cat === "All" ? (
                    <React.Fragment key={cat}>
                      <DropdownMenuItem onClick={() => setCategoryFilter("All")}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </React.Fragment>
                  ) : (
                    <DropdownMenuItem key={cat} onClick={() => setCategoryFilter(cat)}>
                      {cat}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={() => { setQuery(""); setCategoryFilter("All"); }}>
              Clear
            </Button>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Stock Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const margin = parseFloat(calculateMargin(product.price, product.cost));
                const stockValue = product.price * product.stock;
                const isLowStock = product.stock < 10;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={categoryColors[product.category] || "bg-gray-100"}>
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      €{product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      €{product.cost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${margin > 50 ? 'text-green-600' : margin > 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">{margin}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${isLowStock ? 'text-red-600' : ''}`}>
                        {isLowStock && <AlertTriangle className="w-3 h-3" />}
                        <span className="font-medium">{product.stock}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      €{stockValue.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}

              {!filtered.length && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import productsData from "@/data/products.json";

export function StockAlertsCard() {
  const lowStockProducts = productsData.products
    .filter(p => p.stock < 10)
    .sort((a, b) => a.stock - b.stock);

  const criticalStock = lowStockProducts.filter(p => p.stock < 5);
  const warningStock = lowStockProducts.filter(p => p.stock >= 5);

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Products that need restocking</CardDescription>
          </div>
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {lowStockProducts.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">All products are well stocked!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Critical Stock - Less than 5 */}
            {criticalStock.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Critical ({criticalStock.length})
                </h4>
                {criticalStock.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Stock</p>
                        <p className="text-lg font-bold text-red-600">{product.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="text-sm font-semibold">€{(product.price * product.stock).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Stock - Between 5 and 10 */}
            {warningStock.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Warning ({warningStock.length})
                </h4>
                {warningStock.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Stock</p>
                        <p className="text-lg font-bold text-yellow-600">{product.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="text-sm font-semibold">€{(product.price * product.stock).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

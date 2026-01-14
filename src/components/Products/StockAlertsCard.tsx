'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package } from "lucide-react";
import productsData from "@/data/products.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function StockAlertsCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'critical' | 'warning' | null>(null);

  const lowStockProducts = productsData.products
    .filter(p => p.stock < 30)
    .sort((a, b) => a.stock - b.stock);

  const criticalStock = lowStockProducts.filter(p => p.stock < 20);
  const warningStock = lowStockProducts.filter(p => p.stock >= 20 && p.stock < 30);

  const openDialog = (type: 'critical' | 'warning') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const getDialogProducts = () => {
    return dialogType === 'critical' ? criticalStock : warningStock;
  };

  const renderProductCard = (product: typeof productsData.products[0], isCritical: boolean) => (
    <div 
      key={product.id} 
      className={`flex items-center justify-between p-3 rounded-lg ${
        isCritical 
          ? 'bg-red-50 border border-red-200' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      <div className="flex-1">
        <p className="font-medium text-sm">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.category}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Stock</p>
          <p className={`text-lg font-bold ${
            isCritical ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {product.stock}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Value</p>
          <p className="text-sm font-semibold">€{(product.price * product.stock).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                Stock Alerts
              </CardTitle>
              <CardDescription>Products that need restocking</CardDescription>
            </div>
            <Badge className="text-lg py-1 bg-[#FFEBEB] text-red-600 font-semibold">
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
            <div className="space-y-4">
              {/* Critical Stock */}
              {criticalStock.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Critical ({criticalStock.length})
                  </h4>
                  {criticalStock.slice(0, 2).map((product) => renderProductCard(product, true))}
                  
                  {criticalStock.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog('critical')}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Ver mais {criticalStock.length - 2} produto{criticalStock.length - 2 !== 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              )}

              {/* Warning Stock */}
              {warningStock.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Warning ({warningStock.length})
                  </h4>
                  {warningStock.slice(0, 2).map((product) => renderProductCard(product, false))}
                  
                  {warningStock.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog('warning')}
                      className="w-full text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                    >
                      Ver mais {warningStock.length - 2} produto{warningStock.length - 2 !== 1 ? 's' : ''}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${
                dialogType === 'critical' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              {dialogType === 'critical' ? 'Critical' : 'Warning'} Stock Alerts
            </DialogTitle>
            <DialogDescription>
              {getDialogProducts().length} produto{getDialogProducts().length !== 1 ? 's' : ''} que precisa{getDialogProducts().length !== 1 ? 'm' : ''} de reposição
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 overflow-y-auto max-h-[calc(80vh-140px)] pr-2">
            {getDialogProducts().map((product) => renderProductCard(product, dialogType === 'critical'))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
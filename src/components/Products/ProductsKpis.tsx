'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Package, Euro, TrendingUp, AlertTriangle } from "lucide-react";
import productsData from "@/data/products.json";
import ordersData from "@/data/orders.json";

function calculateProductsMetrics() {
  const products = productsData.products;
  
  // Total de produtos
  const totalProducts = products.length;
  
  // Valor total em stock (preço * quantidade)
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  
  // Margem de lucro média
  const avgProfitMargin = products.reduce((sum, p) => {
    const margin = ((p.price - p.cost) / p.price) * 100;
    return sum + margin;
  }, 0) / products.length;
  
  // Produtos com stock baixo (menos de 20 unidades)
  const lowStockProducts = products.filter(p => p.stock < 20).length;
  
  // Calcular produto mais vendido
  const productSales = new Map<number, number>();
  ordersData.order_items.forEach(item => {
    const current = productSales.get(item.product_id) || 0;
    productSales.set(item.product_id, current + item.quantity);
  });
  
  const topProductId = Array.from(productSales.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  
  const topProduct = products.find(p => p.id === topProductId);
  
  return {
    totalProducts,
    totalStockValue,
    avgProfitMargin,
    lowStockProducts,
    topProduct: topProduct?.name || 'N/A'
  };
}

export function ProductsKpis() {
  const metrics = calculateProductsMetrics();
  
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      {/* Total Products */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Total Products</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">{metrics.totalProducts}</h3>
              <div className="text-xs text-muted-foreground mt-2">
                Active in menu
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Package className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Value */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Stock Value</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                €{metrics.totalStockValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
              </h3>
              <div className="text-xs text-muted-foreground mt-2">
                Total inventory value
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <Euro className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Profit Margin */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Avg Profit Margin</p>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">
                {metrics.avgProfitMargin.toFixed(1)}%
              </h3>
              <div className="text-xs text-muted-foreground mt-2">
                Across all products
              </div>
            </div>
            <div className="p-2 rounded-full bg-[#BDA69F]">
              <TrendingUp className="w-6 h-6 text-[#412A22]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <p className="text-sm md:font-medium text-gray-600 mb-4">Low Stock Alert</p>
              <h3 className="text-lg md:text-2xl font-bold text-red-600">
                {metrics.lowStockProducts}
              </h3>
              <div className="text-xs text-muted-foreground mt-2">
                Products below 20 units
              </div>
            </div>
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
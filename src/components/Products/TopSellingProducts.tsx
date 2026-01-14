'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy, Star } from "lucide-react";
import productsData from "@/data/products.json";
import ordersData from "@/data/orders.json";

interface ProductSales {
  id: number;
  name: string;
  category: string;
  price: number;
  quantitySold: number;
  revenue: number;
  orderCount: number;
}

function calculateTopProducts(): ProductSales[] {
  const productSalesMap = new Map<number, { quantity: number; orderCount: number }>();

  // Calculate quantity sold and number of orders per product
  ordersData.order_items.forEach(item => {
    const current = productSalesMap.get(item.product_id) || { quantity: 0, orderCount: 0 };
    productSalesMap.set(item.product_id, {
      quantity: current.quantity + item.quantity,
      orderCount: current.orderCount + 1,
    });
  });

  // Map to product details and calculate revenue
  const topProducts: ProductSales[] = [];
  
  productSalesMap.forEach((sales, productId) => {
    const product = productsData.products.find(p => p.id === productId);
    if (product) {
      topProducts.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantitySold: sales.quantity,
        revenue: sales.quantity * product.price,
        orderCount: sales.orderCount,
      });
    }
  });

  return topProducts.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
}

const categoryColors: Record<string, string> = {
  "Carne": "bg-[#3C2F2C] text-white border-[#3C2F2C]",
  "Bebidas": "bg-[#536657] text-white border-[#536657]",
  "Monitoring": "bg-[#8B9687] text-white border-[#8B9687]",
  "Entrada": "bg-[#263321] text-white border-[#263321]",
  "Sobremesas": "bg-[#BDA69F] text-[#3C2F2C] border-[#BDA69F]",
};

export function TopSellingProducts() {
  const topProducts = calculateTopProducts();
  const totalRevenue = topProducts.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Based on revenue generated</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold text-green-600">
              €{totalRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                index === 0 ? 'bg-yellow-50 border-yellow-300' : 
                index === 1 ? 'bg-gray-50 border-gray-300' : 
                index === 2 ? 'bg-orange-50 border-orange-300' : 
                'bg-white'
              }`}
            >
              {/* Ranking */}
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#2C3E2D] text-white font-bold text-lg">
                {index === 0 && <Trophy className="h-5 w-5 text-yellow-400" />}
                {index === 1 && <Star className="h-5 w-5 text-gray-400" />}
                {index === 2 && <Star className="h-5 w-5 text-orange-400" />}
                {index > 2 && <span>{index + 1}</span>}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{product.name}</p>
                <Badge 
                  variant="outline" 
                  className={`${categoryColors[product.category] || 'bg-gray-100'} mt-1`}
                >
                  {product.category}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Qty Sold</p>
                  <p className="text-lg font-bold">{product.quantitySold}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-lg font-semibold">{product.orderCount}</p>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-lg font-bold text-green-600">
                      €{product.revenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ordersData from "@/data/orders.json";
import productsData from "@/data/products.json";
import { Badge } from "@/components/ui/badge";

interface ProductSale {
  id: number;
  name: string;
  category: string;
  quantity: number;
  revenue: number;
  price: number;
}

function calculateTopProducts(): ProductSale[] {
  const productSales = new Map<number, { quantity: number; revenue: number }>();

  ordersData.orders.forEach(order => {
    const orderItems = ordersData.order_items.filter(item => item.order_id === order.id);
    const itemsSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    orderItems.forEach(item => {
      const current = productSales.get(item.product_id) || { quantity: 0, revenue: 0 };
      const itemProportion = item.subtotal / itemsSubtotal;
      const itemRealRevenue = order.total * itemProportion;

      productSales.set(item.product_id, {
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + itemRealRevenue,
      });
    });
  });

  return Array.from(productSales.entries())
    .map(([productId, sales]) => {
      const product = productsData.products.find(p => p.id === productId);
      if (!product) return null;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: sales.quantity,
        revenue: sales.revenue,
        price: product.price,
      };
    })
    .filter((p): p is ProductSale => p !== null)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

const categoryColors: Record<string, string> = {
  "Carne": "bg-[#3C2F2C] text-white border-[#3C2F2C]",
  "Bebidas": "bg-[#536657] text-white border-[#536657]",
  "Monitoring": "bg-[#8B9687] text-white border-[#8B9687]",
  "Entrada": "bg-[#263321] text-white border-[#263321]",
  "Sobremesas": "bg-[#BDA69F] text-[#3C2F2C] border-[#BDA69F]",
};

export function TopProductsTable() {
  const products = calculateTopProducts();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Top 10 Best-Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/5">Product</TableHead>
                <TableHead className="w-1/5">Category</TableHead>
                <TableHead className="w-1/5 text-right">Quantity Sold</TableHead>
                <TableHead className="w-1/5 text-right">Unit Price</TableHead>
                <TableHead className="w-1/5 text-right">Total Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#263321] flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={categoryColors[product.category] || "bg-gray-100"}>
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    €{product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    €{product.revenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
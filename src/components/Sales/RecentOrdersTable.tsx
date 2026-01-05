'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ordersData from "@/data/orders.json";
import customersData from "@/data/customers.json";
import { ShoppingBag } from "lucide-react";

interface RecentOrder {
  id: number;
  customer_name: string;
  total: number;
  payment_method: string;
  created_at: string;
  items_count: number;
}

function getRecentOrders(limit: number = 15): RecentOrder[] {
  return ordersData.orders
    .map(order => {
      const customer = customersData.customers.find(c => c.id === order.customer_id);
      const items = ordersData.order_items.filter(item => item.order_id === order.id);

      return {
        id: order.id,
        customer_name: customer?.name || 'Unknown Customer',
        total: order.total,
        payment_method: order.payment_method,
        created_at: order.created_at,
        items_count: items.length,
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

// Mapeamento baseado nos métodos de pagamento reais do JSON
const paymentMethodColors: Record<string, string> = {
  "MBWay": "bg-[#263321] text-white border-[#263321]",
  "Multibanco": "bg-[#C3CEC4] text-[#263321] border-[#C3CEC4]",
  "Numérico": "bg-[#BDA69F] text-[#3C2F2C] border-[#BDA69F]",
  "Visa": "bg-[#3C2F2C] text-white border-[#3C2F2C]",
  "Mastercard": "bg-[#536657] text-white border-[#536657]",
};

export function RecentOrdersTable() {
  const orders = getRecentOrders();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Recent Orders</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingBag className="h-4 w-4" />
            <span>{orders.length} orders</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-1/6">Order ID</TableHead>
                <TableHead className="w-1/6">Customer</TableHead>
                <TableHead className="w-1/6">Date & Time</TableHead>
                <TableHead className="w-1/6 text-center">Items</TableHead>
                <TableHead className="w-1/6">Payment</TableHead>
                <TableHead className="w-1/6 text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map(order => (
                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="w-1/6 font-mono text-sm font-semibold text-[#536657]">
                    #{order.id.toString().padStart(4, '0')}
                  </TableCell>
                  
                  <TableCell className="w-1/6">
                    <div className="font-medium text-foreground truncate">{order.customer_name}</div>
                  </TableCell>
                  
                  <TableCell className="w-1/6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {new Date(order.created_at).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString('pt-PT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="w-1/6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F0F4EF] text-[#263321] font-semibold text-sm">
                      {order.items_count}
                    </div>
                  </TableCell>
                  
                  <TableCell className="w-1/6">
                    <Badge 
                      variant="outline" 
                      className={`${paymentMethodColors[order.payment_method] || "bg-gray-100 text-gray-800"} font-medium`}
                    >
                      {order.payment_method}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="w-1/6 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="font-bold text-base text-[#2C3E2D]">
                        €{order.total.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        €{(order.total / order.items_count).toFixed(2)}/item
                      </span>
                    </div>
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
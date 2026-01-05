'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Euro, ShoppingCart, TrendingUp, CreditCard, Package, TrendingDown, Banknote } from "lucide-react";
import ordersData from "@/data/orders.json";

function calculateSalesMetrics() {
    const orders = ordersData.orders;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calcular métodos de pagamento únicos
    const paymentMethods = new Set(orders.map((order) => order.payment_method)).size;

    // Calcular total de itens vendidos
    const totalItems = ordersData.order_items.reduce((sum, item) => sum + item.quantity, 0);

    // Encontrar maior e menor pedido
    const highestOrder = Math.max(...orders.map((order) => order.total));
    const lowestOrder = Math.min(...orders.map((order) => order.total));

    // Calcular método de pagamento mais usado
    const paymentMethodCount = orders.reduce((acc, order) => {
        acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostUsedMethod = Object.entries(paymentMethodCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return {
        totalRevenue,
        totalOrders,
        averageTicket,
        paymentMethods,
        totalItems,
        highestOrder,
        lowestOrder,
        mostUsedMethod,
    };
}

export function SalesKpis() {
    const metrics = calculateSalesMetrics();

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardContent>
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col w-full">
                            <p className="font-medium text-gray-600 mb-4">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                €{metrics.totalRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <Package className="w-3 h-3" />
                                <span>{metrics.totalItems} items sold</span>
                            </div>
                            <div className="flex justify-between">
                              <div className="flex items-center gap-1 text-xs font-medium mt-1" style={{ color: '#2C3E2D' }}>
                                  <TrendingUp className="w-3 h-3" />
                                  <span>Peak: €{metrics.highestOrder.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-medium mt-1" style={{ color: '#607C5F' }}>
                                  <TrendingDown className="w-3 h-3" />
                                  <span>Min: €{metrics.lowestOrder.toFixed(2)}</span>
                              </div>
                            </div>
                        </div>
                        <div className="p-2 rounded-full bg-[#BDA69F]">
                            <Euro className="w-6 h-6 text-[#412A22]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col w-full">
                            <p className="font-medium text-gray-600 mb-4">Total Orders</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {metrics.totalOrders}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <ShoppingCart className="w-3 h-3" />
                                <span>Completed orders</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium mt-1" style={{ color: '#607C5F' }}>
                                <Package className="w-3 h-3" />
                                <span>{(metrics.totalItems / metrics.totalOrders).toFixed(1)} items/order</span>
                            </div>
                        </div>
                        <div className="p-2 rounded-full bg-[#BDA69F]">
                            <ShoppingCart className="w-6 h-6 text-[#412A22]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col w-full">
                            <p className="font-medium text-gray-600 mb-4">Average Ticket</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                €{metrics.averageTicket.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <ShoppingCart className="w-3 h-3" />
                                <span>Per order</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium mt-1" style={{ color: '#8B7A6B' }}>
                                <Package className="w-3 h-3" />
                                <span>€{(metrics.totalRevenue / metrics.totalItems).toFixed(2)}/item</span>
                            </div>
                        </div>
                        <div className="p-2 rounded-full bg-[#BDA69F]">
                            <TrendingUp className="w-6 h-6 text-[#412A22]" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col w-full">
                            <p className="font-medium text-gray-600 mb-4">Payment Methods</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {metrics.paymentMethods}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <CreditCard className="w-3 h-3" />
                                <span>Different methods</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium mt-1" style={{ color: '#412A22' }}>
                                <Banknote className="w-3 h-3" />
                                <span>Top: {metrics.mostUsedMethod}</span>
                            </div>
                        </div>
                        <div className="p-2 rounded-full bg-[#BDA69F]">
                            <CreditCard className="w-6 h-6 text-[#412A22]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
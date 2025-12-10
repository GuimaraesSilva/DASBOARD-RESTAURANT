// Importe os dados dos arquivos corretos na pasta data
import productsData from '@/data/products.json';
import ordersData from '@/data/orders.json';
import customersData from '@/data/customers.json';
import reservationsData from '@/data/reservations.json';
import reviewsData from '@/data/reviews.json';

// Crie o objeto data com todos os dados importados
const data = {
  products: productsData.products || [],
  orders: ordersData.orders || [],
  order_items: ordersData.order_items || [],
  customers: customersData.customers || [],
  reservations: reservationsData.reservations || [],
  reviews: reviewsData.reviews || []
};

// Função auxiliar para calcular percentagem de mudança
export const calculateChange = (current: number, previous: number): { change: string; type: 'positive' | 'negative' } => {
  if (previous === 0) return { change: '0%', type: 'positive' };
  const percentChange = ((current - previous) / previous) * 100;
  return {
    change: `${Math.abs(percentChange).toFixed(1)}%`,
    type: percentChange >= 0 ? 'positive' : 'negative'
  };
};

// Calcular vendas totais de um período
export const calculateTotalSales = (orders: any[]): number => {
  return orders.reduce((sum, order) => sum + order.total, 0);
};

// Calcular ticket médio
export const calculateAverageTicket = (orders: any[]): number => {
  if (orders.length === 0) return 0;
  return calculateTotalSales(orders) / orders.length;
};

// Calcular taxa de ocupação baseada em reservas
export const calculateOccupancyRate = (reservations: any[]): number => {
  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
  
  if (totalReservations === 0) return 0;
  return (confirmedReservations / totalReservations) * 100;
};

// Calcular avaliação média
export const calculateAverageRating = (reviews: any[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// Obter top produtos por vendas
export const getTopProductsByRevenue = (orderItems: any[], products: any[], limit: number = 3) => {
  const productSales = new Map();
  
  orderItems.forEach(item => {
    const product = products.find(p => p.id === item.product_id);
    if (product) {
      const existing = productSales.get(item.product_id) || { name: product.name, sales: 0, revenue: 0 };
      productSales.set(item.product_id, {
        name: product.name,
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + item.subtotal
      });
    }
  });
  
  return Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
    .map(p => ({
      name: p.name,
      sales: p.sales,
      revenue: `€${p.revenue.toFixed(2)}`
    }));
};

// Obter clientes VIP (mais visitas)
export const getTopCustomersByVisits = (customers: any[], limit: number = 3) => {
  return customers
    .sort((a, b) => b.visits - a.visits)
    .slice(0, limit)
    .map(c => ({
      name: c.name,
      visits: c.visits,
      email: c.email
    }));
};

type Period = "daily" | "weekly" | "monthly";

function getMultiplier(period: Period): number {
  return period === "monthly" ? 30 : period === "weekly" ? 7 : 1;
}

export function getDashboardMetrics(period: Period = "daily") {
  const multiplier = getMultiplier(period);
  
  const totalSales = data.orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrders = data.orders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  return {
    totalRevenue: totalSales * multiplier,
    totalOrders: totalOrders * multiplier,
    avgOrderValue: avgOrderValue,
    period: period,
  };
}

export function getTopProducts(period: Period = "daily", limit: number = 5) {
  const multiplier = getMultiplier(period);
  
  const productSales = data.order_items.reduce((acc, item) => {
    const product = data.products.find((p: any) => p.id === item.product_id);
    if (product) {
      acc[product.id] = (acc[product.id] || 0) + (item.quantity || 0);
    }
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(productSales)
    .map(([id, quantity]) => {
      const product = data.products.find((p: any) => p.id === Number(id));
      return product ? {
        ...product,
        quantity: quantity * multiplier
      } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export function getVIPCustomers(period: Period = "daily", limit: number = 5) {
  const multiplier = getMultiplier(period);
  
  const customerOrders = data.orders.reduce((acc, order) => {
    acc[order.customer_id] = (acc[order.customer_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(customerOrders)
    .map(([id, orders]) => {
      const customer = data.customers.find(c => c.id === Number(id));
      return customer ? {
        ...customer,
        totalOrders: orders * multiplier
      } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, limit);
}
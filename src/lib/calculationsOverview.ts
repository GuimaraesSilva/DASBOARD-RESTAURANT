import customersData from '@/data/customers.json';
import ordersData from '@/data/orders.json';
import reviewsData from '@/data/reviews.json';
import reservationsData from '@/data/reservations.json';
import productsData from '@/data/products.json';
import expensesData from '@/data/expenses.json';
import { DashboardData } from '@/types/overview';
import { PaymentMethod } from '@/types/payment';
import { Product } from '@/types/products';
import { MonthlyData } from '@/types/month';
import { Customer } from '@/types/metric';

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

type Period = "daily" | "weekly" | "monthly";

function getMultiplier(period: Period): number {
  return period === "monthly" ? 30 : period === "weekly" ? 7 : 1;
}

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

// ============================================
// FUNÇÕES DE TOP PRODUTOS E CLIENTES
// ============================================

// Obter top produtos por receita
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
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      visits: c.visits,
      last_visit_date: c.last_visit_date,
      reservations: c.reservations
    }));
};

// Obter top produtos com multiplicador de período
export function getTopProducts(period: Period = "daily", limit: number = 5) {
  const multiplier = getMultiplier(period);
  
  const productSales = ordersData.order_items.reduce((acc: any, item: any) => {
    const product = productsData.products.find((p: any) => p.id === item.product_id);
    if (product) {
      acc[product.id] = (acc[product.id] || 0) + (item.quantity || 0);
    }
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(productSales)
    .map(([id, quantity]) => {
      const product = productsData.products.find((p: any) => p.id === Number(id));
      return product ? {
        ...product,
        quantity: (quantity as number) * multiplier
      } : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

// Obter clientes VIP com multiplicador de período
export function getVIPCustomers(period: Period = "daily", limit: number = 5) {
  const multiplier = getMultiplier(period);
  
  const customerOrders = ordersData.orders.reduce((acc: any, order: any) => {
    acc[order.customer_id] = (acc[order.customer_id] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return Object.entries(customerOrders)
    .map(([id, orders]) => {
      const customer = customersData.customers.find(c => c.id === Number(id));
      return customer ? {
        ...customer,
        totalOrders: (orders as number) * multiplier
      } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, limit);
}

// ============================================
// MÉTRICAS DO DASHBOARD
// ============================================

export function getDashboardMetrics(period: Period = "daily") {
  const multiplier = getMultiplier(period);
  
  const totalSales = ordersData.orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const totalOrders = ordersData.orders.length;
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  
  return {
    totalRevenue: totalSales * multiplier,
    totalOrders: totalOrders * multiplier,
    avgOrderValue: avgOrderValue,
    period: period,
  };
}

// ============================================
// CÁLCULOS PARA OVERVIEW
// ============================================

export function calculateMonthlyTrends(): MonthlyData[] {
  // Agrupar pedidos por mês
  const monthlyOrders = new Map<string, { total: number; count: number }>();
  
  ordersData.orders.forEach(order => {
    const month = order.created_at.substring(0, 7); // "2025-02"
    const current = monthlyOrders.get(month) || { total: 0, count: 0 };
    monthlyOrders.set(month, {
      total: current.total + order.total,
      count: current.count + 1
    });
  });

  // Agrupar despesas por mês
  const monthlyExpenses = new Map<string, number>();
  expensesData.expenses.forEach(expense => {
    const month = expense.month;
    const current = monthlyExpenses.get(month) || 0;
    monthlyExpenses.set(month, current + expense.amount);
  });

  // Criar array de meses
  const months = Array.from(new Set([
    ...Array.from(monthlyOrders.keys()),
    ...Array.from(monthlyExpenses.keys())
  ])).sort();

  return months.map(month => {
    const orderData = monthlyOrders.get(month) || { total: 0, count: 0 };
    const expenses = monthlyExpenses.get(month) || 0;
    const revenue = orderData.total;
    const profit = revenue - expenses;
    const averageTicket = orderData.count > 0 ? revenue / orderData.count : 0;

    // Formatar mês para exibição (ex: "Jan 2025")
    const [year, monthNum] = month.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthName = monthNames[parseInt(monthNum) - 1];

    return {
      month: `${monthName} ${year}`,
      revenue,
      orders: orderData.count,
      expenses,
      profit,
      averageTicket
    };
  });
}

export function calculateOverview(): DashboardData {
  // Calcular receita total
  const totalRevenue = ordersData.orders.reduce((sum, order) => sum + order.total, 0);
  
  // Número de pedidos
  const orders = ordersData.orders.length;
  
  // Ticket médio
  const averageTicket = orders > 0 ? totalRevenue / orders : 0;
  
  // Taxa de ocupação (reservas confirmadas / total de reservas)
  const confirmedReservations = reservationsData.reservations.filter(
    r => r.status === 'confirmed'
  ).length;
  const totalReservations = reservationsData.reservations.filter(
    r => r.status
  ).length;
  const occupancyRate = totalReservations > 0 
    ? (confirmedReservations / totalReservations) * 100 
    : 0;
  
  // Avaliação média
  const totalRating = reviewsData.reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviewsData.reviews.length > 0 
    ? totalRating / reviewsData.reviews.length 
    : 0;

  // Top produtos (por quantidade de vendas)
  // Calcular receita proporcional baseada nos totais reais dos pedidos
  const productSales = new Map<number, { quantity: number; revenue: number }>();
  
  ordersData.orders.forEach(order => {
    const orderItems = ordersData.order_items.filter(item => item.order_id === order.id);
    const itemsSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    if (itemsSubtotal === 0) return;
    
    orderItems.forEach(item => {
      const current = productSales.get(item.product_id) || { quantity: 0, revenue: 0 };
      // Calcular receita proporcional ao total real do pedido
      const itemProportion = item.subtotal / itemsSubtotal;
      const itemRealRevenue = order.total * itemProportion;
      
      productSales.set(item.product_id, {
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + itemRealRevenue
      });
    });
  });

  const topProducts: Product[] = Array.from(productSales.entries())
    .map(([productId, sales]) => {
      const product = productsData.products.find(p => p.id === productId);
      if (!product) return null;
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        cost_price: product.cost,
        sales: sales.quantity,
        revenue: sales.revenue
      };
    })
    .filter((p): p is Product => p !== null)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  // Top Clients baseado em total de reservas feitas (made)
  const topClients: Customer [] = customersData.customers
    .filter(customer => customer.reservations.made > 0) // Filtrar clientes sem reservas
    .sort((a, b) => {
      // Ordenar primeiro por reservas feitas, depois por visitas
      const reservationDiff = b.reservations.made - a.reservations.made;
      if (reservationDiff !== 0) return reservationDiff;
      return b.visits - a.visits;
    })
    .slice(0, 3)
    .map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      visits: customer.visits,
      last_visit_date: customer.last_visit_date,
      reservations: customer.reservations
    }));

  // Métodos de pagamento (agregação por método)
  const paymentMethodsMap = new Map<string, { transactions: number; revenue: number }>();
  
  ordersData.orders.forEach(order => {
    const method = order.payment_method;
    const current = paymentMethodsMap.get(method) || { transactions: 0, revenue: 0 };
    paymentMethodsMap.set(method, {
      transactions: current.transactions + 1,
      revenue: current.revenue + order.total
    });
  });

  const colorMap: { [key: string]: string } = {
    'MBWay': '#1B2B1F',
    'Multibanco': '#C3CEC4',
    'Numérico': '#BDA69F',
    'Visa': '#3B2F2C',
    'Mastercard': '#536657',
  };

  const paymentMethods: PaymentMethod[] = Array.from(paymentMethodsMap.entries())
    .map(([method, data]) => ({
      method,
      transactions: data.transactions,
      revenue: data.revenue,
      fill: colorMap[method] || '#8884d8'
    }))
    .sort((a, b) => b.transactions - a.transactions);

  return {
    metrics: {
      totalRevenue,
      orders,
      averageTicket,
      occupancyRate,
      averageRating
    },
    changes: {
      totalRevenue: 12.5,
      orders: 8.2,
      averageTicket: -2.3,
      occupancyRate: 15.7,
      averageRating: 5.1
    },
    topProducts,
    topClients,
    paymentMethods
  };
}

// ============================================
// BUSINESS OVERVIEW
// ============================================

export interface BusinessOverviewData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export function calculateBusinessOverview(): BusinessOverviewData[] {
  const monthlyRevenue = new Map<string, number>();
  
  ordersData.orders.forEach(order => {
    const month = order.created_at.substring(0, 7);
    const current = monthlyRevenue.get(month) || 0;
    monthlyRevenue.set(month, current + order.total);
  });

  // Agrupar despesas por mês
  const monthlyExpenses = new Map<string, number>();
  expensesData.expenses.forEach(expense => {
    const current = monthlyExpenses.get(expense.month) || 0;
    monthlyExpenses.set(expense.month, current + expense.amount);
  });

  // Obter todos os meses únicos
  const allMonths = new Set([
    ...Array.from(monthlyRevenue.keys()),
    ...Array.from(monthlyExpenses.keys())
  ]);

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return Array.from(allMonths)
    .sort()
    .map(month => {
      const [year, monthNum] = month.split('-');
      const monthName = monthNames[parseInt(monthNum) - 1];
      
      const revenue = monthlyRevenue.get(month) || 0;
      const expenses = monthlyExpenses.get(month) || 0;
      const profit = revenue - expenses;

      return {
        month: `${monthName} ${year}`,
        revenue: Math.round(revenue * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
        profit: Math.round(profit * 100) / 100
      };
    });
}
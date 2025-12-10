import customersData from '@/data/customers.json';
import ordersData from '@/data/orders.json';
import reviewsData from '@/data/reviews.json';
import reservationsData from '@/data/reservations.json';
import productsData from '@/data/products.json';
import expensesData from '@/data/expenses.json';
import { DashboardData } from '@/types/overview';
import { PaymentMethod } from '@/types/payment';
import { Product } from '@/types/products';
import { Client } from '@/types/clients';
import { MonthlyData } from '@/types/month';

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
  const productSales = new Map<number, { quantity: number; revenue: number }>();
  
  ordersData.order_items.forEach(item => {
    const current = productSales.get(item.product_id) || { quantity: 0, revenue: 0 };
    productSales.set(item.product_id, {
      quantity: current.quantity + item.quantity,
      revenue: current.revenue + item.subtotal
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

  // Top clientes (por número de visitas)
  const topClients: Client[] = customersData.customers
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 3)
    .map(customer => {
      const nameParts = customer.name.split(' ');
      const initials = nameParts.length >= 2
        ? `${nameParts[0][0]}${nameParts[1][0]}`
        : nameParts[0][0];
      
      return {
        name: customer.name,
        email: customer.email,
        visits: customer.visits,
        initials: initials.toUpperCase()
      };
    });

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
    'Numerário': '#8F7F78',
    'Visa': '#3B2F2C',
    'Mastercard': '#536657',
  };

  const paymentMethods: PaymentMethod[] = Array.from(paymentMethodsMap.entries())
    .map(([method, data], index) => ({
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

export interface BusinessOverviewData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export function calculateBusinessOverview(): BusinessOverviewData[] {
  const monthlyRevenue = new Map<string, number>();
  
  // Agrupar receitas por mês
  ordersData.orders.forEach(order => {
    const month = order.created_at.substring(0, 7); // "2025-02"
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
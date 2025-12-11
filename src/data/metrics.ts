import ordersData from './orders.json';
import productsData from './products.json';
import customersData from './customers.json';
import reservationsData from './reservations.json';
import reviewsData from './reviews.json';
import { DashboardMetric, TopProduct, VIPCustomer } from '@/types/dashboard';

// Extrair arrays dos objetos wrapper
const ordersList = (ordersData as any).orders || [];
const orderItemsList = (ordersData as any).order_items || [];
const productsList = (productsData as any).products || [];
const customersList = (customersData as any).customers || [];
const reservationsList = (reservationsData as any).reservations || [];
const reviewsList = (reviewsData as any).reviews || [];

export function getDashboardMetrics(period: string = 'today'): DashboardMetric[] {
  // Encontrar a data mais recente nos dados
  const mostRecentDate = ordersList.reduce((latest: Date, order: any) => {
    const orderDate = new Date(order.created_at);
    return orderDate > latest ? orderDate : latest;
  }, new Date(0));
  
  // Usar a data mais recente como referência
  const now = mostRecentDate;
  
  const filterByPeriod = (date: string) => {
    const orderDate = new Date(date);
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch(period) {
      case 'today':
        return daysDiff <= 1;  // Incluir hoje e ontem
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      case 'year':
        return daysDiff <= 365;
      default:
        return true;
    }
  };

  // Filtrar pedidos pelo período
  const filteredOrders = ordersList.filter((order: any) => filterByPeriod(order.created_at));
  
  // Calcular total de vendas
  const totalSales = filteredOrders.reduce((sum: number, order: any) => sum + order.total, 0);
  
  // Calcular número de pedidos
  const numberOfOrders = filteredOrders.length;
  
  // Calcular ticket médio
  const averageTicket = numberOfOrders > 0 ? totalSales / numberOfOrders : 0;
  
  // Calcular período anterior para comparação
  const getPreviousPeriodOrders = () => {
    const periodDays: { [key: string]: number } = {
      'today': 1,
      'week': 7,
      'month': 30,
      'year': 365
    };

    const days = periodDays[period] || 1;

    return ordersList.filter((order: any) => {
      const orderDate = new Date(order.created_at);
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      // Período anterior: entre (days) e (days * 2)
      return daysDiff > days && daysDiff <= days * 2;
    });
  };

  const previousOrders = getPreviousPeriodOrders();
  const previousSales = previousOrders.reduce((sum: number, order: any) => sum + order.total, 0);
  const previousOrdersCount = previousOrders.length;
  const previousAvgTicket = previousOrdersCount > 0 ? previousSales / previousOrdersCount : 0;

  // Calcular mudanças percentuais
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { change: '0%', type: 'positive' as const };
    const percentChange = ((current - previous) / previous) * 100;
    return {
      change: `${Math.abs(percentChange).toFixed(1)}%`,
      type: (percentChange >= 0 ? 'positive' : 'negative') as 'positive' | 'negative'
    };
  };

  const salesChange = calculateChange(totalSales, previousSales);
  const ordersChange = calculateChange(numberOfOrders, previousOrdersCount);
  const ticketChange = calculateChange(averageTicket, previousAvgTicket);

  // Calcular Occupancy Rate (taxa de ocupação)
  const filteredReservations = reservationsList.filter((reservation: any) => {
    const reservationDate = new Date(reservation.date);
    const daysDiff = Math.floor((now.getTime() - reservationDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch(period) {
      case 'today':
        return daysDiff <= 1;
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      case 'year':
        return daysDiff <= 365;
      default:
        return true;
    }
  });

  const totalReservations = filteredReservations.length;
  const confirmedReservations = filteredReservations.filter((r: any) => r.status === 'confirmed').length;
  const occupancyRate = totalReservations > 0 ? (confirmedReservations / totalReservations) * 100 : 0;

  // Período anterior de reservas
  const previousReservations = reservationsList.filter((reservation: any) => {
    const reservationDate = new Date(reservation.date);
    const periodDays: { [key: string]: number } = { 'today': 1, 'week': 7, 'month': 30, 'year': 365 };
    const days = periodDays[period] || 1;
    const daysDiff = Math.floor((now.getTime() - reservationDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > days && daysDiff <= days * 2;
  });

  const prevTotalReservations = previousReservations.length;
  const prevConfirmedReservations = previousReservations.filter((r: any) => r.status === 'confirmed').length;
  const prevOccupancyRate = prevTotalReservations > 0 ? (prevConfirmedReservations / prevTotalReservations) * 100 : 0;
  const occupancyChange = calculateChange(occupancyRate, prevOccupancyRate);

  // Calcular Average Rating (avaliação média)
  const filteredReviews = reviewsList.filter((review: any) => {
    const reviewDate = new Date(review.created_at);
    const daysDiff = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch(period) {
      case 'today':
        return daysDiff <= 1;
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      case 'year':
        return daysDiff <= 365;
      default:
        return true;
    }
  });

  const avgRating = filteredReviews.length > 0 
    ? filteredReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / filteredReviews.length 
    : 0;

  // Período anterior de reviews
  const previousReviews = reviewsList.filter((review: any) => {
    const reviewDate = new Date(review.created_at);
    const periodDays: { [key: string]: number } = { 'today': 1, 'week': 7, 'month': 30, 'year': 365 };
    const days = periodDays[period] || 1;
    const daysDiff = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > days && daysDiff <= days * 2;
  });

  const prevAvgRating = previousReviews.length > 0
    ? previousReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / previousReviews.length
    : 0;
  const avgRatingChange = calculateChange(avgRating, prevAvgRating);

  return [
    {
      title: 'Total Revenue',
      value: `€${totalSales.toFixed(2)}`,
      change: salesChange.change,
      type: salesChange.type,
      icon: 'euro',
    },
    {
      title: 'Orders',
      value: numberOfOrders.toString(),
      change: ordersChange.change,
      type: ordersChange.type,
      icon: 'shopping-cart',
    },
    {
      title: 'Average Ticket',
      value: `€${averageTicket.toFixed(2)}`,
      change: ticketChange.change,
      type: ticketChange.type,
      icon: 'trending-up',
    },
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate.toFixed(0)}%`,
      change: occupancyChange.change,
      type: occupancyChange.type,
      icon: 'calendar',
    },
    {
      title: 'Average Rating',
      value: avgRating.toFixed(1),
      change: avgRatingChange.change,
      type: avgRatingChange.type,
      icon: 'star',
    },
  ];
}

export function getTopProducts(period: string = 'today'): TopProduct[] {
  // Encontrar a data mais recente
  const mostRecentDate = ordersList.reduce((latest: Date, order: any) => {
    const orderDate = new Date(order.created_at);
    return orderDate > latest ? orderDate : latest;
  }, new Date(0));
  
  const now = mostRecentDate;
  
  const filterByPeriod = (date: string) => {
    const orderDate = new Date(date);
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch(period) {
      case 'today':
        return daysDiff <= 1;
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      case 'year':
        return daysDiff <= 365;
      default:
        return true;
    }
  };

  const filteredOrders = ordersList.filter((order: any) => filterByPeriod(order.created_at));
  
  const filteredOrderIds = filteredOrders.map((order: any) => order.id);
  const filteredOrderItems = orderItemsList.filter((item: any) => 
    filteredOrderIds.includes(item.order_id)
  );
  
  // Calcular receita proporcional baseada nos totais reais dos pedidos
  const productData = new Map<number, { quantity: number; revenue: number }>();
  
  filteredOrders.forEach((order: any) => {
    const orderItems = orderItemsList.filter((item: any) => item.order_id === order.id);
    const itemsSubtotal = orderItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);
    
    if (itemsSubtotal === 0) return;
    
    orderItems.forEach((item: any) => {
      const current = productData.get(item.product_id) || { quantity: 0, revenue: 0 };
      const itemProportion = item.subtotal / itemsSubtotal;
      const itemRealRevenue = order.total * itemProportion;
      
      productData.set(item.product_id, {
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + itemRealRevenue
      });
    });
  });

  const topProductIds = Array.from(productData.entries())
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5)
    .map(([productId, data]) => ({
      productId,
      sales: data.quantity,
      revenue: data.revenue
    }));

  return topProductIds
    .map(({ productId, sales, revenue }) => {
      const product = productsList.find((p: any) => p.id === productId);
      if (!product) return null;
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        sales: sales,
        revenue: revenue,
      };
    })
    .filter((item): item is TopProduct => item !== null);
}

export function getVIPCustomers(period: string = 'today'): VIPCustomer[] {
  // Encontrar a data mais recente
  const mostRecentDate = ordersList.reduce((latest: Date, order: any) => {
    const orderDate = new Date(order.created_at);
    return orderDate > latest ? orderDate : latest;
  }, new Date(0));
  
  const now = mostRecentDate;
  
  const filterByPeriod = (date: string) => {
    const orderDate = new Date(date);
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch(period) {
      case 'today':
        return daysDiff <= 1;
      case 'week':
        return daysDiff <= 7;
      case 'month':
        return daysDiff <= 30;
      case 'year':
        return daysDiff <= 365;
      default:
        return true;
    }
  };

  const filteredOrders = ordersList.filter((order: any) => filterByPeriod(order.created_at));
  
  const customerStats = new Map<number, { totalSpent: number; orderCount: number }>();
  
  filteredOrders.forEach((order: any) => {
    const current = customerStats.get(order.customer_id) || { totalSpent: 0, orderCount: 0 };
    customerStats.set(order.customer_id, {
      totalSpent: current.totalSpent + order.total,
      orderCount: current.orderCount + 1
    });
  });

  const topCustomerIds = Array.from(customerStats.entries())
    .sort((a, b) => b[1].totalSpent - a[1].totalSpent)
    .slice(0, 5);

  return topCustomerIds
    .map(([customerId, stats]) => {
      const customer = customersList.find((c: any) => c.id === customerId);
      if (!customer) return null;
      
      return {
        id: customer.id,
        name: customer.name,
        totalSpent: stats.totalSpent,
        visits: stats.orderCount,
      };
    })
    .filter((item): item is VIPCustomer => item !== null);
}
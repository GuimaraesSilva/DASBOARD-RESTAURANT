import { Product } from './products';
import { PaymentMethod } from './payment';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  visits: number;
  last_visit_date: string;
  reservations: {
    made: number;
    cancelled: number;
    no_shows: number;
  };
}

export interface DashboardData {
  metrics: {
    totalRevenue: number;
    orders: number;
    averageTicket: number;
    occupancyRate: number;
    averageRating: number;
  };
  changes: {
    totalRevenue: number;
    orders: number;
    averageTicket: number;
    occupancyRate: number;
    averageRating: number;
  };
  topProducts: Product[];
  topClients: Customer[];
  paymentMethods: PaymentMethod[];
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  orders: number;
  expenses: number;
  profit: number;
  averageTicket: number;
}
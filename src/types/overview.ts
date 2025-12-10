import { Product } from './products';
import { Client } from './clients';
import { PaymentMethod } from './payment';

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
  topClients: Client[];
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
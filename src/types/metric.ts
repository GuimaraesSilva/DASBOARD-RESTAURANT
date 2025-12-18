import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: LucideIcon;
}

export interface Product {
  name: string;
  sales: number;
  revenue: string | number;
  price?: number;
}

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
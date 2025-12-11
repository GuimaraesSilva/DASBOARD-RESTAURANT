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
  name: string;
  visits: number;
  email?: string;
}
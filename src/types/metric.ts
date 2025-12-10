export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: any;
}

export interface Product {
  name: string;
  sales: number;
  revenue: string | number;
}

export interface Customer {
  name: string;
  visits: number;
  email?: string;
}
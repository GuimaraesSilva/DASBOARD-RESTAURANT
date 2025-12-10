export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  type: 'positive' | 'negative';
  icon: string;
}

export interface TopProduct {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
}

export interface VIPCustomer {
  id: number;
  name: string;
  totalSpent: number;
  visits: number;
}

import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/overview";
import { 
  Euro,
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Star 
} from "lucide-react";

interface MetricsGridProps {
  dashboardData: DashboardData;
}

export function MetricsGrid({ dashboardData }: MetricsGridProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatChange = (change: number): string => {
    if (!isFinite(change)) return '0%';
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getChangeType = (change: number): 'positive' | 'negative' => {
    return change >= 0 ? 'positive' : 'negative';
  };

  const formatPercentage = (value: number): string => {
    if (!isFinite(value)) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const formatRating = (value: number): string => {
    if (!isFinite(value) || value < 0 || value > 5) return '0.0';
    return value.toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Receita Total"
        value={formatCurrency(dashboardData.metrics.totalRevenue)}
        change={formatChange(dashboardData.changes.totalRevenue)}
        changeType={getChangeType(dashboardData.changes.totalRevenue)}
        icon={Euro}
      />
      <MetricCard
        title="Pedidos"
        value={dashboardData.metrics.orders.toString()}
        change={formatChange(dashboardData.changes.orders)}
        changeType={getChangeType(dashboardData.changes.orders)}
        icon={ShoppingCart}
      />
      <MetricCard
        title="Ticket Médio"
        value={formatCurrency(dashboardData.metrics.averageTicket)}
        change={formatChange(dashboardData.changes.averageTicket)}
        changeType={getChangeType(dashboardData.changes.averageTicket)}
        icon={TrendingUp}
      />
      <MetricCard
        title="Taxa de Ocupação"
        value={formatPercentage(dashboardData.metrics.occupancyRate)}
        change={formatChange(dashboardData.changes.occupancyRate)}
        changeType={getChangeType(dashboardData.changes.occupancyRate)}
        icon={Users}
      />
      <MetricCard
        title="Avaliação Média"
        value={formatRating(dashboardData.metrics.averageRating)}
        change={formatChange(dashboardData.changes.averageRating)}
        changeType={getChangeType(dashboardData.changes.averageRating)}
        icon={Star}
      />
    </div>
  );
}

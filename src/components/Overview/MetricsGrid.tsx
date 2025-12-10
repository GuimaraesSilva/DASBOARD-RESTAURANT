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
  const formatChange = (change: number): string => {
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getChangeType = (change: number): 'positive' | 'negative' => {
    return change >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Receita Total"
        value={`€${dashboardData.metrics.totalRevenue.toFixed(2)}`}
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
        value={`€${dashboardData.metrics.averageTicket.toFixed(2)}`}
        change={formatChange(dashboardData.changes.averageTicket)}
        changeType={getChangeType(dashboardData.changes.averageTicket)}
        icon={TrendingUp}
      />
      <MetricCard
        title="Taxa de Ocupação"
        value={`${dashboardData.metrics.occupancyRate.toFixed(1)}%`}
        change={formatChange(dashboardData.changes.occupancyRate)}
        changeType={getChangeType(dashboardData.changes.occupancyRate)}
        icon={Users}
      />
      <MetricCard
        title="Avaliação Média"
        value={dashboardData.metrics.averageRating.toFixed(1)}
        change={formatChange(dashboardData.changes.averageRating)}
        changeType={getChangeType(dashboardData.changes.averageRating)}
        icon={Star}
      />
    </div>
  );
}

import { MetricCard } from "./MetricCard";
import { DashboardData } from "@/types/overview";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Star 
} from "lucide-react";

interface MetricsGridProps {
  dashboardData: DashboardData;
}

export function MetricsGrid({ dashboardData }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        title="Receita Total"
        value={`€${dashboardData.metrics.totalRevenue.toFixed(2)}`}
        change={dashboardData.changes.totalRevenue}
        icon={DollarSign}
      />
      <MetricCard
        title="Pedidos"
        value={dashboardData.metrics.orders.toString()}
        change={dashboardData.changes.orders}
        icon={ShoppingCart}
      />
      <MetricCard
        title="Ticket Médio"
        value={`€${dashboardData.metrics.averageTicket.toFixed(2)}`}
        change={dashboardData.changes.averageTicket}
        icon={TrendingUp}
      />
      <MetricCard
        title="Taxa de Ocupação"
        value={`${dashboardData.metrics.occupancyRate.toFixed(1)}%`}
        change={dashboardData.changes.occupancyRate}
        icon={Users}
      />
      <MetricCard
        title="Avaliação Média"
        value={dashboardData.metrics.averageRating.toFixed(1)}
        change={dashboardData.changes.averageRating}
        icon={Star}
      />
    </div>
  );
}

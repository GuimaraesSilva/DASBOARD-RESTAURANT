<<<<<<< HEAD
import React from 'react';
import { MetricCard } from './MetricCard';
import type { MetricCardProps } from '@/types/metric';

interface MetricsGridProps {
  metrics: MetricCardProps[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};
=======
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
        changeLabel="vs mês anterior"
        icon={<DollarSign className="w-6 h-6 text-[#3C3838]" />}
      />
      <MetricCard
        title="Pedidos"
        value={dashboardData.metrics.orders.toString()}
        change={dashboardData.changes.orders}
        changeLabel="vs mês anterior"
        icon={<ShoppingCart className="w-6 h-6 text-[#3C3838]" />}
      />
      <MetricCard
        title="Ticket Médio"
        value={`€${dashboardData.metrics.averageTicket.toFixed(2)}`}
        change={dashboardData.changes.averageTicket}
        changeLabel="vs mês anterior"
        icon={<TrendingUp className="w-6 h-6 text-[#3C3838]" />}
      />
      <MetricCard
        title="Taxa de Ocupação"
        value={`${dashboardData.metrics.occupancyRate.toFixed(1)}%`}
        change={dashboardData.changes.occupancyRate}
        changeLabel="vs mês anterior"
        icon={<Users className="w-6 h-6 text-[#3C3838]" />}
      />
      <MetricCard
        title="Avaliação Média"
        value={dashboardData.metrics.averageRating.toFixed(1)}
        change={dashboardData.changes.averageRating}
        changeLabel="vs mês anterior"
        icon={<Star className="w-6 h-6 text-[#3C3838]" />}
      />
    </div>
  );
}
>>>>>>> 10fec4c (feat: add overview charts and metrics components)

'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { MetricsGrid } from '@/components/Overview/MetricsGrid';
import { ProductsCard } from '@/components/Overview/ProductsCard';
import { CustomersCard } from '@/components/Overview/CustomerCard';  
import { getDashboardMetrics, getTopProducts, getVIPCustomers } from '@/data/metrics';
import { useState } from "react";
import { PeriodProvider, usePeriod } from "@/components/PeriodTab/PeriodProvider";
import { Euro, ShoppingCart, TrendingUp, Calendar, Star } from 'lucide-react';

function OverviewContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { period } = usePeriod();
  
  const metricsData = getDashboardMetrics(period);
  const topProducts = getTopProducts(period);
  const vipCustomers = getVIPCustomers(period);
  
  // Mapeamento de strings de ícones para componentes
  const iconMap: { [key: string]: any } = {
    'euro': Euro,
    'shopping-cart': ShoppingCart,
    'trending-up': TrendingUp,
    'calendar': Calendar,
    'star': Star,
  };
  
  // Converter strings de ícones em componentes React
  const metrics = metricsData.map((metric: any) => ({
    ...metric,
    icon: iconMap[metric.icon] || Euro,
    changeType: metric.type,
  }));

  return (
    <div className="w-full h-screen bg-[#CDDBC8] p-3 md:p-6">
      <div className="flex flex-col md:grid md:grid-cols-6 md:grid-rows-[auto_1fr] gap-4 h-full">
        <div className="md:row-span-2">
          <Navbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div className="md:col-span-5">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>
        <div className="flex-1 md:col-span-5 rounded-md">
          <MetricsGrid metrics={metrics} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ProductsCard products={topProducts} />
            <CustomersCard customers={vipCustomers} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  return (
    <PeriodProvider>
      <OverviewContent />
    </PeriodProvider>
  );
}

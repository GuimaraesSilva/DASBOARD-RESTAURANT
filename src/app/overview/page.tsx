'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { MetricsGrid } from "@/components/Overview/MetricsGrid";
import { TopProducts } from "@/components/Overview/Top/TopProducts";
import { TopClients } from "@/components/Overview/Top/TopClients";
import { useState, useEffect } from "react";
import { DashboardData } from "@/types/overview";
import { calculateOverview } from "@/lib/calculationsOverview";
import { PaymentMethodsChart } from "@/components/Overview/Charts/PaymentMethodsChart";
import { SalesByCategoryChart } from "@/components/Overview/Charts/SalesByCategoryChart";
import { ReviewsRatingChart } from "@/components/Overview/Charts/ReviewsRatingChart";
import { ReservationsStatusChart } from "@/components/Overview/Charts/ReservationsStatusChart";
import { BusinessOverviewChart } from "@/components/Overview/Charts/BusinessOverviewChart";

export default function Overview() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const data = calculateOverview();
    setDashboardData(data);
  }, []);

  if (!dashboardData) {
    return (
      <div className="w-full h-screen bg-[#CDDBC8] flex items-center justify-center">
        <p>A carregar dados...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#CDDBC8] p-4">
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
        <div className="flex-1 md:col-span-5 bg-[#F5F5F5] rounded-md overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-4">
            {/* Métricas principais */}
            <MetricsGrid dashboardData={dashboardData} />
            
            {/* Top produtos e clientes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TopProducts products={dashboardData.topProducts} />
              <PaymentMethodsChart data={dashboardData.paymentMethods} />
              <TopClients clients={dashboardData.topClients} />
            </div>

            
            <BusinessOverviewChart />

            {/* Gráficos de análise */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <ReviewsRatingChart />
              <div className="md:col-span-2">
                <ReservationsStatusChart />
              </div>
              <div className="md:col-span-2">
                <SalesByCategoryChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface MetricsGridProps {
  dashboardData: DashboardData;
}

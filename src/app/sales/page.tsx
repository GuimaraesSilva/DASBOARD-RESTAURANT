'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { SalesKpis } from "@/components/Sales/SalesKpis";
import { SalesTrendChart } from "@/components/Sales/SalesTrendChart";
import { TopProductsTable } from "@/components/Sales/TopProductsTable";
import { SalesByCategoryChart } from "@/components/Overview/Charts/SalesByCategoryChart";
import { PaymentMethodsChart } from "@/components/Overview/Charts/PaymentMethodsChart";
import { SalesByTimeChart } from "@/components/Sales/SalesByTimeChart";
import { RecentOrdersTable } from "@/components/Sales/RecentOrdersTable";
import { SalesHeatmapChart } from "@/components/Sales/SalesHeatmapChart";
import { useState, useEffect } from "react";
import { DashboardData } from "@/types/overview";
import { calculateOverview } from "@/lib/calculationsOverview";

export interface MetricsGridProps {
  dashboardData: DashboardData;
}

export default function Sales() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const data = calculateOverview();
    setDashboardData(data);
  }, []);

  if (!dashboardData) {
    return null; // O LoadingProvider vai mostrar o loading
  }

  return (
    <div className="w-full h-screen bg-[#CDDBC8] p-2 md:p-4">
      <div className="flex flex-col md:grid md:grid-cols-6 md:grid-rows-[auto_1fr] gap-2 md:gap-4 h-full">
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
          <div className="p-4 flex flex-col gap-2 md:gap-4">
            <SalesKpis />
            <SalesTrendChart />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
              <SalesByCategoryChart />
              <PaymentMethodsChart data={dashboardData.paymentMethods} />
              <SalesHeatmapChart />
            </div>
            <SalesByTimeChart />
            <TopProductsTable />
            <RecentOrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
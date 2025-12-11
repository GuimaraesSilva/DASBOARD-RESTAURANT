"use client";

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { MetricsGrid } from "@/components/Overview/MetricsGrid";
import { CustomersCard } from "@/components/Overview/Top/CustomerCard";
import { useState, useEffect } from "react";
import { DashboardData } from "@/types/overview";
import { calculateOverview } from "@/lib/calculationsOverview";
import { PaymentMethodsChart } from "@/components/Overview/Charts/PaymentMethodsChart";
import { SalesByCategoryChart } from "@/components/Overview/Charts/SalesByCategoryChart";
import { ReviewsRatingChart } from "@/components/Overview/Charts/ReviewsRatingChart";
import { ReservationsStatusChart } from "@/components/Overview/Charts/ReservationsStatusChart";
import { BusinessOverviewChart } from "@/components/Overview/Charts/BusinessOverviewChart";
import { ProductsCard } from "@/components/Overview/Top/ProductsCard";

export interface MetricsGridProps {
  dashboardData: DashboardData;
}

export default function Overview() {
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
            <MetricsGrid dashboardData={dashboardData} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProductsCard products={dashboardData.topProducts} />
              <PaymentMethodsChart data={dashboardData.paymentMethods} />
              <CustomersCard customers={dashboardData.topClients} />
            </div>

            <BusinessOverviewChart />

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


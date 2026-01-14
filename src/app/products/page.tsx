'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { ProductsKpis } from "@/components/Products/ProductsKpis";
import { ProductsTable } from "@/components/Products/ProductsTable";
import { ProductsByCategoryChart } from "@/components/Products/ProductsByCategoryChart";
import { ProfitMarginChart } from "@/components/Products/ProfitMarginChart";
import { StockAlertsCard } from "@/components/Products/StockAlertsCard";
import { TopSellingProducts } from "@/components/Products/TopSellingProducts";
import { ProductsGallery } from "@/components/Products/ProductsGallery";
import { useState } from "react";

export default function Products() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <ProductsKpis />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* <div className="md:col-span-1">
                <StockAlertsCard />
              </div>
              <div className="md:col-span-2">
                <TopSellingProducts />
              </div> */}

              <StockAlertsCard />
              <TopSellingProducts />
              <ProductsGallery />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProductsByCategoryChart />
              <ProfitMarginChart />
            </div>
            <ProductsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
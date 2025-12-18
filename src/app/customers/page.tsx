'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { CustomersKpis } from "@/components/Customers/CustomersKpis";
import { VisitsChart } from "@/components/Customers/VisitsChart";
import { CustomersBySegmentChart } from "@/components/Customers/CustomersBySegmentChart";
import { CustomersTable } from "@/components/Customers/CustomersTable";
import customersData from "@/data/customers.json";
import { useState } from "react";

export default function Customers() {
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
            <CustomersKpis customers={customersData.customers} />
            <div className="grid gap-4 md:grid-cols-2">
              <VisitsChart customers={customersData.customers} />
              <CustomersBySegmentChart customers={customersData.customers} />
            </div>
            <CustomersTable customers={customersData.customers} />
          </div>
        </div>
      </div>
    </div>
  );
}
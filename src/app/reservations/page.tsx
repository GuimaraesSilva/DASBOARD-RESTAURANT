'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { ReservationsKpis } from "@/components/Reservations/ReservationsKpis";
import { ReservationsTable } from "@/components/Reservations/ReservationsTable";
import { ReservationsByTimeChart } from "@/components/Reservations/ReservationsByTimeChart";
import { ReservationsByDayChart } from "@/components/Reservations/ReservationsByDayChart";
import { UpcomingReservations } from "@/components/Reservations/UpcomingReservations";
import { ReservationsCancellationAnalysis } from "@/components/Reservations/ReservationsCancellationAnalysis";
import { useState } from "react";

export default function Reservations() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <ReservationsKpis />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4">
              <div className="lg:col-span-2 space-y-4">
                <ReservationsByTimeChart />
              </div>
              <UpcomingReservations />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
              <ReservationsCancellationAnalysis />
              <ReservationsByDayChart />
            </div>
            <ReservationsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
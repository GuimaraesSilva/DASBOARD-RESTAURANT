'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { useState } from "react";

export default function Overview() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen bg-[#CDDBC8] p-3 md:p-6">
      {/* Mobile: flex-col | Desktop (md+): grid */}
      <div className="flex flex-col md:grid md:grid-cols-6 md:grid-rows-[auto_1fr] gap-4 h-full">
        <div className="md:row-span-2">
          <Navbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        <div className="md:col-span-5">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>
        <div className="flex-1 md:col-span-5 bg-white rounded-md">Overview content</div>
      </div>
    </div>
  );
}

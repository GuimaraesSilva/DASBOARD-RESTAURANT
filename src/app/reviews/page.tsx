'use client';

import { Header } from "@/components/Header/Header";
import { Navbar } from "@/components/Navbar/Navbar";
import { ReviewsKpis } from "@/components/Reviews/ReviewsKpis";
import { ReviewsTable } from "@/components/Reviews/ReviewsTable";
import { ReviewsRatingChart } from "@/components/Overview/Charts/ReviewsRatingChart";
import { ReviewsRatingDistribution } from "@/components/Reviews/ReviewsRatingDistribution";
import { ReviewsTrendChart } from "@/components/Reviews/ReviewsTrendChart";
import { TopReviewedCustomers } from "@/components/Reviews/TopReviewedCustomers";
import { RecentReviews } from "@/components/Reviews/RecentReviews";
import { useState } from "react";

export default function Reviews() {
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
            <ReviewsKpis />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4">
              <ReviewsRatingDistribution />
              <TopReviewedCustomers />
              <ReviewsRatingChart />
            </div>
            <ReviewsTrendChart />
            <RecentReviews />
            <ReviewsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
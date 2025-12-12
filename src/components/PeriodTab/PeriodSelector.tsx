"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePeriod } from "./PeriodProvider";

export function PeriodSelector() {
  const { period, setPeriod } = usePeriod();

  return (
    <Tabs 
      value={period} 
      onValueChange={(value) => setPeriod(value as "today" | "week" | "month" | "year")}
      className="w-fit"
    >
      <TabsList className="bg-[#FFFCF8]/10 backdrop-blur-sm border border-[#CDDBC8]/50 p-1 gap-1.5">
        <TabsTrigger 
          value="today"
          className="data-[state=active]:bg-[#CDDBC8] data-[state=active]:text-[#263321] data-[state=active]:shadow-md text-[#263321] bg-[#FFFCF8]/50 hover:bg-[#FFFCF8]/70 transition-all font-semibold px-5 py-2.5 rounded-lg"
        >
          Today
        </TabsTrigger>
        <TabsTrigger 
          value="week"
          className="data-[state=active]:bg-[#CDDBC8] data-[state=active]:text-[#263321] data-[state=active]:shadow-md text-[#263321] bg-[#FFFCF8]/50 hover:bg-[#FFFCF8]/70 transition-all font-semibold px-5 py-2.5 rounded-lg"
        >
          Week
        </TabsTrigger>
        <TabsTrigger 
          value="month"
          className="data-[state=active]:bg-[#CDDBC8] data-[state=active]:text-[#263321] data-[state=active]:shadow-md text-[#263321] bg-[#FFFCF8]/50 hover:bg-[#FFFCF8]/70 transition-all font-semibold px-5 py-2.5 rounded-lg"
        >
          Month
        </TabsTrigger>
        <TabsTrigger 
          value="year"
          className="data-[state=active]:bg-[#CDDBC8] data-[state=active]:text-[#263321] data-[state=active]:shadow-md text-[#263321] bg-[#FFFCF8]/50 hover:bg-[#FFFCF8]/70 transition-all font-semibold px-5 py-2.5 rounded-lg"
        >
          Year
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

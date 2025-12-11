"use client";

import { useState } from "react";

type Tab = "Today" | "Week" | "Month" | "Year";

interface TabsSelectorProps {
  defaultTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

export default function TabsSelector({
  defaultTab = "Year",
  onTabChange,
}: TabsSelectorProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const tabs: Tab[] = ["Today", "Week", "Month", "Year"];

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="inline-flex rounded-lg bg-[#c9baaa]/50 p-1 gap-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`
            px-3 py-1.5 md:px-6 md:py-2 rounded-md font-medium text-xs md:text-sm transition-all whitespace-nowrap
            ${
              activeTab === tab
                ? "bg-[#2c3c2c] text-[#f5ebe0] shadow-sm"
                : "text-[#3a312a] hover:bg-[#d4c3b5] hover:text-[#2c3c2c]"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
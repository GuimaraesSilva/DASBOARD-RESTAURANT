"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { menuItems } from "@/components/Navbar/Navbar";
<<<<<<< HEAD
import Link from "next/link";
import { PeriodSelector } from "@/components/PeriodTab/PeriodSelector";
=======
import TabsSelector from "../Tabs/TabsSelector";
import Link from "next/link";
>>>>>>> 10fec4c (feat: add overview charts and metrics components)

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // Encontra o item ativo baseado na rota atual
  const activeItem = menuItems.find(item => item.href === pathname);
  const pageTitle = activeItem?.label || "Dashboard";

  return (
<<<<<<< HEAD
    <div className="w-full h-full bg-[#FFFCF8] rounded-md p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">  
=======
    <div className="w-full h-full bg-white rounded-md p-3 md:p-4 flex items-center justify-between gap-2 md:gap-4">
      <div className="md:hidden flex items-center gap-2">
>>>>>>> 10fec4c (feat: add overview charts and metrics components)
        <Button
          onClick={onMenuClick}
          className="bg-transparent p-0 "
        >
<<<<<<< HEAD
          <Menu className="w-5 h-5" />
=======
          <Menu className="text-red-500" size={28} />
>>>>>>> 10fec4c (feat: add overview charts and metrics components)
        </Button>
      </div>
<<<<<<< HEAD
      <div className="flex items-center gap-6">
        <PeriodSelector />
        <Link href="/">
          <LogOut className="w-5 h-5" />
=======
      <h1 className="text-base md:text-2xl font-semibold truncate ">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        <TabsSelector
          defaultTab="Today"
          onTabChange={(tab) => console.log(`Selected: ${tab}`)}
        />
        <Link href="/" className="">
            <LogOut className="text-gray-600 hover:text-blue-600" size={20} />
>>>>>>> 10fec4c (feat: add overview charts and metrics components)
        </Link>
      </div>
    </div>
  );
}
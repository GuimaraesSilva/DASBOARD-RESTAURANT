"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { menuItems } from "@/components/Navbar/Navbar";
import Link from "next/link";
import { PeriodSelector } from "@/components/PeriodTab/PeriodSelector";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  
  // Encontra o item ativo baseado na rota atual
  const activeItem = menuItems.find(item => item.href === pathname);
  const pageTitle = activeItem?.label || "Dashboard";

  return (
    <div className="w-full h-full bg-[#FFFCF8] rounded-md p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">  
        <Button
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-6">
        <PeriodSelector />
        <Link href="/">
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
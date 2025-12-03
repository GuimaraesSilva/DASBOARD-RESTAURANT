"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { menuItems } from "@/components/Navbar/Navbar";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  
  // Encontra o item ativo baseado na rota atual
  const activeItem = menuItems.find(item => item.href === pathname);
  const pageTitle = activeItem?.label || "Dashboard";

  return (
      <div className="w-full h-full bg-white rounded-md p-4 flex items-center justify-between">
        <Button
          onClick={onMenuClick}
          className="md:hidden"
        >
          {/* Icon for mobile menu */}
        </Button>
        <h1 className="text-xl md:text-2xl font-semibold">{pageTitle}</h1>
      </div>

  );
}
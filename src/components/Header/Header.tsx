"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { menuItems } from "@/components/Navbar/Navbar";
import TabsSelector from "../Tabs/TabsSelector";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // Encontra o item ativo baseado na rota atual
  const activeItem = menuItems.find(item => item.href === pathname);
  const pageTitle = activeItem?.label || "Dashboard";

  return (
    <div className="w-full h-full bg-[#F5F5F5] rounded-md p-3 md:p-4 flex items-center justify-between gap-2 md:gap-4">
      <div className="md:hidden flex items-center gap-2">
        <Button
          onClick={onMenuClick}
          className="bg-transparent p-0 "
        >
          <Menu className="text-red-500" size={28} />
        </Button>
      </div>
      <h1 className="text-base md:text-3xl font-semibold truncate pl-2">{pageTitle}</h1>
      <div className="flex items-center gap-4">
        <TabsSelector
          defaultTab="Today"
          onTabChange={(tab) => console.log(`Selected: ${tab}`)}
        />
        <Link href="/" className="">
            <LogOut className="text-gray-600 hover:text-blue-600" size={20} />
        </Link>
      </div>
    </div>
  );
}

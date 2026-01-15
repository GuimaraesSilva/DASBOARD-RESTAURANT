"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Image from "next/image";
import { menuItems } from "./Navbar";

interface NavbarMobileProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function NavbarMobile({ sidebarOpen, setSidebarOpen }: NavbarMobileProps) {
  const pathname = usePathname();

  return (
    <div className="block lg:hidden rounded-l-md">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[250px] border-none rounded-r-lg">
          <div className="w-full h-full bg-[#263321] text-white rounded-r-lg">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={200}
                className="object-contain pt-8 md:pt-20"
                priority
              />
            </div>

            <nav className="mt-6 px-4">
              <ul className="flex flex-col gap-8">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-6 rounded-md p-2 font-medium transition-colors ${isActive
                          ? "bg-[#CDDBC8] text-black"
                          : "text-white hover:bg-[#CDDBC8] hover:text-black"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

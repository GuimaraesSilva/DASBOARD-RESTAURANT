"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { menuItems } from "./Navbar";

export function NavbarDesktop() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block bg-[#263321] rounded-lg p-6 h-full">
      <div className="mb-flex flex-col gap-12">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
        <nav className="w-full">
          <ul className="flex flex-col gap-4">
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
    </div>
  );
}

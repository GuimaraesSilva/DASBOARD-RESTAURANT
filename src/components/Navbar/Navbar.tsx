import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { LayoutDashboard, Euro, Utensils, Users, Calendar, Star } from "lucide-react";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const menuItems = [
  { href: "/overview", icon: LayoutDashboard, label: "Overview" },
  { href: "/sales", icon: Euro, label: "Sales" },
  { href: "/products", icon: Utensils, label: "Products" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/reservations", icon: Calendar, label: "Reservations" },
  { href: "/reviews", icon: Star, label: "Reviews" },
];

export function Navbar({ sidebarOpen, setSidebarOpen }: NavbarProps) {
  return (
    <>
      <NavbarDesktop />
      <NavbarMobile
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </>
  );
}

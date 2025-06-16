// constants/navigationItems.js
import { Home, Users, CreditCard, HelpCircle, Printer } from "lucide-react";

export const navigationItems = [
  { 
    id: "dashboard",
    name: "Dashboard", 
    label: "Dashboard",
    icon: Home, 
    href: "/dashboard",
    path: "/app/dashboard"
  },
  { 
    id: "students",
    name: "Student List", 
    label: "Student List",
    icon: Users, 
    href: "/students",
    path: "/app/students"
  },
  { 
    id: "print",
    name: "Print ID", 
    label: "Print ID",
    icon: CreditCard, // Desktop के लिए CreditCard
    mobileIcon: Printer, // Mobile के लिए Printer
    href: "/print",
    path: "/app/print"
  },
  { 
    id: "help",
    name: "Help Center", 
    label: "Help Center",
    icon: HelpCircle, 
    href: "/help",
    path: "/app/help",
    showInMobile: false // Mobile में नहीं दिखाना
  },
];

// Mobile के लिए filtered items
export const getMobileNavigationItems = () => {
  return navigationItems
    .filter(item => item.showInMobile !== false)
    .map(item => ({
      id: item.id,
      label: item.label,
      icon: item.mobileIcon || item.icon,
      path: item.path
    }));
};

// Desktop/Sidebar के लिए items
export const getSidebarNavigationItems = () => {
  return navigationItems.map(item => ({
    name: item.name,
    icon: item.icon,
    href: item.href
  }));
};
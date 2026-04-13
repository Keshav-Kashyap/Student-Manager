// constants/navigationItems.js
import { Home, Users, CreditCard, Printer, MessageCircle } from "lucide-react";

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
    icon: CreditCard, // 
    mobileIcon: Printer, // 
    href: "/print",
    path: "/app/print"
  },
  {
    id: "chat",
    name: "Chat",
    label: "Chat",
    icon: MessageCircle,
    href: "/chat",
    path: "/app/chat"
  },
  {
    id: "team",
    name: "Team",
    label: "Team",
    icon: Users,
    href: "/team",
    path: "/app/team"
  },
];

// 
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
    href: item.href,
    path: item.path
  }));
};
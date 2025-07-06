import {
  Users,
  Clock,
  CheckCircle,
  Zap,
  Printer
} from 'lucide-react';

export const getCardConfigs = (analytics, totalStudents) => [
  {
    title: "Total Users",
    value: analytics?.totalUsers?.toLocaleString?.() || "0",
    icon: Users,
    trend: analytics?.monthlyGrowth,
    color: "blue",
    subtitle: "Active registered users"
  },
  {
    title: "Total Students",
    value: totalStudents || "0",
    icon: Clock,
     trend: analytics?.monthlyGrowth,
    color: "yellow",
    subtitle: "Pending processing"
  },
  {
    title: "Total Sent for Printing",
    value: analytics?.studentsCompleted || "0",
    icon: Printer,
     trend: analytics?.monthlyGrowth,
    color: "green",
    subtitle: "Awaiting print action"
  },
  
];

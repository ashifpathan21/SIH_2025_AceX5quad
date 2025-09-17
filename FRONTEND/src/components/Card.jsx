import React from 'react'
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
  School,
  UserCheck,
  Clock,
  Target,
  Plus,
  Bell,
  Settings,
  LogOut,
  RefreshCw,
} from "lucide-react";

// Utility function for combining classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");


const Card = ({ children, className = "", hoverable = false, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm",
        hoverable && "hover:shadow-md transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};



export default Card

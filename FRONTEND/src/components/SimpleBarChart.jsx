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

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, className = "" }) => {
  const maxValue = Math.max(...data.map((item) => item.attendanceRate));
  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm text-gray-600 font-medium">
              {item.className}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.attendanceRate / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-12 text-sm text-gray-900 font-semibold">
              {item.attendanceRate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default SimpleBarChart

import React from "react";
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

// Attendance Trend Chart (Simple Line Chart)
const AttendanceTrendChart = ({ data }) => {
  const maxValue = Math.max(...data?.map((item) => item?.rate)) 
  const minValue = Math.min(...data?.map((item) => item?.rate)) 
  const range = maxValue - minValue;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          7-Day Attendance Trend
        </h4>
        <div className="text-xs text-gray-500">Last 7 days</div>
      </div>

      <div className="relative h-32">
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {data?.map((item, index) => {
            const height =
              range > 0 ? ((item.rate - minValue) / range) * 100 : 50;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-6 bg-indigo-600 rounded-t-sm transition-all duration-500 relative group"
                  style={{ height: `${Math.max(height, 10)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.rate}%
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {item.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTrendChart;

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
import Card from './Card.jsx'

// Utility function for combining classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  color = "indigo",
}) => {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card hoverable className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                colorClasses[color]
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                {trend && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium",
                      trend > 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <TrendingUp
                      className={cn("w-3 h-3", trend < 0 && "rotate-180")}
                    />
                    {Math.abs(trend)}%
                  </span>
                )}
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

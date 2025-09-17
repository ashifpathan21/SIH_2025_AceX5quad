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

// Quick Actions Component
const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: "create-class",
      label: "Create Class",
      icon: Plus,
      color: "bg-blue-500",
    },
    {
      id: "assign-teacher",
      label: "Assign Teacher",
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      id: "view-attendance",
      label: "View Attendance",
      icon: Calendar,
      color: "bg-orange-500",
    },
    {
      id: "manage-students",
      label: "Manage Students",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-white",
              action.color
            )}
          >
            <action.icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;

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

// Top Students List Component
const TopStudentsList = ({ students }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          Top Performing Students
        </h4>
        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {students.map((student, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <div className="w-10 h-10 overflow-hidden object-cover bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600">
                <img
                  className="object-cover overflow-hidden"
                  src={student?.image || "/student.avif"}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-logo.png"; // दूसरा logo load करेगा
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500">{student.class}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {student.totalClassesAttended}%
              </p>
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${student.totalClasses}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStudentsList;

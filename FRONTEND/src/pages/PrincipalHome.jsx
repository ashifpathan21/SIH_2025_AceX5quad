import React, { useState, useEffect } from "react";
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

// API Configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api",
  ENDPOINTS: {
    DASHBOARD_STATS: "/principal/dashboard-stats",
    ATTENDANCE_OVERVIEW: "/principal/attendance-overview",
    TOP_STUDENTS: "/principal/top-students",
    CLASS_MANAGEMENT: "/principal/classes",
    RECENT_ACTIVITIES: "/principal/recent-activities",
  },
};

// Reusable Card Component
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

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, className = "" }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm text-gray-600 font-medium">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <div className="w-12 text-sm text-gray-900 font-semibold">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Attendance Trend Chart (Simple Line Chart)
const AttendanceTrendChart = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.attendance));
  const minValue = Math.min(...data.map((item) => item.attendance));
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
          {data.map((item, index) => {
            const height =
              range > 0 ? ((item.attendance - minValue) / range) * 100 : 50;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-6 bg-indigo-600 rounded-t-sm transition-all duration-500 relative group"
                  style={{ height: `${Math.max(height, 10)}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.attendance}%
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {item.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
            key={student.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {index + 1}
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-600">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {student.name}
                </p>
                <p className="text-xs text-gray-500">Class {student.class}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {student.score}%
              </p>
              <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${student.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

// Recent Activities Component
const RecentActivities = ({ activities }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Recent Activities</h4>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Header Component
const DashboardHeader = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Principal Dashboard
              </h1>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "Dr. Smith"}
                </p>
                <p className="text-xs text-gray-500">Principal</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main PrincipalHome Component
const PrincipalHome = ({ onLogout }) => {
  // State management
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalClasses: 0,
      totalTeachers: 0,
      attendanceRate: 0,
    },
    attendanceTrend: [],
    topStudents: [],
    classAttendance: [],
    recentActivities: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock data for demonstration
  const mockData = {
    stats: {
      totalStudents: 1247,
      totalClasses: 32,
      totalTeachers: 48,
      attendanceRate: 94.2,
    },
    attendanceTrend: [
      { day: "Mon", attendance: 92 },
      { day: "Tue", attendance: 94 },
      { day: "Wed", attendance: 91 },
      { day: "Thu", attendance: 96 },
      { day: "Fri", attendance: 89 },
      { day: "Sat", attendance: 88 },
      { day: "Sun", attendance: 85 },
    ],
    topStudents: [
      { id: 1, name: "Emma Rodriguez", class: "10A", score: 98 },
      { id: 2, name: "Liam Chen", class: "9B", score: 96 },
      { id: 3, name: "Olivia Johnson", class: "11A", score: 95 },
      { id: 4, name: "Noah Williams", class: "8C", score: 94 },
      { id: 5, name: "Sophia Davis", class: "10B", score: 93 },
    ],
    classAttendance: [
      { label: "10A", value: 28 },
      { label: "10B", value: 30 },
      { label: "9A", value: 26 },
      { label: "9B", value: 29 },
      { label: "11A", value: 25 },
    ],
    recentActivities: [
      {
        description: "New student enrolled in Class 10A",
        time: "2 minutes ago",
      },
      { description: "Teacher assigned to Class 9B", time: "15 minutes ago" },
      { description: "Attendance marked for all classes", time: "1 hour ago" },
      { description: "Parent-teacher meeting scheduled", time: "2 hours ago" },
      {
        description: "New assignment created for Class 11A",
        time: "3 hours ago",
      },
    ],
  };

  // API calls
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // In a real implementation, you would make actual API calls here
      // const token = localStorage.getItem('token');
      // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD_STATS}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quick actions
  const handleQuickAction = (actionId) => {
    console.log("Quick action clicked:", actionId);
    // In a real app, you would navigate to the respective page
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen overflow-x-hidden  bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen overflow-x-hidden  bg-gray-50">
      {/* Header */}
      <DashboardHeader onLogout={onLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Good morning, Dr. Smith! 👋
              </h2>
              <p className="text-gray-600 mt-1">
                Here's what's happening at your school today
              </p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1 mt-1 text-indigo-600 hover:text-indigo-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={dashboardData.stats.totalStudents.toLocaleString()}
            subtitle="across all classes"
            trend={5.2}
            color="blue"
          />
          <StatCard
            icon={BookOpen}
            title="Total Classes"
            value={dashboardData.stats.totalClasses}
            subtitle="active classes"
            color="green"
          />
          <StatCard
            icon={UserCheck}
            title="Total Teachers"
            value={dashboardData.stats.totalTeachers}
            subtitle="faculty members"
            color="purple"
          />
          <StatCard
            icon={TrendingUp}
            title="Attendance Rate"
            value={`${dashboardData.stats.attendanceRate}%`}
            subtitle="today's average"
            trend={2.1}
            color="orange"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Attendance Trend */}
            <Card className="p-6">
              <AttendanceTrendChart data={dashboardData.attendanceTrend} />
            </Card>

            {/* Class Attendance Overview */}
            <Card className="p-6">
              <SimpleBarChart
                data={dashboardData.classAttendance}
                title="Today's Class Attendance"
              />
            </Card>
          </div>

          {/* Right Column - Lists and Actions */}
          <div className="space-y-6">
            {/* Top Students */}
            <Card className="p-6">
              <TopStudentsList students={dashboardData.topStudents} />
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Quick Actions
                </h4>
              </div>
              <QuickActions onActionClick={handleQuickAction} />
            </Card>

            {/* Recent Activities */}
            <Card className="p-6">
              <RecentActivities activities={dashboardData.recentActivities} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrincipalHome;

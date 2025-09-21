import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import SimpleBarChart from "../components/SimpleBarChart.jsx";
import Card from "../components/Card.jsx";
import AttendanceTrendChart from "../components/AttendanceTrendChart.jsx";
import TopStudentsList from "../components/TopStudentsList.jsx";
import QuickActions from "../components/QuickActions.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/principalService.js";

// Main PrincipalHome Component
const PrincipalHome = () => {
  const [token] = useState(localStorage.getItem("principalToken"));
  const profile = useSelector((state) => state.principal.profile);
  const navigate = useNavigate();
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
  const dispatch = useDispatch();

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const res = await dispatch(getDashboard(token));
      console.log(res);
      setDashboardData(res);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    }
  };

  // Handle quick actions
  const handleQuickAction = (actionId) => {
    if (actionId === "manage-students") {
      navigate("/principal/students");
    } else if (actionId === "create-class") {
      navigate("/principal/classes");
    } else if (actionId === "assign-teacher") {
      navigate("/principal/teachers");
    }
     else if (actionId === "view-attendance") {
       navigate("/principal/attendance");
     }
    console.log("Quick action clicked:", actionId);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchDashboardData();
    setIsLoading(false);
  };

  // Load data on component mount
  useEffect(() => {
    setIsLoading(true);
    const loa = async () => {
      await fetchDashboardData();
    };
    loa();
    setIsLoading(false);
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
      <DashboardHeader
        user={{ name: profile.name }}
        onLogout={() => {
          localStorage.removeItem("principalToken");
          navigate("/");
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.school?.name}
              </h2>
              <h2 className="text-2xl font-bold text-gray-900">
                {`Welcome , ${profile?.name} 👋`}
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
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <AttendanceTrendChart data={dashboardData.attendanceTrend} />
            </Card>

            <Card className="p-6">
              <SimpleBarChart
                data={dashboardData.classAttendance}
                title="Today's Class Attendance"
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <TopStudentsList students={dashboardData.topStudents} />
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Quick Actions
                </h4>
              </div>
              <QuickActions onActionClick={handleQuickAction} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrincipalHome;

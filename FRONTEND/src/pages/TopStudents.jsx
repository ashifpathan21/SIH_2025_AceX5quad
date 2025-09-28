import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { getDashboard } from "../services/principalService.js";
import { Plus, Pencil, House, RefreshCw, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopFiveLeaderboard from "../components/TopFiveLeaderboard.jsx";
const TopStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.principal.data);
  const topStudents = data?.topStudents || [];
  const token = localStorage.getItem("principalToken");
  // Class-wise grouping
  const [isLoading, setIsLoading] = useState(false);
  const groupedByClass = useMemo(() => {
    return topStudents.reduce((acc, student) => {
      const className = student.class || "Unassigned";
      if (!acc[className]) acc[className] = [];
      acc[className].push(student);
      return acc;
    }, {});
  }, [topStudents]);

  const fetchDashboardData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await dispatch(getDashboard(token));
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    }
    setIsLoading(false);
  };
  // Tabs
  const classTabs = ["School", ...Object.keys(groupedByClass)];
  const [activeClass, setActiveClass] = useState("School");

  // Students to display
  const displayedStudents = useMemo(() => {
    let list =
      activeClass === "School"
        ? [...topStudents]
        : [...(groupedByClass[activeClass] || [])];

    // Sort by attendancePercentage descending for class/global rank
    list.sort((a, b) => b.attendancePercentage - a.attendancePercentage);

    return list;
  }, [activeClass, topStudents, groupedByClass]);

  // Compute global rank map
  const globalRankMap = useMemo(() => {
    const sorted = [...topStudents].sort(
      (a, b) => b.attendancePercentage - a.attendancePercentage
    );
    const map = {};
    sorted.forEach((student, index) => {
      map[student.name] = index + 1;
    });
    return map;
  }, [topStudents]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex w-full justify-between items-center p-2 px-4  ">
        <h1 className="text-2xl font-bold mb-6">Top Students</h1>

        <div className=" flex items-center gap-6 p-3">
          <button
            onClick={() => navigate("/principal/home")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <House className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => fetchDashboardData(token)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Class Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-6">
        {classTabs.map((cls) => (
          <button
            key={cls}
            onClick={() => setActiveClass(cls)}
            className={`px-4 py-2 rounded-t-lg font-medium transition ${
              activeClass === cls
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Students List */}
      <div className="space-y-3 min-h-screen ">
        <TopFiveLeaderboard leaderboard={displayedStudents} />
        {displayedStudents.slice(5).map((student, index) => (
          <motion.div
            key={student.name + index}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 p-3 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            {/* Rank */}
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {activeClass === "All" ? globalRankMap[student.name] + 5 : index + 6}
            </div>

            {/* Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
              <img
                src={student.image || "/student.avif"}
                alt={student.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/fallback-logo.png";
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {student.name}
              </p>
              <p className="text-xs text-gray-500">{student.class}</p>
            </div>

            {/* Attendance */}
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                {student.attendancePercentage}%
              </p>
              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${student.attendancePercentage}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {displayedStudents.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No students found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TopStudents;

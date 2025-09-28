import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RefreshCw, House, User } from "lucide-react";
import { getAllClasses } from "../services/classService";
import { getAttendanceByClass } from "../services/attendanceService";
import { motion } from "framer-motion";

const Attendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classes);
  const { attendance, loading } = useSelector((state) => state.attendance);

  const token = localStorage.getItem("principalToken");
  const [activeClass, setActiveClass] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await dispatch(getAllClasses(token));
      if (classes.length > 0) setActiveClass(classes[0]._id); // default first class
    }
    fetchData();
  }, [dispatch, token, classes.length]);

  useEffect(() => {
    if (activeClass) {
      dispatch(getAttendanceByClass(activeClass, token));
    }
  }, [activeClass, dispatch, token]);

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Attendance</h1>
        <div className="flex items-center gap-6 p-3">
          <button
            onClick={() => navigate("/principal/home")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <House className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() =>
              activeClass && dispatch(getAttendanceByClass(activeClass, token))
            }
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Class Tabs */}
      <div className="flex gap-4 border-b border-gray-300 mb-6 overflow-x-auto">
        {classes?.map((cls) => (
          <button
            key={cls._id}
            onClick={() => setActiveClass(cls._id)}
            className={`px-4 py-2 rounded-t-lg font-medium transition whitespace-nowrap ${
              activeClass === cls._id
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cls.name} (Room {cls.roomNo})
          </button>
        ))}
      </div>

      {/* Attendance List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : !activeClass ? (
        <p className="text-gray-500">
          Please select a class to view attendance.
        </p>
      ) : attendance?.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-5 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            Attendance Records ({attendance?.length || 0})
          </h2>
          <div className="grid gap-3">
            {attendance?.map((record, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {record.student?.image ? (
                    <img
                      src={record.student.image}
                      alt={record.student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">{record.student?.name}</p>
                    <p className="text-sm text-gray-500">
                      {record.student?.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {record.status}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

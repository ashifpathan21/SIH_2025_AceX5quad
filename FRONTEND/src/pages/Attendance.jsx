// src/pages/Attendance.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RefreshCw, House, User } from "lucide-react";
import { getAllClasses } from "../services/classService";
import { getAttendanceByClass } from "../services/attendanceService";

const Attendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classes);
  const { attendance, loading } = useSelector((state) => state.attendance);

  const token = localStorage.getItem("principalToken");
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await dispatch(getAllClasses(token));
    }
    fetchData();
  }, [dispatch, token]);

  const handleSelectClass = async (classId) => {
    setSelectedClass(classId);
    await dispatch(getAttendanceByClass(classId, token));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Attendance</h1>
        <div className="flex items-center gap-6 p-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <House className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => {
              if (selectedClass) {
                dispatch(getAttendanceByClass(selectedClass, token));
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Class Selector */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium">Select Class</label>
        <select
          onChange={(e) => handleSelectClass(e.target.value)}
          value={selectedClass || ""}
          className="border rounded-lg px-4 py-2 w-full"
        >
          <option value="">-- Choose a Class --</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name} (Room {cls.roomNo})
            </option>
          ))}
        </select>
      </div>

      {/* Attendance List */}
      {loading ? (
        <p>Loading attendance...</p>
      ) : !selectedClass ? (
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
              <div
                key={idx}
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
                <div>
                  <p
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {record.status}
                  </p>
                  <p className="text-xs text-gray-400 text-right">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

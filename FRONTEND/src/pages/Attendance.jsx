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
  const { records, loading } = useSelector((state) => state.attendance);
  const attendance = records;
  console.log(records)
  const token = localStorage.getItem("principalToken");
  const [activeClass, setActiveClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // default today
  );

  useEffect(() => {
    async function fetchData() {
      await dispatch(getAllClasses(token));
      if (classes.length > 0) setActiveClass(classes[0]._id);
    }
    fetchData();
  }, [dispatch, token, classes.length]);

  useEffect(() => {
    if (activeClass) {
      dispatch(getAttendanceByClass(activeClass, token));
    }
  }, [activeClass, dispatch, token]);

  // 🔹 date-wise filter apply
  const filteredAttendance = selectedDate
    ? attendance?.filter(
        (rec) => new Date(rec.date).toLocaleDateString("en-CA") === selectedDate
      )
    : attendance;

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

      {/* 🔹 Date Filter */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium">Filter by Date:</label>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Attendance List */}
      {/* Attendance Summary + Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : !activeClass ? (
        <p className="text-gray-500">
          Please select a class to view attendance.
        </p>
      ) : filteredAttendance?.length === 0 ? (
        <p className="text-gray-500">No attendance records found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-5 border border-gray-100">
          {/* 🔹 Summary */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Attendance Records</h2>
            <div className="flex gap-6 text-sm font-medium">
              <span>
                Total Students:{" "}
                <strong>{filteredAttendance?.length || 0}</strong>
              </span>
              <span>
                Present:{" "}
                <strong>
                  {
                    filteredAttendance?.filter(
                      (rec) => rec.status === "Present"
                    ).length
                  }
                </strong>
              </span>
            </div>
          </div>

          {/* 🔹 Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    #
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Student
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Roll No.
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Contact No.
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Father
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Mother
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-center">
                    Status
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-center">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance?.map((record, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="border border-gray-200 px-4 py-2">
                      {idx + 1}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 flex items-center gap-3">
                      {record.student?.image ? (
                        <img
                          src={record.student.image}
                          alt={record.student.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                      <span className="font-medium capitalize ">
                        {record.student?.name}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                      {record.student?.rollNumber}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                      {record.student?.parentsContact?.contact}
                    </td>
                    <td className="border capitalize border-gray-200 px-4 py-2 text-sm text-gray-600">
                      {record.student?.parentsContact?.fatherName}
                    </td>
                    <td className="border capitalize border-gray-200 px-4 py-2 text-sm text-gray-600">
                      {record.student?.parentsContact?.motherName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "Present"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-center text-sm text-gray-500">
                      {(() => {
                        const d = new Date(record.date);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

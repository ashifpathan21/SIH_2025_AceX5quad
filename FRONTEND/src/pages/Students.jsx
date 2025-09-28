// src/pages/Students.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, House, Trash2, Edit3, Users } from "lucide-react";
import { getAllStudents, deleteStudent } from "../services/studentService";

const Students = () => {
  const token = localStorage.getItem("principalToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.students);
  const [students, setStudents] = useState([]);
  const [activeClass, setActiveClass] = useState("All");

  // ✅ Fetch students
  useEffect(() => {
    async function getS() {
      const res = await dispatch(getAllStudents(token));
      setStudents(res);
    }
    getS();
  }, [dispatch, token]);

  // ✅ Group students by class
  const groupedByClass = students.reduce((acc, student) => {
    const className = student.class?.name || "Unassigned";
    if (!acc[className]) acc[className] = [];
    acc[className].push(student);
    return acc;
  }, {});

  // ✅ Class names (with "All" tab)
  const classTabs = ["All", ...Object.keys(groupedByClass)];

  // ✅ Students to display (with rollNumber sort)
  const displayedStudents =
    activeClass === "All"
      ? [...students].sort((a, b) => (a.rollNumber || 0) - (b.rollNumber || 0))
      : [...(groupedByClass[activeClass] || [])].sort(
          (a, b) => (a.rollNumber || 0) - (b.rollNumber || 0)
        );

  // ✅ Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent(id, token));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Students
        </h1>
        <div className="flex items-center gap-6 p-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <House className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => dispatch(getAllStudents(token))}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs for Classes */}
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

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedStudents.map((student) => (
            <motion.div
              key={student._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-white shadow h-20 flex items-center justify-between p-2 rounded-xl hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    student.image ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={student.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Roll: {student.rollNumber}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => alert("Open update modal for " + student.name)}
                  className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200"
                >
                  <Edit3 className="w-4 h-4 text-yellow-600" />
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && displayedStudents.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No students found.
        </div>
      )}
    </div>
  );
};

export default Students;

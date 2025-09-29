// src/pages/StudentsTable.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, House, Trash2, Users } from "lucide-react";
import { getAllStudents, deleteStudent } from "../services/studentService";

const StudentsTable = () => {
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

  // ✅ Class tabs
  const classTabs = ["All", ...Object.keys(groupedByClass)];

  // ✅ Students to display (rollNumber sorted)
  const displayedStudents =
    activeClass === "All"
      ? [...students].sort((a, b) => (a.rollNumber || 0) - (b.rollNumber || 0))
      : [...(groupedByClass[activeClass] || [])].sort(
          (a, b) => (a.rollNumber || 0) - (b.rollNumber || 0)
        );

  // ✅ Delete handler
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

      {/* Tabs */}
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
        <motion.div layout className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Roll No</th>
                <th className="border px-4 py-2 text-left">Class</th>
                <th className="border px-4 py-2 text-left">School</th>
                <th className="border px-4 py-2 text-left">RFID</th>
                <th className="border px-4 py-2 text-left">Father</th>
                <th className="border px-4 py-2 text-left">Mother</th>
                <th className="border px-4 py-2 text-left">Contact</th>
                <th className="border px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student, idx) => (
                <motion.tr
                  key={student._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="border px-4 py-2">
                    <img
                      src={
                        student.image ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="border capitalize px-4 py-2 font-medium">
                    {student.name}
                  </td>
                  <td className="border px-4 py-2">{student.rollNumber}</td>
                  <td className="border capitalize px-4 py-2">
                    {student.class?.name || "Unassigned"}
                  </td>
                  <td className="border capitalize px-4 py-2">
                    {student.school?.name || "—"}
                  </td>
                  <td className="border px-4 py-2">{student.RFID || "—"}</td>
                  <td className="border capitalize px-4 py-2">
                    {student.parentsContact?.fatherName || "—"}
                  </td>
                  <td className="border capitalize px-4 py-2">
                    {student.parentsContact?.motherName || "—"}
                  </td>
                  <td className="border px-4 py-2">
                    {student.parentsContact?.contact || "—"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
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

export default StudentsTable;

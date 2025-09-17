// src/pages/Students.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate } from 'react-router-dom'
import { motion } from "framer-motion";
import { RefreshCw , House, UserPlus, Trash2, Edit3, Users } from "lucide-react";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "../services/studentService";

const Students = () => {
  const token = localStorage.getItem("principalToken");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {  loading, error } = useSelector((state) => state.students);
  const [students , setStudents ]  = useState([])
  const [selectedClass, setSelectedClass] = useState("All");

  // ✅ Fetch students
  useEffect(() => {
  async function getS(){
        const res = await dispatch(getAllStudents(token));
        console.log(res)
        setStudents(res)
    }
    getS()

  }, [dispatch, token]);

  // ✅ Filtered students
  const filteredStudents =
    selectedClass === "All"
      ? students
      : students.filter((s) => s.class?.name === selectedClass);

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
        <div className=' flex items-center gap-6 p-3'>
          <button
            onClick={() => navigate('/')}
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

      {/* Class Filter */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm"
        >
          <option value="All">All Classes</option>
          {[...new Set(students?.map((s) => s.class?.name))]?.map(
            (cls, idx) =>
              cls && (
                <option key={idx} value={cls}>
                  {cls}
                </option>
              )
          )}
        </select>
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
          className="grid grid-cols-1 min-h-screen  sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredStudents?.map((student) => (
            <motion.div
              key={student._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="bg-white shadow shadow-violet-600  h-38 flex items-center justify-between p-2 rounded-xl  hover:shadow-md transition"
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
                  <p className="text-sm text-indigo-600">
                    Class: {student.class?.name || "N/A"}
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
      {!loading && filteredStudents?.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No students found.
        </div>
      )}
    </div>
  );
};

export default Students;

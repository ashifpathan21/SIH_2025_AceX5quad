// src/pages/Teachers.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  House,
  RefreshCw,
  Trash2,
  BookOpen,
  GraduationCap,
  User,
} from "lucide-react";
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../services/teacherService.js";
import { getAllClasses } from "../services/classService.js";
import TeacherModal from "../components/TeacherModal.jsx";

const Teachers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teachers, loading } = useSelector((state) => state.teachers);
  const { classes } = useSelector((state) => state.classes);
  const token = localStorage.getItem("principalToken");
  const [classesList, setClassList] = useState(classes || []);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    async function get() {
      await dispatch(getAllTeachers(token));
      const c = await dispatch(getAllClasses(token));
      setClassList(c);
    }
    get()
  }, [token]);

  const handleSubmit = (data) => {
    if (editData) {
      dispatch(updateTeacher(editData._id, data, token));
    } else {
      console.log("creating")
      dispatch(createTeacher(data, token));
    }
    setIsOpen(false);
  };



  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      dispatch(deleteTeacher(id, token));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teachers</h1>

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
              setEditData(null);
              setIsOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5" /> Add Teacher
          </button>
          <button
            onClick={() => dispatch(getAllTeachers(token))}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Teacher List */}
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading </p>
          </div>
        </div>
      ) : teachers.length === 0 ? (
        <p className="text-gray-500">No teachers available.</p>
      ) : (
        <div className="grid gap-6">
          {teachers.map((t) => (
            <div
              key={t._id}
              className="bg-white shadow rounded-lg p-5 border border-gray-100"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{t.name}</h2>
                    <p className="text-gray-500">{t.email}</p>
                    <p className="text-sm text-indigo-600 font-medium">
                      Role: {t.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(t);
                      setIsOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Pencil className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Class Teacher Of */}
              {t.classTeacher && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-medium">{t.classTeacher.name}</p>
                    <p className="text-sm text-gray-500">
                      Room {t.classTeacher.roomNo}
                    </p>
                  </div>
                </div>
              )}

              {/* Assigned Classes */}
              {t.assignedClasses && t.assignedClasses.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" /> Assigned
                    Classes
                  </h3>
                  <div className="grid gap-2">
                    {t.assignedClasses.map((ac) => (
                      <div
                        key={ac._id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <span className="font-medium">
                          {ac.class ? ac.class.name : "Not Assigned"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {ac.subject}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal (future ready) */}

      <TeacherModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        classesList={classesList}
      />
    </div>
  );
};

export default Teachers;

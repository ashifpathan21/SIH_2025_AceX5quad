// src/pages/Classes.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, House, RefreshCw, Trash2, User } from "lucide-react";
import ClassModal from "../components/ClassModal.jsx";
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from "../services/classService.js";
import { getAllTeachers } from "../services/teacherService.js";

const Classes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { classes, loading } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);
  const token = localStorage.getItem("principalToken");
  const [teachersList, setTeachersList] = useState(teachers || []);
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    async function get() {
      await dispatch(getAllClasses(token));
      const t = await dispatch(getAllTeachers(token));
      //console.log("teachers list ", t);
      setTeachersList(t);
    }
    get();
  }, [dispatch, token]);

  const handleSubmit = (data) => {
    if (editData) {
      dispatch(updateClass(editData._id, data, token));
    } else {
      dispatch(createClass(data, token));
    }
    setIsOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      dispatch(deleteClass(id, token));
    }
  };
  //console.log(classes)
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Classes</h1>

        <div className=" flex items-center gap-6 p-3">
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
            <Plus className="w-5 h-5" /> Add Class
          </button>
          <button
            onClick={() => dispatch(getAllClasses(token))}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Class List */}
      {loading ? (
        <p>Loading...</p>
      ) : classes.length === 0 ? (
        <p className="text-gray-500">No classes available.</p>
      ) : (
        <div className="grid gap-6">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white shadow rounded-lg p-5 border border-gray-100"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{cls.name}</h2>
                  <p className="text-gray-500">Room: {cls.roomNo}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(cls);
                      setIsOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Pencil className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Class Teacher */}
              {cls.classTeacher && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                  <img
                    src={cls.classTeacher.image}
                    alt={cls.classTeacher.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{cls.classTeacher.name}</p>
                    <p className="text-sm text-gray-500">
                      Class Teacher ({cls.classTeacher.email})
                    </p>
                  </div>
                </div>
              )}

              {/* Assigned Teachers */}
              {cls.teachers && cls.teachers.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Assigned Teachers
                  </h3>
                  <div className="grid gap-2">
                    {cls.teachers.map((t) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {t.image ? (
                            <img
                              src={t.image}
                              alt={t.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">{t?.teacher?.name}</p>
                            {/* Find subject assigned for this class */}
                            <p className="text-sm text-gray-500">
                              {t?.subject || "No subject"}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {t?.teacher?.email}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ClassModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        initialData={editData}
        teachersList={teachersList}
      />
    </div>
  );
};

export default Classes;

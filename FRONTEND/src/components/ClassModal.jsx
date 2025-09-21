import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash } from "lucide-react";

const ClassModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  teachersList = [], // pass all teachers from parent
}) => {
  const [form, setForm] = useState({
    name: "",
    roomNo: "",
    classTeacher: "",
    teachers: [], // { teacher: id, subject: "" }
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        roomNo: initialData.roomNo || "",
        classTeacher: initialData.classTeacher?._id || "",
        teachers:
          initialData.teachers?.map((t) => ({
            teacher: t.teacher?._id,
            subject: t.subject || "",
          })) || [],
      });
    } else {
      setForm({ name: "", roomNo: "", classTeacher: "", teachers: [] });
    }
  }, [initialData]);

  const handleTeacherChange = (index, field, value) => {
    const updated = [...form.teachers];
    updated[index][field] = value;
    setForm({ ...form, teachers: updated });
  };

  const addTeacherRow = () => {
    setForm({
      ...form,
      teachers: [
        ...form.teachers,
        { teacher: "", subject: "" },
      ],
    });
  };

  const removeTeacherRow = (index) => {
    const updated = [...form.teachers];
    updated.splice(index, 1);
    setForm({ ...form, teachers: updated });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? "Update Class" : "Create Class"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Room No */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room No
            </label>
            <input
              type="text"
              value={form.roomNo}
              onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Class Teacher */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Teacher
            </label>
            <select
              value={form.classTeacher}
              onChange={(e) =>
                setForm({ ...form, classTeacher: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Select Teacher</option>
              {teachersList.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Teachers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Teachers with Subjects
            </label>
            {form.teachers.map((at, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={at.teacher}
                  onChange={(e) =>
                    handleTeacherChange(index, "teacher", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Select Teacher</option>
                  {teachersList.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Subject"
                  value={at.subject}
                  onChange={(e) =>
                    handleTeacherChange(index, "subject", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeTeacherRow(index)}
                  className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTeacherRow}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:underline mt-2"
            >
              <Plus className="w-4 h-4" /> Add Teacher
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ClassModal;

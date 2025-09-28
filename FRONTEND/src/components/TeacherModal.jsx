// src/components/modals/TeacherModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const TeacherModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  classesList = [],
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    image: null, // File object
    role: "teacher",
    classTeacher: "",
    assignedClasses: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        image: null, // backend will use file
        role: initialData.role || "teacher",
        classTeacher: initialData.classTeacher?._id || "",
        assignedClasses:
          initialData.assignedClasses?.map((ac) => ({
            class: ac.class?._id || "",
            subject: ac.subject || "",
          })) || [],
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        image: null,
        role: "teacher",
        classTeacher: "",
        assignedClasses: [],
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleAssignedChange = (index, key, value) => {
    const updated = [...form.assignedClasses];
    updated[index][key] = value;
    setForm({ ...form, assignedClasses: updated });
  };

  const addAssignedClass = () => {
    setForm({
      ...form,
      assignedClasses: [...form.assignedClasses, { class: "", subject: "" }],
    });
  };

  const removeAssignedClass = (index) => {
    const updated = [...form.assignedClasses];
    updated.splice(index, 1);
    setForm({ ...form, assignedClasses: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("role", form.role);
      if (form.password) formData.append("password", form.password);
      if (form.classTeacher) formData.append("classTeacher", form.classTeacher);
      if (form.assignedClasses?.length)
        formData.append(
          "assignedClasses",
          JSON.stringify(form.assignedClasses)
        );
      if (form.image) formData.append("image", form.image); // file object

      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-3xl bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? "Update Teacher" : "Add Teacher"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {/* Password */}
          {!initialData && (
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {form.image && (
              <p className="mt-2 text-sm text-gray-500">{form.image.name}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Class Teacher */}
          <div>
            <label className="block text-sm font-medium">
              Class Teacher Of
            </label>
            <select
              value={form.classTeacher}
              onChange={(e) =>
                setForm({ ...form, classTeacher: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">-- None --</option>
              {classesList.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Classes */}
          <div>
            <label className="block text-sm font-medium">
              Assigned Classes
            </label>
            <div className="space-y-3">
              {form.assignedClasses.map((ac, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                >
                  <select
                    value={ac.class}
                    onChange={(e) =>
                      handleAssignedChange(index, "class", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="">-- Select Class --</option>
                    {classesList.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={ac.subject}
                    onChange={(e) =>
                      handleAssignedChange(index, "subject", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeAssignedClass(index)}
                    className="p-2 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAssignedClass}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
              >
                <Plus className="w-4 h-4" /> Add Class
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            disabled={loading}
          >
            {initialData ? "Update" : "Create"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TeacherModal;

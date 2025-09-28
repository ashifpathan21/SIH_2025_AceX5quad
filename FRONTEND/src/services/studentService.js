// src/services/studentService.js
import { apiConnector } from "../api/apiConnector";
import { studentEndpoints } from "../api/apis";
import { toast } from "react-toastify";
import {
  setStudents,
  setLoading,
  setError,
} from "../redux/slices/studentSlice";

// ✅ Create Student
export function createStudent(data, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("POST", studentEndpoints.CREATE, data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Student created successfully");

      // Refresh after creating
      dispatch(getAllStudents(token));

      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to create student")
      );
      toast.error("Failed to create student");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get All Students
export function getAllStudents(token) {
  return async (dispatch) => {
    try {
      //console.log("getting Students");
      dispatch(setLoading(true));
      const res = await apiConnector("GET", studentEndpoints.GET_ALL, null, {
        Authorization: `Bearer ${token}`,
      });
      //console.log(res);
      dispatch(setStudents(res.data));
      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch students")
      );
      toast.error("Failed to fetch students");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Update Student
export function updateStudent(studentId, data, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector(
        "PUT",
        studentEndpoints.UPDATE(studentId),
        data,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Student updated successfully");

      // Refresh after update
      dispatch(getAllStudents(token));

      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to update student")
      );
      toast.error("Failed to update student");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Delete Student
export function deleteStudent(studentId, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector(
        "DELETE",
        studentEndpoints.DELETE(studentId),
        null,
        { Authorization: `Bearer ${token}` }
      );
      toast.success("Student deleted successfully");

      // Refresh after delete
      dispatch(getAllStudents(token));

      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to delete student")
      );
      toast.error("Failed to delete student");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

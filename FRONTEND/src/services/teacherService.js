// src/services/teacherService.js
import { apiConnector } from "../api/apiConnector";
import { teacherEndpoints } from "../api/apis";
import { toast } from "react-toastify";
import {
  setTeachers,
  setLoading,
  setError,
} from "../redux/slices/teacherSlice";

// ✅ Create Teacher
export function createTeacher(data, token) {
  return async (dispatch) => {
    try {
      //console.log(data);

      dispatch(setLoading(true));
      const res = await apiConnector("POST", teacherEndpoints.CREATE, data, {
        Authorization: `Bearer ${token}`,
      });
      //console.log(res);

      toast.success("Teacher created successfully");

      // Refresh after creating
      dispatch(getAllTeachers(token));

      return res.data;
    } catch (error) {
      //console.log(error);
      toast.error("Failed to create teacher");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Login Teacher
export function loginTeacher(data) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("POST", teacherEndpoints.LOGIN, data);
      toast.success("Login successful");
      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Invalid credentials")
      );
      toast.error("Invalid credentials");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get All Teachers
export function getAllTeachers(token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", teacherEndpoints.GET_ALL, null, {
        Authorization: `Bearer ${token}`,
      });
      //console.log(res);
      dispatch(setTeachers(res.data));
      return res.data;
    } catch (error) {
       console.log(error);
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch teachers")
      );
      toast.error("Failed to fetch teachers");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get Teacher by ID
export function getTeacherById(id, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector(
        "GET",
        teacherEndpoints.GET_BY_ID(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      return res.data.teacher;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch teacher")
      );
      toast.error("Failed to fetch teacher");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Update Teacher
export function updateTeacher(id, data, token) {
  return async (dispatch) => {
    try {
      //console.log(data);
      dispatch(setLoading(true));
      const res = await apiConnector("PUT", teacherEndpoints.UPDATE(id), data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Teacher updated successfully");
      //console.log(res);
      // Refresh after update
      dispatch(getAllTeachers(token));

      return res.data;
    } catch (error) {
      //console.log(error);
      dispatch(
        setError(error.response?.data?.message || "Failed to update teacher")
      );
      toast.error("Failed to update teacher");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Delete Teacher
export function deleteTeacher(id, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector(
        "DELETE",
        teacherEndpoints.DELETE(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Teacher deleted successfully");

      // Refresh after delete
      dispatch(getAllTeachers(token));

      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to delete teacher")
      );
      toast.error("Failed to delete teacher");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

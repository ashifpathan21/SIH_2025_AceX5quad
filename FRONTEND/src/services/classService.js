// src/services/classService.js
import { apiConnector } from "../api/apiConnector";
import { classEndpoints } from "../api/apis";
import { toast } from "react-toastify";
import { setClasses, setLoading, setError } from "../redux/slices/classSlice";

// ✅ Create Class
export function createClass(data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("POST", classEndpoints.CREATE, data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Class created successfully");

      // Refresh classes after create
      dispatch(getAllClasses(token));

      return res.data;
    } catch (error) {
      dispatch(setError("Failed to create class"));
      toast.error("Failed to create class");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get All Classes
export function getAllClasses(token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("GET", classEndpoints.GET_ALL, null, {
        Authorization: `Bearer ${token}`,
      });
      //console.log(res);
      dispatch(setClasses(res.data || []));
      return res.data;
    } catch (error) {
      console.log(error)
      dispatch(setError("Failed to fetch classes"));
      toast.error("Failed to fetch classes");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get Class by ID
export function getClassById(id, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "GET",
        classEndpoints.GET_BY_ID(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      return res.data.classData;
    } catch (error) {
      dispatch(setError("Failed to fetch class"));
      toast.error("Failed to fetch class");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Update Class
export function updateClass(id, data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("PUT", classEndpoints.UPDATE(id), data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Class updated successfully");

      // Refresh classes after update
      dispatch(getAllClasses(token));

      return res.data;
    } catch (error) {
      dispatch(setError("Failed to update class"));
      toast.error("Failed to update class");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Delete Class
export function deleteClass(id, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "DELETE",
        classEndpoints.DELETE(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Class deleted successfully");

      // Refresh classes after delete
      dispatch(getAllClasses(token));

      return res.data;
    } catch (error) {
      dispatch(setError("Failed to delete class"));
      toast.error("Failed to delete class");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

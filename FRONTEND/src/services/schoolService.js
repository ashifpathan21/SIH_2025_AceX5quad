// src/services/schoolService.js
import { apiConnector } from "../api/apiConnector";
import { schoolEndpoints } from "../api/apis";
import toast from "react-hot-toast";
import { setSchools, setLoading, setError } from "../redux/slices/schoolSlice";

// ✅ Create School
export function createSchool(data, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("POST", schoolEndpoints.CREATE, data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("School created successfully");
      // Refresh school list after creating
      dispatch(getAllSchools(token));
      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to create school")
      );
      toast.error("Failed to create school");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get All Schools
export function getAllSchools(token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", schoolEndpoints.GET_ALL, null, {
        Authorization: `Bearer ${token}`,
      });
      dispatch(setSchools(res.data.schools));
      return res.data.schools;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch schools")
      );
      toast.error("Failed to fetch schools");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get School By ID
export function getSchoolById(id, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector(
        "GET",
        schoolEndpoints.GET_BY_ID(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      return res.data.school; // slice me selectedSchool agar chahiye toh reducer add karna padega
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch school")
      );
      toast.error("Failed to fetch school");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Update School
export function updateSchool(id, data, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("PUT", schoolEndpoints.UPDATE(id), data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("School updated successfully");
      // Refresh school list
      dispatch(getAllSchools(token));
      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to update school")
      );
      toast.error("Failed to update school");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Delete School
export function deleteSchool(id, token) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector(
        "DELETE",
        schoolEndpoints.DELETE(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("School deleted successfully");
      // Refresh list
      dispatch(getAllSchools(token));
      return res.data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to delete school")
      );
      toast.error("Failed to delete school");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

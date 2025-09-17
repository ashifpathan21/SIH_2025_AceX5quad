// src/services/foodMenuService.js
import { apiConnector } from "../api/apiConnector";
import { foodMenuEndpoints } from "../api/apis";
import toast from "react-hot-toast";
import { setMenu, setLoading, setError } from "../redux/slices/foodMenuSlice";

// ✅ Create Food Menu
export function createFoodMenu(data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("POST", foodMenuEndpoints.CREATE, data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Food menu created successfully");

      // Refresh after create
      dispatch(getAllFoodMenu(token));

      return res.data;
    } catch (error) {
      dispatch(setError("Failed to create food menu"));
      toast.error("Failed to create food menu");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get All Food Menu
export function getAllFoodMenu(token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("GET", foodMenuEndpoints.GET_ALL, null, {
        Authorization: `Bearer ${token}`,
      });
      dispatch(setMenu(res.data.foodMenus || []));
      return res.data.foodMenus;
    } catch (error) {
      dispatch(setError("Failed to fetch food menu"));
      toast.error("Failed to fetch food menu");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get Food Menu by ID
export function getFoodMenuById(id, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "GET",
        foodMenuEndpoints.GET_BY_ID(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      return res.data.foodMenu;
    } catch (error) {
      dispatch(setError("Failed to fetch food menu"));
      toast.error("Failed to fetch food menu");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Update Food Menu
export function updateFoodMenu(id, data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "PUT",
        foodMenuEndpoints.UPDATE(id),
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Food menu updated successfully");

      // Refresh after update
      dispatch(getAllFoodMenu(token));

      return res.data;
    } catch (error) {
      dispatch(setError("Failed to update food menu"));
      toast.error("Failed to update food menu");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Delete Food Menu
export function deleteFoodMenu(id, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "DELETE",
        foodMenuEndpoints.DELETE(id),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Food menu deleted successfully");

      // Refresh after delete
      dispatch(getAllFoodMenu(token));

      return res.data;
    } catch (error) {
      dispatch(setError("Failed to delete food menu"));
      toast.error("Failed to delete food menu");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

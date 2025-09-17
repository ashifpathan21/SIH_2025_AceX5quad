import { apiConnector } from "../api/apiConnector";
import { principalEndpoints } from "../api/apis";
import toast from "react-hot-toast";
import {
  setPrincipal,
  setLoading,
  setError,
} from "../redux/slices/principalSlice";

// ✅ Register Principal
export function registerPrincipal(data) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("POST", principalEndpoints.REGISTER, data);
      toast.success("Principal registered successfully");
      dispatch(setPrincipal(res.data.principal || null));
      return res.data;
    } catch (error) {
      dispatch(setError("Failed to register principal"));
      toast.error("Failed to register principal");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Login Principal
export function loginPrincipal(data) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("POST", principalEndpoints.LOGIN, data);
      toast.success("Login successful");
      console.log(res);
      dispatch(setPrincipal(res.data.principal || null));

      // 🛑 Save token to localStorage
      if (res.data?.token) {
        localStorage.setItem("principalToken", res.data.token);
      }

      return res.data;
    } catch (error) {
      dispatch(setError("Invalid credentials"));
      toast.error("Invalid credentials");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get Profile
export function getPrincipalProfile(token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "GET",
        principalEndpoints.GET_PROFILE,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(res);
      dispatch(setPrincipal(res.data.principal || null));
      return res.data;
    } catch (error) {
      dispatch(setError("Failed to fetch profile"));
      toast.error("Failed to fetch profile");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}
export function getDashboard(token) {
  return async () => {
    setLoading(true);
    try {
      const res = await apiConnector(
        "GET",
        principalEndpoints.DASHBOARD,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      return res.data;
    } catch (error) {
      toast.error("Failed to fetch profile");
      return null;
    } finally {
    }
  };
}

// ✅ Update Profile
export function updatePrincipalProfile(data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "PUT",
        principalEndpoints.UPDATE_PROFILE,
        data,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Profile updated successfully");
      dispatch(setPrincipal(res.data.principal || null));
      return res.data;
    } catch (error) {
      dispatch(setError("Failed to update profile"));
      toast.error("Failed to update profile");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

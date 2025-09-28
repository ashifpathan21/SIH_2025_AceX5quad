// src/services/attendanceService.js
import { apiConnector } from "../api/apiConnector";
import { attendanceEndpoints } from "../api/apis";
import { toast } from "react-toastify";
import {
  setAttendance,
  setLoading,
  setError,
} from "../redux/slices/attendanceSlice";

// ✅ Mark Attendance
export function markAttendance(data, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("POST", attendanceEndpoints.MARK, data, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Attendance marked successfully");
      dispatch(setAttendance(res.data.attendance || []));
      return res.data;
    } catch (error) {
      dispatch(setError("Failed to mark attendance"));
      toast.error("Failed to mark attendance");
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get Attendance by Class
export function getAttendanceByClass(classId, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "GET",
        attendanceEndpoints.GET_BY_CLASS(classId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(res);
      dispatch(setAttendance(res.data.attendance || []));
      return res.data.attendance;
    } catch (error) {
      dispatch(setError("Failed to fetch class attendance"));
      toast.error("Failed to fetch class attendance");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get Attendance by Student
export function getAttendanceByStudent(studentId, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector(
        "GET",
        attendanceEndpoints.GET_BY_STUDENT,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      console.log(res);
      dispatch(setAttendance(res.data.attendance || []));
      return res.data.attendance;
    } catch (error) {
      dispatch(setError("Failed to fetch student attendance"));
      toast.error("Failed to fetch student attendance");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

// ✅ Get All Attendance
export function getAllAttendance(token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const res = await apiConnector("GET", attendanceEndpoints.GET_ALL, null, {
        Authorization: `Bearer ${token}`,
      });
      dispatch(setAttendance(res.data.attendance || []));
      return res.data.attendance;
    } catch (error) {
      dispatch(setError("Failed to fetch attendance"));
      toast.error("Failed to fetch attendance");
      return [];
    } finally {
      dispatch(setLoading(false));
    }
  };
}

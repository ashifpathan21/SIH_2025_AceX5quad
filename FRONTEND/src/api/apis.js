// src/api/apis.js
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ================= AUTH / PRINCIPAL =================
export const principalEndpoints = {
  LOGIN: `${BASE_URL}/auth/principal/login`,
  REGISTER: `${BASE_URL}/auth/principal/create`,
  GET_PROFILE: `${BASE_URL}/auth/principal/profile`,
  UPDATE_PROFILE: `${BASE_URL}/auth/principal/update`,
  DASHBOARD: `${BASE_URL}/auth/principal/dashboard`,
};

// ================= SCHOOLS =================
export const schoolEndpoints = {
  CREATE: `${BASE_URL}/schools/create`,
  GET_ALL: `${BASE_URL}/schools/getAll`,
  GET_BY_ID: (id) => `${BASE_URL}/schools/${id}`,
  UPDATE: (id) => `${BASE_URL}/schools/update/${id}`,
  DELETE: (id) => `${BASE_URL}/schools/delete/${id}`,
};

// ================= CLASSES =================
export const classEndpoints = {
  CREATE: `${BASE_URL}/classes/create`,
  GET_ALL: `${BASE_URL}/classes/getAll`,
  GET_BY_ID: (id) => `${BASE_URL}/classes/${id}`,
  UPDATE: (id) => `${BASE_URL}/classes/update/${id}`,
  DELETE: (id) => `${BASE_URL}/classes/delete/${id}`,
};

// ================= TEACHERS =================
export const teacherEndpoints = {
  CREATE: `${BASE_URL}/teachers/create`,
  LOGIN: `${BASE_URL}/teachers/login`,
  GET_ALL: `${BASE_URL}/teachers/getAll`,
  GET_BY_ID: (id) => `${BASE_URL}/teachers/${id}`,
  UPDATE: (id) => `${BASE_URL}/teachers/update/${id}`,
  DELETE: (id) => `${BASE_URL}/teachers/delete/${id}`,
};

// ================= STUDENTS =================
export const studentEndpoints = {
  CREATE: `${BASE_URL}/students/create`,
  LOGIN: `${BASE_URL}/students/login`,
  GET_ALL: `${BASE_URL}/students/getAll`,
  GET_BY_ID: (id) => `${BASE_URL}/students/${id}`,
  UPDATE: (id) => `${BASE_URL}/students/update/${id}`,
  DELETE: (id) => `${BASE_URL}/students/delete/${id}`,
};

// ================= FOOD MENU =================
export const foodMenuEndpoints = {
  CREATE: `${BASE_URL}/foodmenu/create`,
  GET_ALL: `${BASE_URL}/foodmenu/getAll`,
  GET_BY_ID: (id) => `${BASE_URL}/foodmenu/${id}`,
  UPDATE: (id) => `${BASE_URL}/foodmenu/update/${id}`,
  DELETE: (id) => `${BASE_URL}/foodmenu/delete/${id}`,
};

// ================= ATTENDANCE =================
export const attendanceEndpoints = {
  MARK: `${BASE_URL}/attendance/mark`,
  GET_BY_CLASS: (classId) => `${BASE_URL}/attendance/class/${classId}`,
  GET_BY_STUDENT: (studentId) => `${BASE_URL}/attendance/student/${studentId}`,
  GET_ALL: `${BASE_URL}/attendance/getAll`,
};

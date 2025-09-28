import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrincipalLogin from "./pages/PrincipalLogin";
import PrincipalHome from "./pages/PrincipalHome";
import PrincipalProtectedRoutes from "./routes/PrincipalProtectedRoutes";
import Students from './pages/Students.jsx'
import Classes from "./pages/Classes.jsx";
import Teachers from "./pages/Teachers.jsx";
import Attendance from "./pages/Attendance.jsx";
import TopStudents from "./pages/TopStudents.jsx";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PrincipalLogin />} />

        <Route element={<PrincipalProtectedRoutes />}>
          <Route path="/principal/home" element={<PrincipalHome />} />
          <Route path="/principal/students" element={<Students />} />
          <Route path="/principal/top/students" element={<TopStudents />} />
          <Route path="/principal/classes" element={<Classes />} />
          <Route path="/principal/teachers" element={<Teachers />} />
          <Route path="/principal/attendance" element={<Attendance />} />
        </Route>

        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPrincipalProfile } from "../services/principalService.js";
import { setPrincipal, setLoading } from "../redux/slices/principalSlice.js";
import toast from "react-hot-toast";
/**
 * Usage:
 * <Route element={<PrincipalProtectedRoutes />}>
 *   <Route path="/principal/home" element={<PrincipalHome />} />
 * </Route>
 */

export default function PrincipalProtectedRoutes() {
  const dispatch = useDispatch();
  const [isPrincipal, setIsPrincipal] = useState(false);
  const { profile, loading } = useSelector((state) => state.principal);
  const [token] = useState(localStorage.getItem("principalToken"));

  useEffect(() => {
    const as = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getPrincipalProfile(token));
        await setIsPrincipal(true);
        console.log("done");
        dispatch(setLoading(false));

      } catch (err) {
        toast.error(err.message);
      return <Navigate to="/" replace />;
      }
    };
   as()
  }, [token]);

  // Show nothing or a loader while fetching profile
  if (loading)
    return (
      <div className="p-4 h-screen w-screen flex justify-center items-center">
        Loading...
      </div>
    );

 
   
  

  return <Outlet />;
}

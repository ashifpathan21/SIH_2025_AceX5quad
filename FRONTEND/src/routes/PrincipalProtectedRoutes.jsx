import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPrincipalProfile } from "../services/principalService.js";
import { setPrincipal, setLoading } from "../redux/slices/principalSlice.js";
import { toast } from "react-toastify";
import { RefreshCw } from "lucide-react";
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
  const navigate = useNavigate();
  useEffect(() => {
    const as = async () => {
      try {
        dispatch(setLoading(true));
        const res = await dispatch(getPrincipalProfile(token));
        await setIsPrincipal(true);
        dispatch(setLoading(false));
      } catch (err) {
        //console.log(err);
        toast.error(err.message);
        navigate("/");
        return <Navigate to="/" replace />;
      }
    };
    if (!profile) as();
  }, [token]);

  // Show nothing or a loader while fetching profile
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading</p>
        </div>
      </div>
    );

  return <Outlet />;
}

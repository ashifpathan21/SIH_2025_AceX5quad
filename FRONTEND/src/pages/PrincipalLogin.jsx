import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
  Loader2,
  School,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import Alert from "../components/Alert.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";
import { loginPrincipal } from "../services/principalService.js";
import { useNavigate } from "react-router-dom";
import { getPrincipalProfile } from "../services/principalService.js";
import { setPrincipal, setLoading } from "../redux/slices/principalSlice.js";
import { useDispatch, useSelector } from "react-redux";

// Utility function for combining classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Main PrincipalLogin Component
const PrincipalLogin = () => {
  const [token] = useState(localStorage.getItem("principalToken"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { profile, loading } = useSelector((state) => state.principal);
  const get = async () => {
    try {
      dispatch(setLoading(true));
      const res = await dispatch(getPrincipalProfile(token));
      navigate("/principal/home");
      dispatch(setLoading(false));
    } catch (err) {
      toast.error(err.message);
      localStorage.removeItem("principalToken");
    }
  };
  useEffect(() => {
    if (token) {
      get();
    }
  }, [token]);
  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(
        loginPrincipal({ email: formData.email, password: formData.password })
      );
      navigate("/principal/home");
    } catch (error) {
      setApiError(error.message);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-indigo" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Principal Portal
            </h1>
            <p className="text-indigo-100 text-sm">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {/* API Error Alert */}
            {apiError && (
              <div className="mb-6">
                <Alert
                  type="error"
                  message={apiError}
                  onClose={() => setApiError("")}
                />
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-6">
              {/* Email Input */}
              <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
                required
                autoComplete="email"
              />

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={cn(
                      "w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none",
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 bg-white"
                    )}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>



               <div className='p-2 font-semibold '>
                <h5>Use Sample Input (all the data is dynamic) </h5>
                <p>Email : rsk@gmail.com</p>
                <p>Password : rsk@123</p>
               </div>
              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2025 Smart Pravesh School Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrincipalLogin;

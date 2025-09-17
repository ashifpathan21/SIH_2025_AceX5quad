import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
  Loader2,
  School,
} from "lucide-react";

// Utility function for combining classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

// API Configuration
const API_CONFIG = {
  BASE_URL: "http://localhost:3000/api", // Update with your API base URL
  ENDPOINTS: {
    LOGIN: "/auth/login",
  },
};

// Reusable Input Component
const Input = ({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none",
          error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white",
          className
        )}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// Reusable Button Component
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-indigo-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-md",
    md: "px-4 py-3 text-base rounded-lg",
    lg: "px-6 py-4 text-lg rounded-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// Alert Component for notifications
const Alert = ({ type = "error", message, onClose }) => {
  const alertTypes = {
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-500",
    },
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-500",
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
    },
  };

  const alertStyle = alertTypes[type];

  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex items-center gap-3",
        alertStyle.bgColor,
        alertStyle.borderColor
      )}
    >
      <AlertCircle
        className={cn("w-5 h-5 flex-shrink-0", alertStyle.iconColor)}
      />
      <span className={cn("text-sm font-medium flex-1", alertStyle.textColor)}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className={cn("text-gray-400 hover:text-gray-600 ml-auto")}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Main PrincipalLogin Component
const PrincipalLogin = ({ onLoginSuccess }) => {
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

  // API call function
  const loginAPI = async (credentials) => {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          role: "principal", // Specify role for principal login
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API error
    setApiError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make API call
      const response = await loginAPI(formData);

      // Store JWT token
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("role", "principal");

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login function (for testing)
  const handleDemoLogin = () => {
    setFormData({
      email: "principal@school.com",
      password: "password123",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-white" />
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

            {/* Demo Login Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Demo Login</p>
                <button
                  onClick={handleDemoLogin}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline"
                >
                  Fill demo credentials
                </button>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <p>
                    <strong>Email:</strong> principal@school.com
                  </p>
                  <p>
                    <strong>Password:</strong> password123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 School Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrincipalLogin;

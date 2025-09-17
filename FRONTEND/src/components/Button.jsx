import React from 'react'
import {
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
  Loader2,
  School,
} from "lucide-react";


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

  const cn = (...classes) => classes.filter(Boolean).join(" ");
   
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


export default Button

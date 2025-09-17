import React from 'react'
import {
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
  Loader2,
  School,
} from "lucide-react";


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
    const cn = (...classes) => classes.filter(Boolean).join(" ");

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

export default Input

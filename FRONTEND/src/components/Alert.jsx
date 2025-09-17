import React from 'react'
import {
  Eye,
  EyeOff,
  BookOpen,
  AlertCircle,
  Loader2,
  School,
} from "lucide-react"; 

// Alert Component for notifications
const Alert = ({ type = "error", message, onClose }) => {
    const cn = (...classes) => classes.filter(Boolean).join(" ");
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

export default Alert

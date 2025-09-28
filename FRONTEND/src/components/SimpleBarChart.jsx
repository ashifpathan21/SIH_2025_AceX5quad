import React from "react";

// Simple Bar Chart Component
const SimpleBarChart = ({ data, title, className = "" }) => {
 

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Class Name */}
            <div className="w-20 text-sm text-gray-600 font-medium">
              {item.className}
            </div>

            {/* Bar */}
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(item.attendanceRate / 100 ) * 100}%`,
                }}
              />
            </div>

            {/* Attendance Numbers */}
            <div className="w-24 text-sm text-gray-900 font-semibold text-right">
              {item.presentCount}/{item.totalStudents} ({item.attendanceRate}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleBarChart;

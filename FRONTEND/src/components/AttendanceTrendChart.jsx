import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AttendanceTrendChart = ({ data, totalStudents }) => {
  console.log(totalStudents)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">
          7-Day Attendance Trend
        </h4>
        <div className="text-xs text-gray-500">Last 7 days</div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(val) =>
                `${val}% ${Math.round((val / 100) * totalStudents)} students`
              }
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4, fill: "#4f46e5" }}
              activeDot={{ r: 6, fill: "#4338ca" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceTrendChart;

import React from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti-boom";
import { useNavigate } from "react-router-dom";

const TopFiveLeaderboard = ({ leaderboard }) => {
  const topFive = leaderboard?.slice(0, 5);
  const navigate = useNavigate();

  // Display positions for top five
  const positions = ["#2", "#1", "#3", "#4", "#5"];

  // Order for visual centering: center #1, then #2 and #3 left/right, #4 and #5 at edges
  const containerOrder = [1, 0, 2, 3, 4];

  return (
    <div className="flex justify-center p-4 overflow-hidden   h-full items-center  gap-6 py-6 rounded-lg text-indigo-600 ">
      {containerOrder?.map((pos, idx) => {
        const student = topFive[pos];
        if (!student) return null;

        return (
          <div
            key={student?.name}
            className={`flex flex-col relative items-center justify-end w-[90px] ${
              idx === 1 ? "scale-130" : "scale-95"
            }`}
          >
            {/* Confetti for first place */}
            {idx === 1 && (
              <Confetti
                className="absolute z-10"
                mode="fall"
                particleCount={100}
                effectInterval={5000}
                colors={["#ff577f", "#ff884b"]}
              />
            )}

            {/* Rank */}
            <div className="text-lg font-bold mb-1 text-yellow-400">
              {positions[idx]}
            </div>

            {/* Avatar */}
            <div className="relative">
              <img
                src={student.image}
                alt={student.name}
                className={`rounded-full border-4 ${
                  idx === 1 ? "border-yellow-400" : "border-gray-300"
                } w-20 h-20 object-cover`}
              />
              {idx === 1 && (
                <div className="absolute bottom-0 right-0 bg-yellow-100 text-black font-bold text-xs px-2 py-0.5 rounded-full">
                  🏆
                </div>
              )}
            </div>

            {/* Name & class info */}
            <div className="mt-2 font-semibold ">{student.name}</div>
            <div className="text-xs ">{student.class}</div>
            <div className="text-xs ">
              {student.attendancePercentage}% Attendance
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopFiveLeaderboard;

import React from "react";
import { motion } from "framer-motion";
import { Crown, Star } from "lucide-react";

const TopFiveLeaderboard = ({ leaderboard = [] }) => {
 

  const data = leaderboard?.slice(0, 5) ;

  const FloatingElement = ({ children, delay = 0, className = "" }) => (
    <motion.div
      className={className}
      animate={{
        y: [0, -8, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  const StudentCard = ({ student, position, isWinner = false }) => {
    // Calculate podium height based on attendance percentage (max 40px)
    const podiumHeight = Math.max(8, (student.attendancePercentage / 100) * 60);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: position * 0.1, duration: 0.6 }}
        className={`relative p-4 overflow-hidden flex flex-col items-center ${
          isWinner ? "scale-110 z-10" : "scale-100"
        } transition-transform duration-300`}
      >
        {/* Position Badge */}
        <div
          className={`absolute -top-2 -left-2 z-20 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-lg ${
            position === 1
              ? "bg-gradient-to-br from-yellow-400 to-orange-500"
              : position === 2
              ? "bg-gradient-to-br from-gray-300 to-gray-500"
              : position === 3
              ? "bg-gradient-to-br from-orange-400 to-yellow-600"
              : "bg-gradient-to-br from-blue-400 to-purple-500"
          }`}
        >
          #{position}
        </div>

        {/* Crown for winner */}
        {isWinner && (
          <motion.div
            className="absolute -top-6 sm:-top-8 z-20"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-400" />
          </motion.div>
        )}

        {/* Student Card */}
        <div
          className={`relative bg-white/95 backdrop-blur-sm rounded-t-2xl p-3 sm:p-4 shadow-xl border border-white/20 ${
            isWinner ? "shadow-2xl shadow-yellow-200/50" : "shadow-lg"
          } min-w-0 w-full max-w-[140px] sm:max-w-[160px]`}
        >
          {/* Avatar */}
          <div className="flex justify-center mb-2">
            <div
              className={`relative ${
                isWinner
                  ? "w-14 h-14 sm:w-16 sm:h-16"
                  : "w-10 h-10 sm:w-12 sm:h-12"
              }`}
            >
              <img
                src={student.image}
                alt={student.name}
                className={`w-full h-full rounded-full object-cover ${
                  isWinner
                    ? "ring-4 ring-yellow-400/50 shadow-xl shadow-yellow-200/50"
                    : "ring-2 ring-blue-200/50 shadow-lg"
                }`}
              />
              {isWinner && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse" />
              )}
            </div>
          </div>

          {/* Student Info */}
          <div className="text-center space-y-1">
            <h3
              className={`font-bold text-gray-800 leading-tight ${
                isWinner ? "text-xs sm:text-sm" : "text-xs"
              } truncate`}
            >
              {student.name}
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Class {student.class}
            </p>

            {/* Attendance Progress */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">
                  Attendance
                </span>
                <span
                  className={`text-xs font-bold ${
                    student.attendancePercentage >= 95
                      ? "text-green-600"
                      : student.attendancePercentage >= 90
                      ? "text-yellow-600"
                      : "text-red-500"
                  }`}
                >
                  {student.attendancePercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${student.attendancePercentage}%` }}
                  transition={{
                    delay: position * 0.2,
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${
                    student.attendancePercentage >= 95
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : student.attendancePercentage >= 90
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                      : "bg-gradient-to-r from-red-400 to-red-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Podium Base */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${podiumHeight}px` }}
          transition={{ delay: position * 0.3, duration: 0.8, ease: "easeOut" }}
          className={`w-full overflow-hidden max-w-[140px] sm:max-w-[160px] rounded-b-lg shadow-lg ${
            position === 1
              ? "bg-gradient-to-b from-yellow-400 to-yellow-600"
              : position === 2
              ? "bg-gradient-to-b from-gray-400 to-gray-600"
              : position === 3
              ? "bg-gradient-to-b from-orange-400 to-orange-600"
              : "bg-gradient-to-b from-blue-400 to-blue-600"
          } flex items-center justify-center`}
        >
          <span className="text-white font-bold text-xs opacity-80">
            {student.attendancePercentage}%
          </span>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="w-full h-fit relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} className="absolute top-2 left-4">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-300" />
        </FloatingElement>
        <FloatingElement delay={1} className="absolute top-8 right-6">
          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-pink-400 fill-pink-300" />
        </FloatingElement>
        <FloatingElement delay={2} className="absolute bottom-4 left-8">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 fill-blue-300" />
        </FloatingElement>
        <FloatingElement delay={1.5} className="absolute bottom-8 right-4">
          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-purple-400 fill-purple-300" />
        </FloatingElement>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 sm:mb-6"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🏆 Top 5 Students
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Attendance Champions
        </p>
      </motion.div>

      {/* Leaderboard Layout - Horizontal with Podium */}
      <div className="flex flex-wrap justify-center p-4 overflow-hidden items-end gap-2 sm:gap-3 lg:gap-4 pb-2">
        {data.map((student, index) => (
          <StudentCard
            key={student.name}
            student={student}
            position={index + 1}
            isWinner={index === 0}
          />
        ))}
      </div>

      {/* Winner Confetti Effect */}
      {data.length > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${
                  i % 4 === 0
                    ? "bg-yellow-400"
                    : i % 4 === 1
                    ? "bg-pink-400"
                    : i % 4 === 2
                    ? "bg-blue-400"
                    : "bg-purple-400"
                }`}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopFiveLeaderboard;

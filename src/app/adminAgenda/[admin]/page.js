"use client";

import React, { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { format, addWeeks, subWeeks } from "date-fns";
import WelcomeAdmin from "../../../adminComponents/WelcomeAdmin";
import Sidebar from "../../../adminComponents/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import AdminChat from "../../../adminComponents/adminChat";
import { getAllUsers } from "../../../../lib/api";
// import { format } from "date-fns";

const AdminAgenda = () => {
  const [users, setUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showMobileWeekNav, setShowMobileWeekNav] = useState(false);

  const weekDays = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i)
      )
  );

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const toggleMobileWeekNav = () => {
    setShowMobileWeekNav(!showMobileWeekNav);
  };

  useEffect(() => {
    async function fetchUsers() {
      const usersFromApi = await getAllUsers();
      console.log(usersFromApi);
      setUsers(usersFromApi);
    }
    fetchUsers();
  }, []);
  

  return (
    <div className="min-h-screen lg:ml-30 p-4 lg:p-6">
      <Sidebar />

      {/* Mobile Sidebar Offset */}
      <div className="lg:hidden h-16"></div>

      <div className="mb-4 lg:mb-6 flex flex-wrap gap-2">
        <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-3 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold transform -skew-x-12 shadow-md">
          ☰ Admin Dashboard
        </span>
        <span className="bg-gradient-to-r from-red-600 to-red-800 text-white px-3 py-1 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold transform -skew-x-12 shadow-md">
          Agenda Manager
        </span>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
        {/* Left Side - Welcome Admin */}
        <div className="w-full xl:w-1/2 space-y-4 lg:space-y-6">
          <WelcomeAdmin />

          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-3 lg:p-4 rounded-xl shadow-lg border border-gray-800 w-full h-32 lg:h-40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-xs lg:text-sm font-light">
                  Total Appointments
                </p>
                <p className="text-white text-2xl lg:text-3xl font-bold mt-1 lg:mt-2">
                  128
                </p>
                <p className="text-green-400 text-xs mt-1">
                  ↑ 12% from last week
                </p>
              </div>
            </div>
            <div className="bg-white p-3 lg:p-4 rounded-xl shadow-lg border border-gray-200 w-full h-32 lg:h-40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-700 text-xs lg:text-sm font-light">
                  Upcoming Today
                </p>
                <p className="text-black text-2xl lg:text-3xl font-bold mt-1 lg:mt-2">
                  9
                </p>
                <p className="text-blue-500 text-xs mt-1">3 high priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Agenda */}
        <div className="w-full xl:w-1/2 bg-white p-4 lg:p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-6 gap-3">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
              Weekly Agenda
            </h2>

            {/* Desktop Week Navigation */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={prevWeek}
                className="p-1 lg:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm"
              >
                <FiChevronLeft className="text-gray-700" size={18} />
              </button>
              <h3 className="text-sm lg:text-lg font-semibold text-gray-700 px-3 lg:px-4 py-1 bg-gray-100 rounded-md">
                {format(weekDays[0], "MMM d")} -{" "}
                {format(weekDays[6], "MMM d, yyyy")}
              </h3>
              <button
                onClick={nextWeek}
                className="p-1 lg:p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm"
              >
                <FiChevronRight className="text-gray-700" size={18} />
              </button>
            </div>

            {/* Mobile Week Navigation */}
            <div className="sm:hidden w-full">
              <button
                onClick={toggleMobileWeekNav}
                className="w-full p-2 bg-gray-100 rounded-md text-sm font-medium flex justify-between items-center"
              >
                <span>
                  {format(weekDays[0], "MMM d")} -{" "}
                  {format(weekDays[6], "MMM d")}
                </span>
                <FiChevronRight
                  className={`transition-transform ${
                    showMobileWeekNav ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showMobileWeekNav && (
                <div className="mt-2 flex justify-between bg-gray-50 p-2 rounded-md">
                  <button
                    onClick={prevWeek}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
                  >
                    <FiChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Week {format(weekDays[0], "w")}
                  </span>
                  <button
                    onClick={nextWeek}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded-full"
                  >
                    <FiChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                  <th className="p-2 lg:p-3 text-left rounded-tl-lg text-xs lg:text-sm">
                    Team Member
                  </th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="p-1 lg:p-2 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-xs lg:text-sm font-medium ${
                            index === 0 ? "text-red-300" : "text-gray-300"
                          }`}
                        >
                          {format(day, "EEE").charAt(0)}
                        </span>
                        <span
                          className={`text-sm lg:text-base font-bold ${
                            index === 0 ? "text-white" : "text-white"
                          }`}
                        >
                          {format(day, "d")}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user.username}
                    className="border-b border-gray-100 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <td className="p-2 lg:p-3 font-medium text-gray-700 flex items-center text-xs lg:text-sm">
                      <div
                        className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${user.color} flex items-center justify-center text-white font-bold mr-2 lg:mr-3 text-xs lg:text-sm`}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div className="truncate max-w-[100px] lg:max-w-none">
                          {user.username} {/* Tampilkan username di sini */}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {user.name}{" "}
                          {/* Bisa ditampilkan di bawah username sebagai info tambahan */}
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day, index) => {
                      const dayNum = parseInt(format(day, "d"));
                      const isScheduled = user.schedule.includes(dayNum);
                      const isHovered =
                        hoveredCell?.user === user.name &&
                        hoveredCell?.day === index;

                      return (
                        <td
                          key={index}
                          className="p-1 lg:p-2 text-center relative group"
                          onMouseEnter={() =>
                            setHoveredCell({ user: user.name, day: index })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          onClick={() =>
                            isScheduled &&
                            setSelectedSchedule({
                              user: user.name,
                              date: format(day, "EEE, MMM d"),
                            })
                          }
                        >
                          <div
                            className={`w-6 h-6 lg:w-8 lg:h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer
              ${
                isScheduled
                  ? `${user.color} text-white shadow-md transform hover:scale-110`
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }
              ${isHovered ? "ring-2 ring-offset-2 ring-gray-300" : ""}
            `}
                          >
                            {isScheduled && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>

                          {isHovered && isScheduled && (
                            <div className="hidden sm:block absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white shadow-lg rounded-md border border-gray-200 text-xs font-medium whitespace-nowrap">
                              {user.name} - {format(day, "EEE, MMM d")}
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-t border-l border-gray-200 rotate-45"></div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Schedule Indicator */}
          <div className="sm:hidden mt-4 text-xs text-gray-500 text-center">
            Tap on colored circles to view details
          </div>
        </div>

        <AdminChat />
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedSchedule && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 lg:p-6 rounded-xl shadow-2xl border border-gray-200 w-11/12 sm:w-96 max-h-[90vh] overflow-y-auto z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex justify-between items-start mb-3 lg:mb-4">
              <h3 className="text-lg lg:text-xl font-bold text-gray-800">
                Appointment Details
              </h3>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 lg:p-3 rounded-full mr-3 lg:mr-4">
                  <FiUser className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500">Client</p>
                  <p className="font-medium text-gray-800 text-sm lg:text-base">
                    {selectedSchedule.user}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-purple-100 p-2 lg:p-3 rounded-full mr-3 lg:mr-4">
                  <FiCalendar className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Date & Time
                  </p>
                  <p className="font-medium text-gray-800 text-sm lg:text-base">
                    {selectedSchedule.date} at 2:00 PM
                  </p>
                </div>
              </div>

              <div className="pt-3 lg:pt-4 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition shadow-md text-sm lg:text-base">
                  View Full Details
                </button>
                <button className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition text-sm lg:text-base">
                  Reschedule
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedSchedule && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSelectedSchedule(null)}
        />
      )}
    </div>
  );
};

export default AdminAgenda;

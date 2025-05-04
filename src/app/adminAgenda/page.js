"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX, FiCalendar, FiUser } from "react-icons/fi";
import { format, addWeeks, subWeeks } from "date-fns";
import WelcomeAdmin from "../../adminComponents/WelcomeAdmin";
import Sidebar from "../../adminComponents/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import AdminChat from "../../adminComponents/adminChat";

const AdminAgenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i))
  );

  const users = [
    { name: "Alex Johnson", schedule: [2, 4], avatar: "AJ", color: "bg-purple-500" },
    { name: "Maria Garcia", schedule: [1, 3, 5], avatar: "MG", color: "bg-blue-500" },
    { name: "James Wilson", schedule: [0, 2, 4, 6], avatar: "JW", color: "bg-green-500" },
    { name: "Sarah Lee", schedule: [1, 3, 5], avatar: "SL", color: "bg-pink-500" },
    { name: "David Kim", schedule: [0, 2, 4, 6], avatar: "DK", color: "bg-yellow-500" },
    { name: "Emma Davis", schedule: [1, 3, 5], avatar: "ED", color: "bg-indigo-500" },
    { name: "Michael Brown", schedule: [0, 2, 4, 6], avatar: "MB", color: "bg-red-500" },
    { name: "Olivia Martinez", schedule: [1, 3, 5], avatar: "OM", color: "bg-teal-500" },
    { name: "Daniel Taylor", schedule: [0, 2, 4, 6], avatar: "DT", color: "bg-orange-500" },
    { name: "Sophia Anderson", schedule: [1, 3, 5], avatar: "SA", color: "bg-cyan-500" },
  ];

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  return (
    <div className="min-h-screen ml-30 p-6">
      <Sidebar />
      <div className="mb-6 flex">
        <span className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-4 py-2 text-sm font-bold transform -skew-x-12 shadow-md">
          ☰ Admin Dashboard
        </span>
        <span className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-2 shadow-md">
          Agenda Manager
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Welcome Admin */}
        <div className="w-full lg:w-1/2">
          <WelcomeAdmin />
          <div className="flex gap-4 mt-4 w-full">
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-4 rounded-xl shadow-lg border border-gray-800 w-full h-40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-sm font-light">Total Appointments</p>
                <p className="text-white text-3xl font-bold mt-2">128</p>
                <p className="text-green-400 text-xs mt-1">↑ 12% from last week</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-full h-40 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-700 text-sm font-light">Upcoming Today</p>
                <p className="text-black text-3xl font-bold mt-2">9</p>
                <p className="text-blue-500 text-xs mt-1">3 high priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Agenda */}
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-xl border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Weekly Agenda</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevWeek}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm"
              >
                <FiChevronLeft className="text-gray-700" />
              </button>
              <h3 className="text-lg font-semibold text-gray-700 px-4 py-1 bg-gray-100 rounded-md">
                {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
              </h3>
              <button
                onClick={nextWeek}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition duration-200 shadow-sm"
              >
                <FiChevronRight className="text-gray-700" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Team Member</th>
                  {weekDays.map((day, index) => (
                    <th key={index} className="p-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-medium ${index === 0 ? "text-red-300" : "text-gray-300"}`}>
                          {format(day, "EEE")}
                        </span>
                        <span className={`text-lg font-bold ${index === 0 ? "text-white" : "text-white"}`}>
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
                    key={i} 
                    className="border-b border-gray-100 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <td className="p-3 font-medium text-gray-700 flex items-center">
                      <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white font-bold mr-3`}>
                        {user.avatar}
                      </div>
                      {user.name}
                    </td>
                    {weekDays.map((day, index) => {
                      const dayNum = parseInt(format(day, "d"));
                      const isScheduled = user.schedule.includes(dayNum);
                      const isHovered = hoveredCell?.user === user.name && hoveredCell?.day === index;
                      
                      return (
                        <td
                          key={index}
                          className={`p-3 text-center relative group`}
                          onMouseEnter={() => setHoveredCell({ user: user.name, day: index })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all duration-200 
                            ${isScheduled ? 
                              `${user.color} text-white shadow-md transform hover:scale-110` : 
                              "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }
                            ${isHovered ? "ring-2 ring-offset-2 ring-gray-300" : ""}
                          `}>
                            {isScheduled && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-white rounded-full"
                              />
                            )}
                          </div>
                          
                          {isHovered && isScheduled && (
                            <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-white shadow-lg rounded-md border border-gray-200 text-xs font-medium whitespace-nowrap">
                              {user.name} - {format(day, "EEE, MMM d")}
                              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45"></div>
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

          <AnimatePresence>
            {selectedSchedule && (
              <motion.div 
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-96 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                  <button
                    onClick={() => setSelectedSchedule(null)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FiUser className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium text-gray-800">{selectedSchedule.user}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <FiCalendar className="text-purple-600" size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium text-gray-800">{selectedSchedule.date} at 2:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition shadow-md">
                      View Full Details
                    </button>
                    <button className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
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
        <AdminChat />
      </div>
    </div>
  );
};

export default AdminAgenda;
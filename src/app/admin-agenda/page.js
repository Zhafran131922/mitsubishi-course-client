"use client";

import React, { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCalendar,
  FiUser,
  FiBook,
  FiBookmark,
  FiLayers,
} from "react-icons/fi";
import { format, addWeeks, subWeeks } from "date-fns";
import WelcomeAdmin from "../../adminComponents/WelcomeAdmin";
import Sidebar from "../../adminComponents/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import AdminChat from "../../adminComponents/adminChat";
import { getAllUsers } from "../../../lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fetchDashboardData } from "../../../lib/api";
import Calendar from "@/adminComponents/Calendar";
import { useRouter } from "next/navigation";

const AdminAgenda = () => {
  const [users, setUsers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [showMobileWeekNav, setShowMobileWeekNav] = useState(false);
  const [stats, setStats] = useState({
    userCount: 0,
    topicCount: 0,
    programCount: 0,
    materialCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Calculate week days
  const getWeekDays = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday of current week
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const toggleMobileWeekNav = () => {
    setShowMobileWeekNav(!showMobileWeekNav);
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  useEffect(() => {
    async function fetchUsers() {
      const usersFromApi = await getAllUsers();
      console.log(usersFromApi);
      setUsers(usersFromApi);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen lg:ml-30 p-4 lg:p-6 bg-transparent">
        <Sidebar />

        {/* Mobile Sidebar Offset */}
        <div className="max-w-4xl w-full text-center mt-2 lg:mt-0"></div>
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Pages
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Admin Agenda
          </span>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
          {/* Left Side - Welcome Admin */}
          <div className="w-full xl:w-1/2 space-y-4 lg:space-y-6">
            <WelcomeAdmin />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <motion.div
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 h-32 lg:h-40 flex flex-col cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
                onClick={() => navigateTo("/management-users/admin")}
                whileHover={{ y: -5 }}
              >
                {/* Gradient overlay (hidden by default) */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-[#A70000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                <div className="flex items-center mb-2 z-10">
                  <div className="p-2 rounded-lg bg-red-50 mr-3 group-hover:bg-white/20 transition-colors">
                    <FiUser
                      className="text-[#A70000] group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium group-hover:text-white transition-colors">
                    Total Users
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center z-10">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-white transition-colors">
                    {stats.userCount}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 group-hover:text-white/80 transition-colors">
                    Registered users
                  </p>
                </div>
              </motion.div>

              {/* Topics Card */}
              <motion.div
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 h-32 lg:h-40 flex flex-col cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
                onClick={() => navigateTo("/admin-material")}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-[#A70000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                <div className="flex items-center mb-2 z-10">
                  <div className="p-2 rounded-lg bg-red-50 mr-3 group-hover:bg-white/20 transition-colors">
                    <FiBookmark
                      className="text-[#A70000] group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium group-hover:text-white transition-colors">
                    Total Topics
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center z-10">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-white transition-colors">
                    {stats.topicCount}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 group-hover:text-white/80 transition-colors">
                    Available topics
                  </p>
                </div>
              </motion.div>

              {/* Programs Card */}
              <motion.div
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 h-32 lg:h-40 flex flex-col cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
                onClick={() => navigateTo("/admin-program/admin")}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-[#A70000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                <div className="flex items-center mb-2 z-10">
                  <div className="p-2 rounded-lg bg-red-50 mr-3 group-hover:bg-white/20 transition-colors">
                    <FiBook
                      className="text-[#A70000] group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium group-hover:text-white transition-colors">
                    Total Programs
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center z-10">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-white transition-colors">
                    {stats.programCount}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 group-hover:text-white/80 transition-colors">
                    Learning programs
                  </p>
                </div>
              </motion.div>

              {/* Materials Card */}
              <motion.div
                className="bg-white p-4 rounded-xl shadow-md border border-gray-100 h-32 lg:h-40 flex flex-col cursor-pointer hover:shadow-lg transition-all relative overflow-hidden group"
                onClick={() => navigateTo("/admin-material")}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-[#A70000] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

                <div className="flex items-center mb-2 z-10">
                  <div className="p-2 rounded-lg bg-red-50 mr-3 group-hover:bg-white/20 transition-colors">
                    <FiLayers
                      className="text-[#A70000] group-hover:text-white transition-colors"
                      size={20}
                    />
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium group-hover:text-white transition-colors">
                    Total Materials
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center z-10">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800 group-hover:text-white transition-colors">
                    {stats.materialCount}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 group-hover:text-white/80 transition-colors">
                    Learning materials
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <Calendar
            weekDays={weekDays}
            users={users}
            prevWeek={prevWeek}
            nextWeek={nextWeek}
            toggleMobileWeekNav={toggleMobileWeekNav}
            showMobileWeekNav={showMobileWeekNav}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
            selectedSchedule={selectedSchedule}
            setSelectedSchedule={setSelectedSchedule}
          />
        </div>

        {/* Appointment Details Modal */}
        <AnimatePresence>
          {selectedSchedule && (
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-11/12 sm:w-96 max-h-[90vh] overflow-y-auto z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Appointment Details
                </h3>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-full mr-4">
                    <FiUser className="text-[#A70000]" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium text-gray-800">
                      {selectedSchedule.user}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-red-50 p-3 rounded-full mr-4">
                    <FiCalendar className="text-[#A70000]" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-800">
                      {selectedSchedule.date} at 2:00 PM
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray--material/adm200">
                  <button className="w-full bg-[#A70000] text-white py-2 rounded-lg font-medium hover:bg-[#900000] transition shadow-md">
                    View Full Details
                  </button>
                  <button className="w-full mt-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                    Reschedule
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedSchedule && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 backdrop-blur-sm"
            onClick={() => setSelectedSchedule(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};
export default AdminAgenda;

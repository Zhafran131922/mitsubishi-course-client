"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Calendar() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoveredDate, setHoveredDate] = useState(null);

  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const trainingSchedule = {
    "2025-03-05": "React Native Training",
    "2025-03-10": "Node.js Workshop",
    "2025-03-20": "DevOps Essentials",
    "2025-03-25": "Cybersecurity Fundamentals",
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const handleDateClick = (date) => {
    router.push(`/courses/${date}`);
  };

  return (
    <div className="w-full max-w-[1500px] 2xl:w-[870px] 3xl:max-w-[1500px] max-h-full mx-auto p-6 bg-white rounded-lg shadow-lg transition-all duration-300 sm:h-150 md:w-150 lg:w-200 2xl:ml-64 center">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-bold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold">
        {dayNames.map((day) => (
          <div key={day} className="text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateString = `${currentYear}-${String(
            currentMonth + 1
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const event = trainingSchedule[dateString];
          const isToday = dateString === todayString;
          const isHovered = hoveredDate === dateString;

          return (
            <div
              key={day}
              className={`h-25 sm:h-16 flex items-center justify-center rounded-md cursor-pointer relative 
                ${
                  isToday
                    ? "bg-blue-500 text-white"
                    : event
                    ? "bg-[#A70000] text-white"
                    : "bg-gray-100"
                } 
                hover:bg-gray-300`}
              onClick={() => handleDateClick(dateString)}
              onMouseEnter={() => setHoveredDate(dateString)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {isHovered && event ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 flex items-center justify-center px-1 text-xs font-medium text-center text-black"
                >
                  {event}
                </motion.div>
              ) : (
                <span>{day}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

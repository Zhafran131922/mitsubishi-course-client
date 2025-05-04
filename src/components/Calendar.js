"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventSidebar, setShowEventSidebar] = useState(true);

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const toggleEventSidebar = () => {
    setShowEventSidebar(!showEventSidebar);
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[500px] w-full bg-white shadow-md rounded-md">
      {/* Calendar Side */}
      <div className="flex-1 flex flex-col p-4 lg:p-6">
        <div className="w-full bg-white rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 lg:mb-6 text-gray-700">
            <h3 className="text-xl lg:text-2xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1 lg:p-2 rounded hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 lg:p-2 rounded hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={toggleEventSidebar}
                className="lg:hidden p-1 rounded hover:bg-gray-100"
              >
                {showEventSidebar ? "Hide Events" : "Show Events"}
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-sm lg:text-base text-gray-600 font-medium mb-2 lg:mb-4">
            {daysOfWeek.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 lg:gap-2 text-center">
            {days.map((day, index) => (
              <div
                key={index}
                className={`h-8 w-8 lg:h-10 lg:w-10 flex items-center justify-center rounded-full text-sm lg:text-base ${
                  day === currentDate.getDate()
                    ? "bg-blue-600 text-white"
                    : day
                    ? "hover:bg-gray-100 text-gray-700"
                    : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 mt-4 lg:mt-8">
            <button className="flex-1 bg-gray-100 text-gray-700 py-1 lg:py-2 rounded-md font-medium lg:font-semibold hover:bg-gray-200 text-sm lg:text-base">
              See Planned Events
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-1 lg:py-2 rounded-md font-medium lg:font-semibold hover:bg-gray-200 text-sm lg:text-base">
              Set Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Event List Side - Conditionally rendered based on screen size */}
      {showEventSidebar && (
        <div className="w-full lg:w-[300px] bg-[#0c0c1d] text-white p-4 lg:p-6 flex flex-col justify-between rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base lg:text-lg font-semibold">EVENTS</h4>
              <button
                onClick={toggleEventSidebar}
                className="lg:hidden text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            {/* Event Items */}
            <div className="space-y-3 lg:space-y-4">
              <div className="border-b border-white/20 pb-1 lg:pb-2 text-sm lg:text-base">
                Hiking with Hank
              </div>
              <div className="border-b border-white/20 pb-1 lg:pb-2 text-sm lg:text-base">
                UI/UX Meeting
              </div>
              <div className="border-b border-white/20 pb-1 lg:pb-2 text-sm lg:text-base">
                Brother Bday
              </div>
            </div>
          </div>

          {/* Bottom Edit Button */}
          <div className="flex justify-between items-center mt-4 lg:mt-0">
            <button className="border border-white/30 px-3 lg:px-4 py-1 rounded hover:bg-white/20 text-sm lg:text-base">
              Edit
            </button>
            <button className="text-white/50 hover:text-white">⚙️</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
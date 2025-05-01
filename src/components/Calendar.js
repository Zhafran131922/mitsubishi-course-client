"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="flex h-[500px] w-full bg-white shadow-md rounded-md">
      {/* Calendar Side */}
      <div className="flex-1 flex flex-col p-">
        <div className="w-full bg-white p-6 rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 text-gray-700">
            <h3 className="text-2xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {year}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-gray-600 font-medium mb-4">
            {daysOfWeek.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center">
            {days.map((day, index) => (
              <div
                key={index}
                className={`h-10 w-10 flex items-center justify-center rounded-full ${
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
          <div className="flex gap-4 mt-8">
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-200">
              See Planned Events
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-200">
              Set Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Event List Side */}
      <div className="w-[300px] bg-[#0c0c1d] text-white p-6 flex flex-col justify-between rounded-r-lg">
        <div>
          <h4 className="text-lg font-semibold mb-4">EVENTS</h4>
          {/* Event Items */}
          <div className="space-y-4">
            <div className="border-b border-white/20 pb-2">
              Hiking with Hank
            </div>
            <div className="border-b border-white/20 pb-2">UI/UX Meeting</div>
            <div className="border-b border-white/20 pb-2">Brother Bday</div>
          </div>
        </div>
        
        {/* Bottom Edit Button */}
        <div className="flex justify-between items-center">
          <button className="border border-white/30 px-4 py-1 rounded hover:bg-white/20">
            Edit
          </button>
          <button className="text-white/50 hover:text-white">⚙️</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
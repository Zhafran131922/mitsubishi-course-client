"use client";

import React, { useState } from "react";
import Sidebar from "@/adminComponents/Sidebar"
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const users = [
  { name: "user1012", schedule: [11, 13, 14] },
  { name: "user2023", schedule: [12, 15] },
  { name: "user3034", schedule: [11, 14, 16] },
];

const CalendarTimeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));

  const prevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));

  return (
    <div className="p-4 ml-64 bg-gray-100 min-h-screen flex justify-center items-center">
        <Sidebar/>
      <div className="bg-white p-4 rounded-xl shadow-md w-[700px] relative">
        <h2 className="text-lg font-bold mb-2">Agenda</h2>
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevWeek} className="p-2"><FiChevronLeft /></button>
          <h3 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h3>
          <button onClick={nextWeek} className="p-2"><FiChevronRight /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center"></th>
                {weekDays.map((day, index) => (
                  <th key={index} className="p-2 text-center">
                    <span className={index === 0 ? "text-red-500 font-bold" : ""}>
                      {format(day, "E")}<br />
                      {format(day, "dd")}
                    </span>
                  </th>
                ))}
                <th className="p-2 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border-r font-bold">{user.name}</td>
                  <td className="p-2"></td>
                  {weekDays.map((day, index) => {
                    const dayNum = parseInt(format(day, "d"));
                    const isScheduled = user.schedule.includes(dayNum);
                    return (
                      <td
                        key={index}
                        className={`p-2 border text-center cursor-pointer ${
                          isScheduled ? "bg-green-500 hover:bg-green-700" : ""
                        }`}
                        onClick={() => isScheduled && setSelectedSchedule({ user: user.name, date: format(day, "PPP") })}
                      ></td>
                    );
                  })}
                  <td className="p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedSchedule && (
          <div className="absolute top-10 right-10 bg-white p-4 border shadow-lg rounded-md">
            <p className="font-bold">Schedule Info</p>
            <p>User: {selectedSchedule.user}</p>
            <p>Date: {selectedSchedule.date}</p>
            <button className="mt-2 px-4 py-1 bg-red-500 text-white rounded" onClick={() => setSelectedSchedule(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarTimeline;

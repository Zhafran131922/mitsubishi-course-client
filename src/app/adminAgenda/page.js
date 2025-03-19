"use client";

import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { format } from "date-fns";
import WelcomeAdmin from "../../adminComponents/WelcomeAdmin";
import Sidebar from "../../adminComponents/Sidebar";

const AdminAgenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const weekDays = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + i)
      )
  );

  const users = [
    { name: "User A", schedule: [2, 4] },
    { name: "User B", schedule: [1, 3, 5] },
    { name: "User C", schedule: [0, 2, 4, 6] },
    { name: "User D", schedule: [1, 3, 5, 7] },
    { name: "User E", schedule: [0, 2, 4, 6, 8] },
    { name: "User F", schedule: [1, 3, 5, 7, 9] },
    { name: "User G", schedule: [0, 2, 4, 6, 8, 10] },
    { name: "User H", schedule: [1, 3, 5, 7, 9, 11] },
    { name: "User I", schedule: [0, 2, 4, 6, 8, 10, 12] },
    { name: "User J", schedule: [1, 3, 5, 7, 9, 11, 13] },
    { name: "User K", schedule: [0, 2, 4, 6, 8, 10, 12, 14] },
    { name: "User L", schedule: [1, 3, 5, 7, 9, 11, 13, 15] },
    { name: "User M", schedule: [0, 2, 4, 6, 8, 10, 12, 14, 16] },
    { name: "User N", schedule: [1, 3, 5, 7, 9, 11, 13, 15, 17] },
    { name: "User O", schedule: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18] },
    { name: "User P", schedule: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19] },
    { name: "User Q", schedule: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20] },
    { name: "User R", schedule: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21] },
    { name: "User S", schedule: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22] },
    
  ];

  const prevWeek = () => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() - 7)));
  };

  const nextWeek = () => {
    setCurrentDate((prev) => new Date(prev.setDate(prev.getDate() + 7)));
  };

  return (
    <div className="p-4 ml-64 min-h-screen flex flex-col">
      <Sidebar />
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex mb-4">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Page
          </span>
          <span className="bg-red-700 text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Agenda
          </span>
        </div>

        <div className="flex justify-end gap-6 mt-30 h-full">
          <div className="flex-1 w-[800px] h-full">
            <WelcomeAdmin />

            {/* Wrapper untuk dua box */}
            <div className="flex gap-4 mt-4 w-full">
              <div className="bg-black p-4 rounded-xl shadow-md border border-dark-300 w-98 h-70">
                {/* <h3 className="font-bold text-black">Box 1</h3>
                <p className="text-gray-600">Isi dari box pertama.</p> */}
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300 w-98">
                {/* <h3 className="font-bold text-black">Box 2</h3>
                <p className="text-gray-600">Isi dari box kedua.</p> */}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg w-[800px] border border-gray-300 flex flex-col h-full">
            <h2 className="text-xl font-bold text-black mb-4 text-center">
              Agenda
            </h2>
            <div className="flex justify-between items-center mb-4 bg-black text-white p-2 rounded-md">
              <button
                onClick={prevWeek}
                className="p-2 hover:bg-red-600 rounded-md transition"
              >
                <FiChevronLeft />
              </button>
              <h3 className="text-lg font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </h3>
              <button
                onClick={nextWeek}
                className="p-2 hover:bg-red-600 rounded-md transition"
              >
                <FiChevronRight />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-black">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3"></th>
                    {weekDays.map((day, index) => (
                      <th key={index} className="p-3 text-center">
                        <span
                          className={
                            index === 0 ? "text-red-500 font-bold" : ""
                          }
                        >
                          {format(day, "E")}
                          <br />
                          {format(day, "dd")}
                        </span>
                      </th>
                    ))}
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3 border-r font-bold text-black">
                        {user.name}
                      </td>
                      <td className="p-3"></td>
                      {weekDays.map((day, index) => {
                        const dayNum = parseInt(format(day, "d"));
                        const isScheduled = user.schedule.includes(dayNum);
                        return (
                          <td
                            key={index}
                            className={`p-3 border text-center cursor-pointer rounded-md transition duration-300 
                            ${
                              isScheduled
                                ? "bg-red-500 hover:bg-red-700 text-white"
                                : "hover:bg-gray-200"
                            }`}
                            onClick={() =>
                              isScheduled &&
                              setSelectedSchedule({
                                user: user.name,
                                date: format(day, "PPP"),
                              })
                            }
                          ></td>
                        );
                      })}
                      <td className="p-3"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedSchedule && (
              <div className="absolute top-10 right-10 bg-white p-4 border shadow-lg rounded-md w-64 animate-fade-in">
                <p className="font-bold text-black">Schedule Info</p>
                <p className="text-black">User: {selectedSchedule.user}</p>
                <p className="text-black">Date: {selectedSchedule.date}</p>
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                  onClick={() => setSelectedSchedule(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgenda;

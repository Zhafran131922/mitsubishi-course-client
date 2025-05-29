"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import TrainCards from "@/components/TrainCards";
import Footer from "@/components/Footer";
import UserChat from "@/components/userChat";
import Header from "@/components/Header";

export default function TrainingSection() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUsername(parsedUser.username);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar - Fixed on desktop, hidden on mobile (you might want to add mobile menu toggle) */}
      <div className="fixed lg:relative z-50">
        <Sidebar onExpand={setSidebarExpanded} />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "lg:ml-64" : "lg:ml-20"} pt-16 lg:pt-0`}>
        {/* Header - Fixed at top on mobile */}
        <div className="fixed top-0 left-0 right-0 lg:right-6 lg:left-auto bg-white shadow-sm lg:shadow-none z-40 p-4 lg:top-4 lg:p-0">
          <Header />
        </div>
        
        {/* Welcome Banner */}
        <div className="w-full py-6 px-4 lg:py-8 lg:px-6 flex justify-center">
          <div className="max-w-[1500px] w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang, {username || "User"}!
            </h1>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="p-4 lg:p-6 flex justify-center">
          <div className="max-w-[1500px] w-full flex flex-col xl:flex-row gap-6">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Top Boxes Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6`}>
                {[1, 2, 3, 4].map((box) => (
                  <div 
                    key={box}
                    className="bg-white rounded-xl shadow-lg p-4 lg:p-6 h-[150px] lg:h-[180px] flex flex-col items-center justify-center text-center hover:scale-[1.02] lg:hover:scale-105 transition"
                  >
                    <h2 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2 text-black">Box {box}</h2>
                    <p className="text-sm lg:text-base text-gray-600">Description of Box {box}.</p>
                  </div>
                ))}
              </div>

              {/* Calendar Section */}
              <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Left Boxes */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-6">
                  {[5, 6].map((box) => (
                    <div 
                      key={box}
                      className="bg-white rounded-xl shadow-lg p-4 lg:p-6 flex-1 flex flex-col items-center justify-center text-center hover:scale-[1.02] lg:hover:scale-105 transition"
                    >
                      <h2 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2 text-black">Box {box}</h2>
                      <p className="text-sm lg:text-base text-gray-600">Description of Box {box}.</p>
                    </div>
                  ))}
                </div>

                {/* Calendar */}
                <div className="w-full lg:w-2/3">
                  <Calendar />
                </div>
              </div>
            </div>

            {/* Right Column - Stacks below on mobile */}
            <div className="w-full xl:w-80 flex flex-col gap-4 lg:gap-6">
              {/* Formation Status */}
              <div className="bg-black text-white rounded-2xl p-4 lg:p-5 flex flex-col justify-between min-h-[200px] lg:min-h-[240px]">
                <div>
                  <div className="text-base lg:text-lg font-bold">Formation status</div>
                  <div className="text-xs lg:text-sm text-gray-300">In progress</div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                    <div className="bg-blue-400 h-full w-2/3"></div>
                  </div>
                  <div className="text-xs lg:text-sm text-gray-300 mt-2">
                    Estimated processing <br /> 4-5 business days
                  </div>
                </div>
                <button className="w-full bg-white text-black py-2 rounded-xl font-semibold mt-3 lg:mt-4 text-sm lg:text-base">
                  View status
                </button>
              </div>

              {/* To-Do List */}
              <div className="bg-white rounded-2xl p-4 lg:p-5 shadow-md">
                <h2 className="text-base lg:text-lg font-bold text-black mb-3 lg:mb-4">Your to-Do list</h2>
                <div className="space-y-3 lg:space-y-4">
                  {[
                    { title: "Run payroll", time: "Mar 4 at 6:00 pm", icon: "calendar" },
                    { title: "Review time off request", time: "Mar 7 at 6:00 pm", icon: "clock" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-black p-1.5 lg:p-2 rounded-full">
                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            item.icon === "calendar" ? 
                            "M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14" : 
                            "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          } />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-sm lg:text-base text-black">{item.title}</div>
                        <div className="text-xs lg:text-sm text-gray-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Board Meeting */}
              <div className="bg-black text-white rounded-2xl p-4 lg:p-5 shadow-md">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <div className="text-xs lg:text-sm">Board meeting</div>
                </div>
                <div className="text-xs lg:text-sm text-gray-400">Feb 22 at 6:00 PM</div>
                <p className="text-xs mt-2 text-gray-400">
                  You have been invited to attend a meeting of the Board Directors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mt-6 lg:mt-8 px-4 lg:px-0 flex justify-center">
          <div className="max-w-[1500px] w-full">
            <h1 className="text-xl lg:text-2xl font-bold text-black text-center mb-4 lg:mb-6">
              Courses Available
            </h1>
            <TrainCards />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 lg:mt-12">
          <Footer />
        </div>

        {/* Chat */}
        <UserChat />
      </div>
    </div>
  );
}
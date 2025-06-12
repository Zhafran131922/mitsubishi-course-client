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
  const [programCount, setProgramCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);

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
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarExpanded ? "lg:ml-64" : "lg:ml-25"
        } pt-16 lg:pt-0`}
      >
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
              {/* Calendar Section */}
              <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Calendar */}
                <div className="w-full">
                  <Calendar />
                </div>
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
        {/* <UserChat /> */}
      </div>
    </div>
  );
}
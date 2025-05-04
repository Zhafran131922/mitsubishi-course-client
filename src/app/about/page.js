"use client";
import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

const AboutUs = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar onExpand={setSidebarExpanded} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarExpanded ? "lg:ml-64" : "lg:ml-20"} w-full`}>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-12">
          {/* About Section */}
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-4xl font-bold">About</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex justify-center items-center mt-6 space-x-2">
              <Image 
                src="/assets/user.png" 
                alt="User1" 
                width={40} 
                height={40} 
                className="rounded-full"
                priority
              />
              <Image 
                src="/assets/user.png" 
                alt="User2" 
                width={40} 
                height={40} 
                className="rounded-full"
                priority
              />
            </div>
            <p className="mt-2 text-gray-700">FE Developer and BE Developer</p>
          </div>

          {/* Our Values Section */}
          <div className={`grid grid-cols-1 ${sidebarExpanded ? "lg:grid-cols-2" : "md:grid-cols-2"} gap-8 max-w-4xl w-full mt-12 items-center`}>
            <div className="w-full max-w-[560px] mx-auto md:mx-0">
              <Image 
                src="/assets/car3.jpg" 
                alt="Values" 
                width={560} 
                height={350} 
                className="rounded-lg object-cover shadow-lg"
                priority
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-sm font-bold text-gray-500">Our Values</h3>
              <h2 className="text-2xl font-semibold mt-2">Lorem Ipsum dolor sit amet</h2>
              <p className="text-gray-600 mt-4 text-sm sm:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl w-full text-center md:text-left mt-16">
            <h3 className="text-sm font-bold text-gray-500">Our Supports</h3>
            <h2 className="text-2xl font-semibold mt-2">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className={`grid grid-cols-1 ${sidebarExpanded ? "lg:grid-cols-2" : "md:grid-cols-2"} gap-8 max-w-4xl w-full mt-8`}>
            <div className="space-y-6">
              {[1, 2, 3].map((item, index) => (
                <div 
                  key={index} 
                  className="border-l-4 border-[#A70000] pl-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <span className="bg-[#A70000] text-white px-2 py-1 text-xs rounded">{index + 1}</span>
                  <h3 className="text-lg font-semibold mt-2">Lorem Ipsum dolor sit amet</h3>
                  <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full max-w-[400px] mx-auto md:mx-0">
              <Image 
                src="/assets/login.jpg" 
                alt="FAQ" 
                width={400} 
                height={300} 
                className="rounded-lg object-cover shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
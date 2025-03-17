import React from "react";
import Sidebar from "@/components/Sidebar";

const AboutUs = () => {
  return (
    <div className="flex mt-20 sm:mt-20 md:mt-20 lg:mt-20 xl:mt-20 2xl:mt-0">
      <Sidebar className="w-64" />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 px-8 py-12 flex-1  2xl:ml-64">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold">About</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="flex justify-center items-center mt-6 space-x-2">
          <img src="/assets/user.png" alt="User1" className="w-10 h-10 rounded-full" />
          <img src="/assets/user.png" alt="User2" className="w-10 h-10 rounded-full" />
        </div>
        <p className="mt-2 text-gray-700">User and User</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mt-12 items-center">
        <div className="w-full max-w-[560px] mx-auto md:mx-0">
          <img src="/assets/car3.jpg" alt="Values" className="w-full h-auto object-cover rounded-lg" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold text-gray-500">Our Values</h3>
          <h2 className="text-2xl font-semibold">Lorem Ipsum dolor sit amet</h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <div className="max-w-4xl w-full text-center md:text-left mt-12">
        <h3 className="text-sm font-bold text-gray-500">Our Supports</h3>
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <p className="text-gray-600 mt-2 max-w-2xl text-sm sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mt-8">
        <div className="space-y-6">
          {[1, 2, 3].map((item, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
              <span className="bg-red-500 text-white px-2 py-1 text-xs rounded">{index + 1}</span>
              <h3 className="text-lg font-semibold mt-2">Lorem Ipsum dolor sit amet</h3>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>

        <div className="w-full max-w-[400px] mx-auto md:mx-0">
          <img src="/assets/login.jpg" alt="FAQ" className="w-full h-auto object-cover rounded-lg" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default AboutUs;

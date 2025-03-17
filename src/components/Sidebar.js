"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaFilm, FaClipboardList, FaHeadset, FaInfoCircle } from "react-icons/fa";
import Profile from "../components/Profile";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar untuk layar besar */}
      <div className="hidden 2xl:flex flex-col w-64 h-screen bg-black text-white fixed left-0 top-0 py-6 items-center">
        {/* Logo */}
        <div className="mt-4">
          <img src="/assets/logo.png" alt="Next Icon" className="w-10 h-10" />
        </div>
        <div className="mt-2">
          <img src="/assets/textLogo.png" alt="Mitsubishi Logo" className="w-24" />
        </div>

        {/* User Profile */}
        <Profile />

        {/* Menu Items */}
        <nav className="w-full mt-6">
          <a
            href="/trainingSection"
            className={`flex items-center px-6 py-3 font-semibold ${
              pathname.includes("/trainingSection") || pathname.includes("/courses") ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
            }`}
          >
            <FaFilm className="mr-3" />
            Training Section
          </a>
          <a
            href="/programOverview"
            className={`flex items-center px-6 py-3 ${
              pathname === "/programOverview" ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
            }`}
          >
            <FaClipboardList className="mr-3" />
            Program Overview
          </a>
          <a
            href="/corporateService"
            className={`flex items-center px-6 py-3 ${
              pathname === "/corporateService" ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
            }`}
          >
            <FaHeadset className="mr-3" />
            Corporate Service
          </a>
          <a
            href="/about"
            className={`flex items-center px-6 py-3 ${
              pathname === "/about" ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
            }`}
          >
            <FaInfoCircle className="mr-3" />
            About Us
          </a>
        </nav>

        <div className="absolute bottom-6 text-center text-xs">
          <p>MITSUBISHI TRAINING CENTER</p>
          <span>© All Rights Reserved</span>
          <p>Made With ❤️ By Wahyudi</p>
        </div>
      </div>

      {/* Navbar untuk layar kecil */}
      <div className="2xl:hidden flex items-center justify-between bg-black text-white p-4 fixed w-full top-0 left-0 z-50">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <img src="/assets/logo.png" alt="Mitsubishi Logo" className="w-10 h-10" />
        </button>
      </div>

      {/* Sidebar Mobile (Sliding Menu) */}
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-64 h-screen bg-black text-white shadow-lg flex flex-col items-center py-6 z-50"
        >
          {/* Tombol Close */}
          <button onClick={toggleSidebar} className="absolute top-4 right-4 text-white text-2xl">
            <FaTimes />
          </button>

          {/* Logo */}
          <div className="mt-4">
            <img src="/assets/logo.png" alt="Next Icon" className="w-10 h-10" />
          </div>
          <div className="mt-2">
            <img src="/assets/textLogo.png" alt="Mitsubishi Logo" className="w-24" />
          </div>

          {/* User Profile */}
          <Profile />

          {/* Menu Items */}
          <nav className="w-full mt-6">
            <a
              href="/trainingSection"
              className={`flex items-center px-6 py-3 font-semibold ${
                pathname.includes("/trainingSection") || pathname.includes("/courses") ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
              }`}
            >
              <FaFilm className="mr-3" />
              Training Section
            </a>
            <a
              href="/programOverview"
              className={`flex items-center px-6 py-3 ${
                pathname === "/programOverview" ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
              }`}
            >
              <FaClipboardList className="mr-3" />
              Program Overview
            </a>
            <a
              href="/corporateService"
              className={`flex items-center px-6 py-3 ${
                pathname === "/corporateService" ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
              }`}
            >
              <FaHeadset className="mr-3" />
              Corporate Service
            </a>
            <a
              href="/about"
              className={`flex items-center px-6 py-3 ${
                pathname === "/about" ? "bg-[#A70000] text-white" : "text-white hover:bg-red-700"
              }`}
            >
              <FaInfoCircle className="mr-3" />
              About Us
            </a>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 text-center text-xs">
            <p>MITSUBISHI TRAINING CENTER</p>
            <span>© All Rights Reserved</span>
            <p>Made With ❤️ By Wahyudi</p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Sidebar;

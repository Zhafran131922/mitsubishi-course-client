"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaFilm, FaClipboardList, FaHeadset, FaInfoCircle } from "react-icons/fa";
import Profile from "../adminComponents/Profile";

const Sidebar = () => {
  const pathname = usePathname(); 

  return (
    <div className="w-64 h-screen bg-black text-white fixed left-0 top-0 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mt-4">
        <Image src="/assets/logo.png" alt="Next Icon" width={40} height={40} />
      </div>
      <div className="mt-2">
        <Image src="/assets/textLogo.png" alt="Mitsubishi Logo" width={96} height={40} />
      </div>

      <Profile /> 
      {/* Menu Items */}
      <nav className="w-full mt-6">
        <a
          href="/adminAgenda"
          className={`flex items-center px-6 py-3 ${
            pathname === "/adminAgenda" ? "bg-[#A70000] text-white" : "text-white hover:bg-[#A70000]"
          }`}
        >
          <FaClipboardList className="mr-3" />
          Agenda
        </a>
        <a
          href="/adminProgram"
          className={`flex items-center px-6 py-3 ${
            pathname === "/adminProgram" ? "bg-[#A70000] text-white" : "text-white hover:bg-[#A70000]"
          }`}
        >
          <FaFilm className="mr-3" />
          Program
        </a>
        <a
          href="/adminMaterial"
          className={`flex items-center px-6 py-3 ${
            pathname === "/adminMaterial" ? "bg-[#A70000] text-white" : "text-white hover:bg-[#A70000]"
          }`}
        >
          <FaHeadset className="mr-3" />
          Material
        </a>
        <a
          href="/task"
          className={`flex items-center px-6 py-3 ${
            pathname === "/task" ? "bg-[#A70000] text-white" : "text-white hover:bg-[#A70000]"
          }`}
        >
          <FaInfoCircle className="mr-3" />
          Task
        </a>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 text-center text-xs">
        <p>MITSUBISHI TRAINING CENTER</p>
        <span>© All Rights Reserved</span>
        <p>Made With ❤️ By Wahyudi</p>
      </div>
    </div>
  );
};

export default Sidebar;
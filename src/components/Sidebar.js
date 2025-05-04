"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFilm, FaClipboardList, FaHeadset, FaInfoCircle, FaHeart, FaCalendarAlt, FaGem, FaCog, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Logo from "../../public/assets/logo.png";
import User from "../../public/assets/user.png";

const Sidebar = ({ onExpand }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { href: "/trainingSection", icon: <FaHeart />, label: "Training Section", match: ["/trainingSection", "/courses"] },
    { href: "/programOverview", icon: <FaCalendarAlt />, label: "Program Overview", match: ["/programOverview"] },
    { href: "/corporateService", icon: <FaGem />, label: "Corporate Service", match: ["/corporateService"] },
    { href: "/about", icon: <FaCog />, label: "About", match: ["/about"] },
  ];

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpand) onExpand(newExpanded);
  };

  return (
    <>
      <div 
        className={`hidden 2xl:flex ml-5 flex-col ${
          expanded ? "w-64" : "w-20"
        } min-h-[calc(100vh-40px)] bg-black text-white fixed left-0 top-5 py-6 items-center justify-between rounded-md z-50 transition-all duration-300`}
      >
        <div className="flex flex-col items-center w-full px-4">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <button 
            onClick={toggleExpand}
            className="mt-6 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 mt-10 relative w-full px-4">
          {menuItems.map((item, index) => {
            const isActive = item.match.some(path => 
              pathname === item.href || pathname.startsWith(path)
            );
            
            return (
              <div
                key={index}
                className="relative flex items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <a
                  href={item.href}
                  className={`flex items-center ${
                    expanded ? "w-full justify-start px-4 gap-4" : "w-12 justify-center"
                  } h-12 rounded-full transition ${
                    isActive ? "bg-white text-black" : "text-white hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {expanded && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </a>

                {!expanded && (
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-16 bg-black text-white text-sm font-semibold px-3 py-1 shadow-lg rounded"
                      >
                        {item.label}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mb-6 w-full px-4">
          <Link href="/profile" className="flex items-center justify-center">
            <div className={`flex items-center ${
              expanded ? "w-full justify-start px-4 gap-4" : "w-12 justify-center"
            } h-12 rounded-full transition hover:bg-gray-700`}>
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src={User}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              {expanded && (
                <span className="text-sm font-medium">My Profile</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      <div className="2xl:hidden flex items-center justify-between bg-black text-white p-4 fixed w-full top-0 left-0 z-40">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="focus:outline-none"
          aria-label="Open menu"
        >
          <Image src={Logo} alt="Logo" width={40} height={40} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-64 h-screen bg-black text-white shadow-lg flex flex-col items-center py-6 z-50"
          >
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 text-white text-2xl"
              aria-label="Close menu"
            >
              ×
            </button>

            <div className="mt-4">
              <Image src={Logo} alt="Logo" width={40} height={40} />
            </div>

            <nav className="flex flex-col gap-6 mt-10 w-full px-4">
              {menuItems.map((item, index) => {
                const isActive = item.match.some(path => 
                  pathname === item.href || pathname.startsWith(path)
                );
                
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={`flex items-center justify-start px-4 gap-4 w-full h-12 rounded-full transition ${
                      isActive ? "bg-white text-black" : "text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <Link href="/profile" className="flex items-center justify-start px-4 gap-4 w-full h-12 rounded-full transition text-white hover:bg-gray-800 mt-6">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src={User} 
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium">My Profile</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="2xl:hidden h-16"></div>
    </>
  );
};

export default Sidebar;
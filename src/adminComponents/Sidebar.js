"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaCalendarAlt,
  FaGem,
  FaCog,
  FaChevronRight,
  FaChevronLeft,
  FaBars,
  FaTimes,
  FaClipboardList,
  FaFilm,
  FaHeadset,
  FaInfoCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../../public/assets/logo.png";
import User from "../../public/assets/user.png";

const Sidebar = ({ onExpand }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpand) onExpand(newExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    router.push("/login");
  };

  if (!user) return null;

  const menuItems = [
    { href: "/admin-agenda", icon: <FaClipboardList />, label: "Agenda" },
    { href: "/admin-program/admin", icon: <FaFilm />, label: "Program" },
    { href: "/admin-material", icon: <FaHeadset />, label: "Material" },
    { href: "/management-users/admin", icon: <FaInfoCircle />, label: "Management Users" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex ml-5 flex-col ${
          expanded ? "w-64" : "w-20"
        } min-h-[calc(100vh-40px)] bg-black text-white fixed left-0 top-5 bottom-5 py-6 items-center justify-between rounded-md z-50 transition-all duration-300`}
      >
        <div className="flex flex-col items-center w-full px-4">
          <Image
            src={Logo}
            alt="Logo"
            width={40}
            height={40}
            className="mb-6"
          />
          <button
            onClick={toggleExpand}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        {/* Navigation with scrollable area */}
        <div className="flex-grow flex flex-col justify-center w-full overflow-y-auto py-4 custom-scrollbar">
          <nav className="flex flex-col gap-6 w-full px-4">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href; // Simplified active check

              return (
                <div
                  key={index}
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center ${
                      expanded
                        ? "w-full justify-start px-4 gap-4"
                        : "w-12 justify-center"
                    } h-12 rounded-full transition ${
                      isActive
                        ? "bg-white text-black"
                        : "text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {expanded && (
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {!expanded && (
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-14 bg-black text-white text-sm font-semibold px-3 py-2 shadow-lg rounded whitespace-nowrap z-50"
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
        </div>

        {/* Profile and Logout Section */}
        <div className="flex flex-col items-center w-full px-4 gap-4">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              expanded
                ? "w-full justify-start px-4 gap-4"
                : "w-12 justify-center"
            } h-12 rounded-full transition text-white hover:bg-gray-800`}
          >
            <span className="text-lg">
              <FaSignOutAlt />
            </span>
            {expanded && (
              <span className="text-sm font-medium whitespace-nowrap">
                Logout
              </span>
            )}
          </button>
          {!expanded && hoveredIndex === menuItems.length && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-14 bottom-16 bg-black text-white text-sm font-semibold px-3 py-2 shadow-lg rounded whitespace-nowrap z-50"
            >
              Logout
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex items-center justify-between bg-black text-white p-4 fixed w-full top-0 left-0 z-40 h-16 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-white hover:text-gray-300 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
          <Image
            src={Logo}
            alt="Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-sm font-semibold">Mitsubishi Course</span>
        </div>

      </div>

      {/* Enhanced Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-gray-900 text-white shadow-2xl flex flex-col z-40"
          >
            <div className="overflow-y-auto custom-scrollbar flex-grow p-4">
              <nav className="flex flex-col gap-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href; // Simplified active check

                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
                        isActive
                          ? "bg-white text-black font-bold"
                          : "text-white hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                      <FaChevronRight className="text-xs opacity-70" />
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button for Mobile */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg transition text-white hover:bg-gray-800 mt-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    <FaSignOutAlt />
                  </span>
                  <span className="text-sm font-medium">Logout</span>
                </div>
                <FaChevronRight className="text-xs opacity-70" />
              </button>
            </div>

            {/* App Version */}
            <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-800">
              v1.0.0 © 2023
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for mobile navbar */}
      <div className="lg:hidden h-16"></div>

      {/* CSS untuk menghilangkan scrollbar */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
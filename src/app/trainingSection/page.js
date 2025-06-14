"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Calendar from "@/components/Calendar";
import TrainCards from "@/components/TrainCards";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainingSection() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [username, setUsername] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUsername(parsedUser.username);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  if (!isAuthorized) {
    notFound();
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Static Sidebar (no animation) */}
      <div className="fixed lg:relative z-50">
        <Sidebar onExpand={setSidebarExpanded} />
      </div>

      {/* Animated Main Content */}
      <motion.div
        className={`flex-1 transition-all duration-300 ${
          sidebarExpanded ? "lg:ml-64" : "lg:ml-25"
        } pt-16 lg:pt-0`}
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Welcome Banner */}
        <motion.div 
          className="w-full py-6 px-4 lg:py-8 lg:px-6 flex justify-center"
          variants={item}
        >
          <div className="max-w-[1500px] w-full">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Selamat Datang, {username || "User"}!
            </motion.h1>
          </div>
        </motion.div>
        
        {/* Calendar Section */}
        <motion.div 
          className="p-4 lg:p-6 flex justify-center"
          variants={container}
        >
          <div className="max-w-[1500px] w-full flex flex-col xl:flex-row gap-6">
            <motion.div 
              className="flex-1 flex flex-col gap-6"
              variants={container}
            >
              <motion.div 
                className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6"
                variants={item}
              >
                <motion.div 
                  className="w-full"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Calendar />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Courses Section */}
        <motion.div 
          className="mt-6 lg:mt-8 px-4 lg:px-0 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-[1500px] w-full">
            <motion.h1 
              className="text-xl lg:text-2xl font-bold text-black text-center mb-4 lg:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Courses Available
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <TrainCards />
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-8 lg:mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  );
}
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Award, Users, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

const CorporateService = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/programOverview`);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <div className="z-50">
        <Sidebar onExpand={setSidebarExpanded} />
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarExpanded ? "lg:ml-70" : "lg:ml-30"
        } p-6 w-full`}
      >
        {/* Header Section */}
        <motion.div
          className="max-w-4xl w-full text-center mt-20 lg:mt-0"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.div className="flex items-center mb-6" variants={item}>
            <span className="bg-gradient-to-r from-[#A70000] to-[#ff5252] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 shadow-md">
              ☰ Employee Development
            </span>
          </motion.div>

          <motion.div className="text-left max-w-3xl" variants={item}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Enhance Your <span className="text-[#A70000]">Teams Skills</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Practical training programs designed to improve workplace performance and professional growth.
            </p>
          </motion.div>

          <motion.div variants={item}>
            <button
              onClick={handleClick}
              className="mt-8 bg-gradient-to-r from-[#A70000] to-[#d32f2f] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all duration-300 group"
            >
              <span>View Programs</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Image with Overlay */}
        <motion.div
          className="mt-8 relative rounded-xl overflow-hidden shadow-2xl max-w-6xl mx-auto h-96"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <Image
            src="/assets/login.jpg"
            alt="Team Training Session"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Hands-On Learning Experience
              </h2>
              <p className="text-gray-200 max-w-2xl">
                Interactive sessions with real-world case studies and practical exercises
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Program Cards Section */}
        <div className="mt-16 mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Training Programs
            </h2>
            <div className="w-24 h-1 bg-[#A70000] mx-auto"></div>
          </motion.div>

          <motion.div
            className={`grid grid-cols-1 ${
              sidebarExpanded
                ? "lg:grid-cols-2 xl:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-3"
            } gap-8 max-w-6xl mx-auto`}
            initial="hidden"
            animate="visible"
            variants={container}
          >
            <motion.div variants={item}>
              <ServiceCard
                icon={<BookOpen size={32} className="text-[#A70000]" />}
                title="Core Skills"
                description="Essential training for workplace effectiveness"
                programs={[
                  "Effective communication",
                  "Time management",
                  "Office tools mastery",
                  "Basic workplace safety"
                ]}
                color="bg-red-50"
              />
            </motion.div>

            <motion.div variants={item}>
              <ServiceCard
                icon={<Users size={32} className="text-[#A70000]" />}
                title="Team Development"
                description="Programs to enhance collaboration and synergy"
                programs={[
                  "Team building activities",
                  "Group problem solving",
                  "Conflict resolution",
                  "Team presentation skills"
                ]}
                color="bg-orange-50"
              />
            </motion.div>

            <motion.div variants={item}>
              <ServiceCard
                icon={<Clock size={32} className="text-[#A70000]" />}
                title="Intensive Workshops"
                description="Focused 1-2 day sessions on specific skills"
                programs={[
                  "Advanced Excel",
                  "Customer service excellence",
                  "Report writing",
                  "Public speaking"
                ]}
                color="bg-amber-50"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({
  icon,
  title,
  description,
  programs,
  color = "bg-red-50",
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      className={`relative group overflow-hidden rounded-2xl shadow-lg transition-all duration-300 h-full ${color}`}
    >
      <motion.div 
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#A70000]/10 group-hover:bg-[#A70000]/20 transition-all duration-500"
        whileHover={{ scale: 1.1 }}
      />

      <div className="p-8 relative z-10 h-full flex flex-col">
        <motion.div 
          className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md mb-6"
          whileHover={{ rotate: 5 }}
        >
          {icon}
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            Program Includes:
          </h4>
          <ul className="space-y-2">
            {programs.map((program, index) => (
              <motion.li 
                key={index} 
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="w-2 h-2 bg-[#A70000] rounded-full mr-3"></span>
                <span className="text-gray-700">{program}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.button 
          className="mt-auto flex items-center gap-2 text-[#A70000] font-medium group-hover:text-[#d32f2f] transition-colors"
          whileHover={{ x: 3 }}
        >
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CorporateService;
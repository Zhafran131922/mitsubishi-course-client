"use client";
import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const imageItem = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const AboutUs = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - unchanged */}
      <Sidebar onExpand={setSidebarExpanded} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarExpanded ? "lg:ml-64" : "lg:ml-20"} w-full`}>
        <motion.div 
          className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-12"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* About Section */}
          <motion.div 
            className="max-w-4xl w-full text-center"
            variants={container}
          >
            <motion.h1 className="text-4xl font-bold" variants={item}>
              About Mitsubishi Training
            </motion.h1>
            <motion.p className="text-gray-600 max-w-2xl mx-auto mt-4 text-sm sm:text-base" variants={item}>
              Mitsubishi Training is a comprehensive learning platform designed to enhance technical skills and product knowledge for Mitsubishi professionals and partners across Indonesia.
            </motion.p>
            <motion.div 
              className="flex justify-center items-center mt-6 space-x-2"
              variants={imageItem}
            >
              <Image 
                src="/assets/akmal.jpg" 
                alt="Developer" 
                width={100} 
                height={100} 
                className="rounded-full"
                priority
              />
            </motion.div>
            <motion.p className="mt-2 text-gray-700" variants={item}>Akmal Athaillah Manoe (1102421064)</motion.p>
            <motion.p className="text-gray-500 text-sm" variants={item}>Lead Developer</motion.p>
          </motion.div>

          {/* Our Values Section */}
          <motion.div 
            className={`grid grid-cols-1 ${sidebarExpanded ? "lg:grid-cols-2" : "md:grid-cols-2"} gap-8 max-w-4xl w-full mt-12 items-center`}
            variants={container}
          >
            <motion.div 
              className="w-full max-w-[560px] mx-auto md:mx-0"
              variants={imageItem}
            >
              <Image 
                src="/assets/car3.jpg" 
                alt="Mitsubishi Training Values" 
                width={560} 
                height={350} 
                className="rounded-lg object-cover shadow-lg"
                priority
              />
            </motion.div>
            <motion.div 
              className="text-center md:text-left"
              variants={container}
            >
              <motion.h3 className="text-sm font-bold text-gray-500" variants={item}>Our Values</motion.h3>
              <motion.h2 className="text-2xl font-semibold mt-2" variants={item}>Excellence in Technical Education</motion.h2>
              <motion.div className="text-gray-600 mt-4 text-sm sm:text-base" variants={item}>
                Our platform is built on three core principles: 
                <ul className="mt-2 space-y-2 pl-5">
                  <motion.li className="list-disc" variants={item}>Hands-on, practical learning experiences</motion.li>
                  <motion.li className="list-disc" variants={item}>Up-to-date Mitsubishi product knowledge</motion.li>
                  <motion.li className="list-disc" variants={item}>Continuous skill development for technicians</motion.li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            className="max-w-4xl w-full text-center md:text-left mt-16"
            variants={container}
          >
            <motion.h3 className="text-sm font-bold text-gray-500" variants={item}>Our Supports</motion.h3>
            <motion.h2 className="text-2xl font-semibold mt-2" variants={item}>Frequently Asked Questions</motion.h2>
            <motion.p className="text-gray-600 mt-4 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base" variants={item}>
              Find answers to common questions about our training platform.
            </motion.p>
          </motion.div>

          <motion.div 
            className={`grid grid-cols-1 ${sidebarExpanded ? "lg:grid-cols-2" : "md:grid-cols-2"} gap-8 max-w-4xl w-full mt-8`}
            variants={container}
          >
            <motion.div className="space-y-6" variants={container}>
              <motion.div 
                className="border-l-4 border-[#A70000] pl-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
                variants={item}
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-[#A70000] text-white px-2 py-1 text-xs rounded">1</span>
                <h3 className="text-lg font-semibold mt-2">Who can access the training materials?</h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  The platform is available to all authorized Mitsubishi dealers, technicians, and partners in Indonesia. Youll need valid credentials provided by your organization.
                </p>
              </motion.div>
              
              <motion.div 
                className="border-l-4 border-[#A70000] pl-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
                variants={item}
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-[#A70000] text-white px-2 py-1 text-xs rounded">2</span>
                <h3 className="text-lg font-semibold mt-2">Are the training certificates recognized?</h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Yes, all completed courses provide official Mitsubishi certification that is recognized across our dealer network in Southeast Asia.
                </p>
              </motion.div>
              
              <motion.div 
                className="border-l-4 border-[#A70000] pl-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-200"
                variants={item}
                whileHover={{ scale: 1.02 }}
              >
                <span className="bg-[#A70000] text-white px-2 py-1 text-xs rounded">3</span>
                <h3 className="text-lg font-semibold mt-2">How often are new courses added?</h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  We update our training materials quarterly to include information about new Mitsubishi products and technologies. Major updates coincide with product launches.
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="w-full max-w-[400px] mx-auto md:mx-0"
              variants={imageItem}
            >
              <Image 
                src="/assets/login.jpg" 
                alt="Training Support" 
                width={400} 
                height={300} 
                className="rounded-lg object-cover shadow-lg"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
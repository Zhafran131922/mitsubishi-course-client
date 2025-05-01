"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Award, Package } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const CorporateService = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="z-50">
        <Sidebar onExpand={setSidebarExpanded} />
      </div>
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'lg:ml-70' : 'lg:ml-30'} p-6 w-full`}>
        {/* Header Section */}
        <div className="flex flex-col items-start mb-12">
          <div className="flex items-center mb-6">
            <span className="bg-gradient-to-r from-[#A70000] to-[#ff5252] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 shadow-md">
              ☰ Corporate Service
            </span>
          </div>
          
          <div className="text-left max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Elevate Your Team's <span className="text-[#A70000]">Expertise</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Transform your workforce with our cutting-edge corporate training programs 
              designed to maximize performance and drive business growth.
            </p>
          </div>

          <button className="mt-8 bg-gradient-to-r from-[#A70000] to-[#d32f2f] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all duration-300 group">
            <span>Explore Programs</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Hero Image with Overlay */}
        <div className="mt-8 relative rounded-xl overflow-hidden shadow-2xl max-w-6xl mx-auto h-96">
          <Image 
            src="/assets/car1.jpg" 
            alt="Corporate Training" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">World-Class Corporate Training</h2>
              <p className="text-gray-200 max-w-2xl">Hands-on learning experiences tailored to your business needs</p>
            </div>
          </div>
        </div>

        {/* Program Cards Section */}
        <div className="mt-16 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Training Programs</h2>
            <div className="w-24 h-1 bg-[#A70000] mx-auto"></div>
          </div>
          
          <div className={`grid grid-cols-1 ${sidebarExpanded ? 'lg:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8 max-w-6xl mx-auto`}>
            <ServiceCard
              icon={<BookOpen size={32} className="text-[#A70000]" />}
              title="Regular Training"
              description="Continuous professional development programs to sharpen essential skills."
              programs={[
                "Leadership Development",
                "Technical Skills",
                "Soft Skills",
                "Compliance Training"
              ]}
              color="bg-red-50"
            />
            <ServiceCard
              icon={<Package size={32} className="text-[#A70000]" />}
              title="New Product Training"
              description="Specialized sessions for seamless product rollouts and adoption."
              programs={[
                "Product Knowledge",
                "Sales Techniques",
                "Customer Support",
                "Technical Specifications"
              ]}
              color="bg-orange-50"
            />
            <ServiceCard
              icon={<Award size={32} className="text-[#A70000]" />}
              title="Contest & Awarding"
              description="Engaging competitions to recognize and reward excellence."
              programs={[
                "Annual Skills Competition",
                "Innovation Challenges",
                "Performance Awards",
                "Recognition Ceremonies"
              ]}
              color="bg-amber-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, programs, color = "bg-red-50" }) => {
  return (
    <div className={`relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full ${color}`}>
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#A70000]/10 group-hover:bg-[#A70000]/20 transition-all duration-500"></div>
      
      <div className="p-8 relative z-10 h-full flex flex-col">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md mb-6">
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Program Includes:</h4>
          <ul className="space-y-2">
            {programs.map((program, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-[#A70000] rounded-full mr-3"></span>
                <span className="text-gray-700">{program}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <button className="mt-auto flex items-center gap-2 text-[#A70000] font-medium group-hover:text-[#d32f2f] transition-colors">
          <span>Discover more</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default CorporateService;
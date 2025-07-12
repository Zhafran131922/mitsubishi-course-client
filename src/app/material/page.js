"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { fetchMaterials } from "../../../lib/api";
import Image from "next/image";
import { CheckCircle, Clock, Signal, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const materialLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const durationFilters = [
  { label: "All", value: "all" },
  { label: "< 30 mins", value: "0-30" },
  { label: "30-60 mins", value: "30-60" },
  { label: "60-90 mins", value: "60-90" },
  { label: "> 90 mins", value: "90+" },
];

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ level: "all", duration: "all" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return false;
      }
      return true;
    };

    const fetchData = async () => {
      const isAuth = checkAuth();
      if (!isAuth) return;

      setIsAuthenticated(true);
      try {
        const materialsData = await fetchMaterials();
        setMaterials(materialsData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar onExpand={setSidebarExpanded} />
        <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "lg:ml-64" : "lg:ml-25"} pt-16 lg:pt-0`}>
          <div className="p-6 w-full flex justify-center items-center">
            <p>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  const beginnerCount = materials.filter((m) => m.level === "Beginner").length;
  const intermediateCount = materials.filter(
    (m) => m.level === "Intermediate"
  ).length;
  const advancedCount = materials.filter((m) => m.level === "Advanced").length;
  const expertCount = materials.filter((m) => m.level === "Expert").length;

  const filteredMaterials = materials.filter(({ title, level, duration }) => {
    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel = filter.level === "all" || level === filter.level;
    
    let matchesDuration = true;
    if (filter.duration !== "all") {
      const dur = parseInt(duration) || 0;
      switch (filter.duration) {
        case "0-30":
          matchesDuration = dur < 30;
          break;
        case "30-60":
          matchesDuration = dur >= 30 && dur < 60;
          break;
        case "60-90":
          matchesDuration = dur >= 60 && dur < 90;
          break;
        case "90+":
          matchesDuration = dur >= 90;
          break;
      }
    }
    
    return matchesSearch && matchesLevel && matchesDuration;
  });

  const handleNavigateToMaterial = (courseId) => {
    router.push(`/courses/topicId?id=${courseId}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilter({ level: "all", duration: "all" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar onExpand={setSidebarExpanded} />
        <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "lg:ml-64" : "lg:ml-25"} pt-16 lg:pt-0`}>
          <div className="p-6 w-full flex justify-center items-center">
            <p>Loading materials...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar onExpand={setSidebarExpanded} />
        <div className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "lg:ml-64" : "lg:ml-25"} pt-16 lg:pt-0`}>
          <div className="p-6 w-full flex justify-center items-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Static Sidebar */}
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
        {/* Page Header */}
        <motion.div 
          className="flex items-center mb-6 p-6"
          variants={item}
        >
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Pages
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Material
          </span>
        </motion.div>

        {/* Top Bar */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between mb-6 gap-4 px-6"
          variants={item}
        >
          <h1 className="text-2xl font-bold text-left md:text-left">
            Manage Materials
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-full md:w-72 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="mb-6 bg-gray-50 p-4 rounded-lg mx-6"
          variants={item}
        >
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter Materials</span>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Level Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Material Level
              </h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "All", value: "all", count: materials.length },
                  {
                    label: "Beginner",
                    value: "Beginner",
                    count: beginnerCount,
                  },
                  {
                    label: "Intermediate",
                    value: "Intermediate",
                    count: intermediateCount,
                  },
                  {
                    label: "Advanced",
                    value: "Advanced",
                    count: advancedCount,
                  },
                  { label: "Expert", value: "Expert", count: expertCount },
                ].map(({ label, value, count }) => (
                  <button
                    key={value}
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, level: value }))
                    }
                    className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                      filter.level === value
                        ? "bg-[#A70000] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                    <span className="text-xs text-black bg-gray-100 rounded-full px-1.5 py-0.5">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Duration
              </h3>
              <div className="flex gap-2 flex-wrap">
                {durationFilters.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, duration: value }))
                    }
                    className={`px-3 py-1 text-sm rounded-md ${
                      filter.duration === value
                        ? "bg-[#A70000] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtered Info */}
        <motion.div 
          className="mb-4 text-sm text-gray-500 px-6"
          variants={item}
        >
          Showing {filteredMaterials.length} of {materials.length} materials
          {(filter.level !== "all" || filter.duration !== "all") && (
            <span className="ml-2">
              (Filtered:{" "}
              {filter.level !== "all" && `Level: ${filter.level}`}
              {filter.level !== "all" && filter.duration !== "all" && ", "}
              {filter.duration !== "all" && `Duration: ${filter.duration}`})
            </span>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.div>

        {/* Material Cards or Empty State */}
        <motion.div 
          className="px-6 pb-6"
          variants={container}
        >
          {filteredMaterials.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={container}
            >
              {filteredMaterials.map((material) => (
                <motion.div
                  key={material.id_topic}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => handleNavigateToMaterial(material.id_topic)}
                  variants={item}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={
                        material.picture
                          ? `https://duanol.mitsubishi-training.my.id/uploads/${material.picture
                              .split("/")
                              .pop()}`
                          : "/default-image.jpg"
                      }
                      alt={material.title}
                      fill
                      style={{ objectFit: "cover" }}
                      priority={false}
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <div className="flex items-center gap-1 text-gray-700 text-sm">
                      <span>By User {material.created_by}</span>
                      <CheckCircle className="text-green-500 w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold mt-1">{material.title}</h2>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <Signal className="w-4 h-4" />
                        <span>{material.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{material.duration} Menit</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToMaterial(material.id_topic);
                      }}
                      className="mt-4 w-full bg-[#A70000] text-white py-2 rounded-md font-medium hover:bg-red-700 transition"
                    >
                      Open Course
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-gray-50 rounded-lg"
              variants={item}
            >
              <h3 className="text-lg font-medium text-gray-500">
                No materials found
              </h3>
              <p className="text-gray-400 mt-1">
                {searchTerm || filter.level !== "all" || filter.duration !== "all"
                  ? "Try a different search or reset filters"
                  : "No materials available"}
              </p>
              {(searchTerm || filter.level !== "all" || filter.duration !== "all") && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-[#A70000] text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Reset All Filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Material;
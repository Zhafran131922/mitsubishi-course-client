"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProgramModal from "@/adminComponents/ProgramModal";
import ProgramCard from "@/components/ProgramCard";
import { Filter, Wifi, MapPin } from "lucide-react";
import { ProgramAPI } from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

const programTypes = [
  "Contest",
  "Workshop",
  "Presentation",
  "Training",
  "Assessment",
  "Exhibition",
];

const ProgramOverview = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ delivery: "all", type: "all" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(null);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsData = await ProgramAPI.getAll();

        const mappedPrograms = Array.isArray(programsData)
          ? programsData.map((p) => ({
              id: p.id,
              title: p.title,
              type: p.jenis_program || "General",
              duration: `${p.duration} menit`,
              application: p.platform,
              isOnline: p.status.toLowerCase() === "online",
              image: p.content
                ? `https://duanol.mitsubishi-training.my.id/uploads/${p.content.split("/").pop()}`
                : "/default-image.jpg",
              route: `/programs/${p.id}`,
            }))
          : [];

        setPrograms(mappedPrograms);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthorized(!!token);
  }, []);

  if (authorized === null) {
    return null;
  }

  if (!authorized) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center"
      >
        <h1 className="text-xl font-bold mb-4 text-yellow-400">
          ⚠️ Akses Ditolak
        </h1>
        <p className="text-sm text-gray-300">
          Anda belum login. Silakan login untuk mengakses halaman ini.
        </p>
      </motion.div>
    );
  }

  const handleAddProgram = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    formData.append("title", form.title.value);
    formData.append("jenis_program", form.jenis_program.value);
    formData.append("description", form.description.value);
    formData.append("status", form.status.value.toLowerCase());
    formData.append("platform", form.platform.value);
    formData.append("date_program", form.creationDate.value);
    formData.append("time_program", form.creationTime.value);
    formData.append("duration", form.estimatedDuration.value);

    const imageFile = form.contentImage.files[0];
    if (imageFile) {
      formData.append("content", imageFile);
    }

    try {
      const data = await ProgramAPI.create(formData);
      console.log("Program added:", data);

      form.reset();
      alert("Program berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding program:", error.message);
      alert("Gagal menambahkan program: " + error.message);
    }
  };

  const onlineCount = programs.filter((p) => p.isOnline).length;
  const offlineCount = programs.filter((p) => !p.isOnline).length;

  const filteredPrograms = programs.filter(({ title, type, isOnline }) => {
    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDelivery =
      filter.delivery.toLowerCase() === "all" ||
      (filter.delivery.toLowerCase() === "online" && isOnline) ||
      (filter.delivery.toLowerCase() === "offline" && !isOnline);

    const matchesType =
      filter.type === "all" || type.toLowerCase() === filter.type.toLowerCase();

    return matchesSearch && matchesDelivery && matchesType;
  });

  const handleJoinProgram = (program) => {
    if (program.isOnline) {
      // Logic for joining online program
      alert(`Joining online program: ${program.title}`);
      // You can replace this with actual join logic
      // router.push(program.route);
    } else {
      // Logic for joining offline program
      alert(`Joining offline program: ${program.title}`);
    }
  };

  const handleNavigateToProgram = (program) => {
    router.push(`/programDetail?id=${program.id}`);
  };

  const handleEdit = (program) => {
    setCurrentProgram(program);
    setIsModalOpen(true);
  };

  const handleInputChange = ({ target: { name, value } }) => {
    setCurrentProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentProgram) {
        const updatedProgram = await ProgramAPI.update(
          currentProgram.id,
          formData
        );
        setPrograms(
          programs.map((p) => (p.id === currentProgram.id ? updatedProgram : p))
        );
      } else {
        const newProgram = await ProgramAPI.create(formData);
        setPrograms([...programs, newProgram]);
      }
      setIsModalOpen(false);
      setCurrentProgram(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilter({ delivery: "all", type: "all" });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />
        <div className="lg:ml-30 p-6 w-full flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-4 border-[#A70000] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />
        <div className="lg:ml-30 p-6 w-full flex justify-center items-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-red-500"
          >
            Error: {error}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Static Sidebar */}
      <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      {/* Animated Main Content */}
      <motion.div
        className="lg:ml-30 p-6 w-full"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {/* Page Header */}
        <motion.div className="flex items-center mb-6" variants={item}>
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Page
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Program
          </span>
        </motion.div>

        {/* Top Bar */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
          variants={item}
        >
          <motion.h1 
            className="text-2xl font-bold text-center md:text-left"
            whileHover={{ scale: 1.02 }}
          >
            Manage Programs
          </motion.h1>
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-full md:w-72 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
            />
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="mb-6 bg-gray-50 p-4 rounded-lg"
          variants={item}
        >
          <motion.div 
            className="flex items-center gap-2 mb-3 text-gray-700"
            whileHover={{ x: 5 }}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter Programs</span>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-6"
            variants={container}
          >
            {/* Delivery Filter */}
            <motion.div variants={item}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Delivery Method
              </h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "All", value: "all", count: programs.length },
                  {
                    label: "Online",
                    value: "online",
                    count: onlineCount,
                    icon: <Wifi className="w-4 h-4" />,
                  },
                  {
                    label: "Offline",
                    value: "offline",
                    count: offlineCount,
                    icon: <MapPin className="w-4 h-4" />,
                  },
                ].map(({ label, value, count, icon }) => (
                  <motion.button
                    key={value}
                    onClick={() =>
                      setFilter((prev) => ({ ...prev, delivery: value }))
                    }
                    className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                      filter.delivery === value
                        ? value === "online"
                          ? "bg-blue-600 text-white"
                          : value === "offline"
                          ? "bg-red-600 text-white"
                          : "bg-gray-800 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {icon}
                    {label}
                    <span className="text-xs text-black bg-gray-100 rounded-full px-1.5 py-0.5">
                      {count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Program Type Filter */}
            <motion.div variants={item}>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Program Type
              </h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, type: "all" }))
                  }
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter.type === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  All Types
                </motion.button>
                {programTypes.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => setFilter((prev) => ({ ...prev, type }))}
                    className={`px-3 py-1 text-sm rounded-md ${
                      filter.type === type
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Filtered Info */}
        <motion.div 
          className="mb-4 text-sm text-gray-500"
          variants={item}
        >
          Showing {filteredPrograms.length} of {programs.length} programs
          {(filter.delivery !== "all" || filter.type !== "all") && (
            <span className="ml-2">
              (Filtered:{filter.delivery !== "all" && ` ${filter.delivery}`}
              {filter.type !== "all" && ` ${filter.type}`})
            </span>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.div>

        {/* Program Cards or Empty State */}
        {filteredPrograms.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
          >
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                variants={item}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ProgramCard
                  program={program}
                  onJoin={handleJoinProgram}
                  onClick={handleNavigateToProgram}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-gray-50 rounded-lg"
            variants={item}
          >
            <h3 className="text-lg font-medium text-gray-500">
              No programs found
            </h3>
            <p className="text-gray-400 mt-1">
              {searchTerm || filter.delivery !== "all" || filter.type !== "all"
                ? "Try a different search or reset filters"
                : "No programs available"}
            </p>
            {(searchTerm ||
              filter.delivery !== "all" ||
              filter.type !== "all") && (
              <motion.button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#A70000] text-white rounded-md hover:bg-red-700 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset All Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProgramModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            newProgram={programs}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            onSubmit={handleAddProgram}
            currentProgram={currentProgram}
            programTypes={programTypes}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramOverview;
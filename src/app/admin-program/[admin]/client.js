"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/adminComponents/Sidebar";
import ProgramModal from "@/adminComponents/ProgramModal";
import ProgramCard from "@/adminComponents/ProgramCards";
import { Filter, Wifi, MapPin } from "lucide-react";
import { ProgramAPI } from "../../../../lib/api";
import Swal from "sweetalert2";

const programTypes = [
  "Contest",
  "Workshop",
  "Presentation",
  "Training",
  "Assessment",
  "Exhibition",
];

const AdminProgram = () => {
  const [programs, setPrograms] = useState([]);
  const [pro, setPro] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ delivery: "all", type: "all" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const router = useRouter();
  const [error, setError] = useState(null);

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
                ? `https://duanol.mitsubishi-training.my.id/uploads/${p.content
                    .split("/")
                    .pop()}`
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
      Swal.fire({
        title: "Berhasil!",
        text: "Program berhasil ditambahkan!",
        icon: "success",
        confirmButtonColor: "#A70000",
      });
    } catch (error) {
      console.error("Error adding program:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambahkan program: " + error.message,
        icon: "error",
        confirmButtonColor: "#A70000",
      });
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

  const handleDelete = async (program) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menghapus program "${program.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A70000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await ProgramAPI.delete(program.id);
      setPrograms(programs.filter((p) => p.id !== program.id));

      Swal.fire({
        title: "Berhasil!",
        text: "Program berhasil dihapus",
        icon: "success",
        confirmButtonColor: "#A70000",
      });
    } catch (err) {
      Swal.fire({
        title: "Gagal!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#A70000",
      });
    }
  };

  const handleNavigateToProgram = (program) => {
    router.push(`/admin-page-program?id=${program.id}`);
  };

  const handleProgramAdded = (newProgram) => {
  setPro(prev => [...prev, newProgram]);
};

  const handleEdit = (program) => {
    setCurrentProgram(program);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProgram(null);
    setIsModalOpen(true);
  };

  const handleNewProgram = (newProgram) => {
    setProgram((prev) => [newProgram, ...prev]);
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

        Swal.fire({
          title: "Berhasil!",
          text: "Program berhasil diperbarui",
          icon: "success",
          confirmButtonColor: "#A70000",
        });
      } else {
        const newProgram = await ProgramAPI.create(formData);
        setPrograms([...programs, newProgram]);

        Swal.fire({
          title: "Berhasil!",
          text: "Program berhasil ditambahkan",
          icon: "success",
          confirmButtonColor: "#A70000",
        });
      }
      setIsModalOpen(false);
      setCurrentProgram(null);
    } catch (err) {
      Swal.fire({
        title: "Gagal!",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#A70000",
      });
    }
  };

  const handleProgramClick = (program) => {
    console.log("Program clicked:", program);
    setCurrentProgram(program);
    setIsModalOpen(true);
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
          <p>Loading programs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />
        <div className="lg:ml-30 p-6 w-full flex justify-center items-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      <div className="lg:ml-30 p-6 w-full">
        {/* Page Header */}
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Page
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Program
          </span>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between  mb-6 gap-4">
          <h1 className="text-2xl font-bold text-left md:text-left ml-4">
            Manage Programs
          </h1>
          <div className="flex items-center gap-4">
            <div className="fixed sm:static bottom-6 right-6 z-30">
              {/* Mobile - Floating Button (icon only) */}
              <button
                onClick={handleAddNew}
                className="sm:hidden p-4 bg-white text-[#A70000] rounded-full shadow-lg hover:bg-gray-300 shadow-md transition-colors duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Add Program"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Add Program</span>
              </button>

              {/* Desktop - Full Button with text */}
              <button
                onClick={handleAddNew}
                className="hidden sm:flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-[#A70000] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-medium text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Program
              </button>
            </div>
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-full md:w-72 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter Programs</span>
          </div>

          <div className="flex flex-wrap gap-6">
            {/* Delivery Filter */}
            <div>
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
                  <button
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
                  >
                    {icon}
                    {label}
                    <span className="text-xs text-black bg-gray-100 rounded-full px-1.5 py-0.5">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Program Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Program Type
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, type: "all" }))
                  }
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter.type === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  All Types
                </button>
                {programTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter((prev) => ({ ...prev, type }))}
                    className={`px-3 py-1 text-sm rounded-md ${
                      filter.type === type
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filtered Info */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredPrograms.length} of {programs.length} programs
          {(filter.delivery !== "all" || filter.type !== "all") && (
            <span className="ml-2">
              (Filtered:{filter.delivery !== "all" && ` ${filter.delivery}`}
              {filter.type !== "all" && ` ${filter.type}`})
            </span>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Program Cards or Empty State */}
        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onClick={handleNavigateToProgram}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
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
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#A70000] text-white rounded-md hover:bg-red-700 text-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newProgram={programs}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        onSubmit={handleAddProgram}
        onSuccess={handleProgramAdded}
        currentProgram={currentProgram}
        programTypes={programTypes}
      />
    </div>
  );
};

export default AdminProgram;

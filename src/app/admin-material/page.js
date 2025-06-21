"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/adminComponents/Sidebar";
import MaterialModal from "@/adminComponents/MaterialModal";
import QuizModal from "@/adminComponents/QuizModal";
import { CheckCircle, Clock, Signal, Filter, Trash2 } from "lucide-react";
import { fetchMaterials, deleteTopic } from "../../../lib/api";
import Image from "next/image";
import Swal from "sweetalert2";

const materialLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const AdminMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ level: "all" });
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(null);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />
        <div className="lg:ml-30 p-6 w-full flex justify-center items-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleAddMaterial = async (formData) => {
    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add material");
      }

      const newMaterial = await response.json();

      // Tambahkan materi baru ke state
      setMaterials((prev) => [...prev, newMaterial]);

      setIsMaterialModalOpen(false);
      Swal.fire({
        title: "Berhasil!",
        text: "Material berhasil ditambahkan!",
        icon: "success",
        confirmButtonColor: "#A70000",
      });
    } catch (error) {
      console.error("Error adding material:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menambahkan material: " + error.message,
        icon: "error",
        confirmButtonColor: "#A70000",
      });
    }
  };

  const beginnerCount = materials.filter((m) => m.level === "Beginner").length;
  const intermediateCount = materials.filter(
    (m) => m.level === "Intermediate"
  ).length;
  const advancedCount = materials.filter((m) => m.level === "Advanced").length;
  const expertCount = materials.filter((m) => m.level === "Expert").length;

  const filteredMaterials = materials.filter(({ title, level }) => {
    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel = filter.level === "all" || level === filter.level;
    return matchesSearch && matchesLevel;
  });

  const handleDelete = async (id_topic, title) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: `Apakah Anda yakin ingin menghapus materi "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A70000",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTopic(id_topic);
      setMaterials(materials.filter((m) => m.id_topic !== id_topic));
      Swal.fire({
        title: "Berhasil!",
        text: "Materi berhasil dihapus",
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

  const handleNavigateToMaterial = (id_topic) => {
    router.push(`/admin-courses?id=${id_topic}`);
  };

  const handleEdit = (material) => {
    setCurrentMaterial(material);
    setIsMaterialModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentMaterial(null);
    setIsMaterialModalOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilter({ level: "all" });
  };

  const handleTopicCreated = (newTopic) => {
    // Update state dengan topic baru
    setTopics((prev) => [...prev, newTopic]);
    // Jika materials perlu diupdate juga
    fetchMaterials().then((data) => setMaterials(data));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
        <Sidebar className="w-full lg:w-30 bg-gray-800 text-white fixed lg:relative top-0 left-0" />
        <div className="lg:ml-30 p-6 w-full flex justify-center items-center">
          <p>Loading materials...</p>
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
            ☰ Admin Pages
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Material
          </span>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold text-left md:text-left">
            Manage Materials
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 fixed sm:static bottom-6 right-6 z-30">
              {/* Add Material Button */}
              <div>
                {/* Mobile - Floating Button (icon only) */}
                <button
                  onClick={handleAddNew}
                  className="sm:hidden p-4 bg-[#A70000] text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Add Material"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-3v3H8v-3H5V8h3V5h2v3h3v2z" />
                  </svg>
                  <span className="sr-only">Add Material</span>
                </button>

                {/* Desktop - Full Button with text */}
                <button
                  onClick={handleAddNew}
                  className="hidden sm:flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-[#A70000] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-medium text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-3v3H8v-3H5V8h3V5h2v3h3v2z" />
                  </svg>
                  Add Material
                </button>
              </div>

              <div>
                {/* Mobile - Floating Button (icon only) */}
                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="sm:hidden p-4 bg-[#A70000] text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Add Quiz"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  <span className="sr-only">Add Quiz</span>
                </button>

                {/* Desktop - Full Button with text */}
                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="hidden sm:flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-[#A70000] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 font-medium text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                  Add Quiz
                </button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search materials..."
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
          </div>
        </div>

        {/* Filtered Info */}
        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredMaterials.length} of {materials.length} materials
          {filter.level !== "all" && (
            <span className="ml-2">(Filtered: {filter.level})</span>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {/* Material Cards or Empty State */}
        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <div
                key={material.id_topic}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                onClick={() => handleNavigateToMaterial(material.id_topic)}
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
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToMaterial(material.id_topic);
                      }}
                      className="w-full bg-[#A70000] text-white py-2 rounded-md font-medium hover:bg-red-700 transition"
                    >
                      Open Course
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(material.id_topic, material.title);
                      }}
                      className="w-1/3 border border-red-600 text-red-600 py-2 rounded-md font-medium hover:bg-red-100 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-500">
              No materials found
            </h3>
            <p className="text-gray-400 mt-1">
              {searchTerm || filter.level !== "all"
                ? "Try a different search or reset filters"
                : "No materials available"}
            </p>
            {(searchTerm || filter.level !== "all") && (
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

      {/* Modals */}
      <MaterialModal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        currentMaterial={currentMaterial}
        onSubmit={handleAddMaterial}
        materialLevels={materialLevels}
        onSuccess={handleTopicCreated}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        materials={materials}
      />
    </div>
  );
};

export default AdminMaterial;

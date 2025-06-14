"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Sidebar from "@/adminComponents/Sidebar";
import QuizSection from "@/adminComponents/CourseSection";
import { getTopicById, getMaterialByTopicId, deleteTopic } from "../../../lib/api";
import { Signal, Clock, Trash2 } from "lucide-react";

function AdminCoursePage() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get('id');
  
  const [material, setMaterial] = useState([]);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    if (!topicId) {
      setError("Topic ID is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [materialData, topicData] = await Promise.all([
          getMaterialByTopicId(topicId),
          getTopicById(topicId),
        ]);
        
        setMaterial(materialData);
        setTopic(topicData);

        if (materialData.length > 0) {
          setActiveMaterial(materialData[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const handleMaterialClick = (selectedMaterial) => {
    setActiveMaterial(selectedMaterial);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${topic?.title}"?`)) return;

    try {
      await deleteTopic(topicId);
      window.location.href = "/adminMaterial";
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
          <button
            onClick={() => window.location.href = "/adminMaterial"}
            className="mt-4 px-4 py-2 bg-[#A70000] text-white rounded-md shadow hover:bg-red-600 transition"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
            Course not found
          </div>
          <button
            onClick={() => window.location.href = "/adminMaterial"}
            className="mt-4 px-4 py-2 bg-[#A70000] text-white rounded-md shadow hover:bg-red-600 transition"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Training Section
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Materi
          </span>
        </div>

        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h1 className="text-xl font-bold">
              {topic.title || "Judul tidak tersedia"}
            </h1>

            <div className="flex gap-4 mt-2 flex-wrap">
              <div className="flex items-center">
                <Signal className="w-6 h-6 text-gray-600" />
                <p className="text-gray-600 ml-2">{topic.level}</p>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-gray-600" />
                <p className="text-gray-600 ml-2">{topic.duration} Menit</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 lg:mt-0 justify-end w-full">
            <button className="text-[#A70000] font-bold text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2">
              Share
            </button>
            <button 
              onClick={handleDelete}
              className="flex items-center bg-[#A70000] text-white text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 font-bold rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
              <span className="ml-2">Delete Course</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="w-full lg:flex-1">
            {activeMaterial?.url_link ? (
              <iframe
                src={activeMaterial.url_link}
                title={activeMaterial.title}
                allowFullScreen
                className="w-full h-60 sm:h-80 lg:h-[600px] rounded-lg shadow-md"
              ></iframe>
            ) : (
              <div className="w-full h-60 sm:h-80 lg:h-[600px] bg-gray-100 rounded-lg shadow-md flex items-center justify-center">
                <p>No video available</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3 overflow-hidden">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-[#A70000] text-white">
                  <th className="p-2">#</th>
                  <th className="p-2">Course Content</th>
                </tr>
              </thead>
              <tbody>
                {material.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-300 hover:bg-gray-100 cursor-pointer ${
                      activeMaterial?.id === item.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => handleMaterialClick(item)}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          {activeMaterial ? (
            <QuizSection key={activeMaterial.id} material={activeMaterial} />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Select a material to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    }>
      <AdminCoursePage />
    </Suspense>
  );
}
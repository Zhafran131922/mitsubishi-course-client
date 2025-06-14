"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import QuizSection from "@/components/CourseSection";
import Sidebar from "@/components/Sidebar";
import { getMaterialByTopicId, getTopicById } from "../../../../lib/api";
import {
  Signal,
  Clock,
  Share2,
  ChevronRight,
  BookOpen,
  Video,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function CourseContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("id");

  const [material, setMaterial] = useState([]);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState(null);
  const [completedMaterials, setCompletedMaterials] = useState(new Set());
  const [userId, setUserId] = useState(null);

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!topicId) return;

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please login first");

        const id_user = getUserIdFromToken();
        if (!id_user) throw new Error("User authentication required");
        setUserId(id_user);

        const [materialData, topicData] = await Promise.all([
          getMaterialByTopicId(topicId),
          getTopicById(topicId),
        ]);

        setMaterial(materialData);
        setTopic(topicData);

        if (materialData.length > 0) {
          setActiveMaterial(materialData[0]);
        }

        const completionStatus = await Promise.all(
          materialData.map(async (material) => {
            try {
              return await getCompletionStatus(material.id);
            } catch {
              return false;
            }
          })
        );

        const completed = new Set();
        materialData.forEach((material, index) => {
          if (completionStatus[index]) {
            completed.add(material.id);
          }
        });

        setCompletedMaterials(completed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [topicId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: topic?.title || "Course Material",
          text: "Check out this learning material",
          url: window.location.href,
        })
        .catch(() => {
          navigator.clipboard
            .writeText(window.location.href)
            .then(() => alert("Link copied to clipboard!"))
            .catch(() => alert("Failed to copy link"));
        });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
    }
  };

  const isMaterialCompleted = (materialId) =>
    completedMaterials.has(materialId);

  const handleMaterialClick = (selectedMaterial) => {
    setActiveMaterial(selectedMaterial);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A70000]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-1 bg-[#A70000] text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md text-center">
            Course not found
            <button
              onClick={() => (window.location.href = "/courses")}
              className="mt-2 px-4 py-1 bg-[#A70000] text-white rounded-md"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-transparent">
      <div className="w-full lg:w-64">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Training Section
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Materi
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {topic.title}
              </h1>
              <div className="flex gap-4">
                <div className="flex items-center text-gray-600">
                  <Signal className="w-5 h-5 mr-2 text-[#A70000]" />
                  <span>{topic.level}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2 text-[#A70000]" />
                  <span>{topic.duration} Menit</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center text-[#A70000] hover:text-red-700 font-medium px-4 py-2 border border-[#A70000] rounded-lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:flex-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {activeMaterial?.url_link ? (
                <div className="relative aspect-video">
                  <iframe
                    src={activeMaterial.url_link}
                    title={activeMaterial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No content available</p>
                  </div>
                </div>
              )}
            </div>

            {activeMaterial && (
              <div className="mt-6">
                <QuizSection material={activeMaterial} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-[#A70000] text-white p-4 font-bold text-lg">
                Course Materials
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {material.map((item, index) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ x: 5 }}
                    className={`p-4 cursor-pointer transition ${
                      activeMaterial?.id === item.id ? "bg-gray-50" : ""
                    } ${
                      isMaterialCompleted(item.id)
                        ? "border-l-4 border-green-500"
                        : ""
                    }`}
                    onClick={() => handleMaterialClick(item)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          isMaterialCompleted(item.id)
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          {item.type === "video" ? (
                            <Video className="w-4 h-4 mr-1" />
                          ) : (
                            <BookOpen className="w-4 h-4 mr-1" />
                          )}
                          <span>{item.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isMaterialCompleted(item.id) && (
                          <Check className="w-5 h-5 text-green-500 ml-2" />
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A70000] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course content...</p>
            </div>
          </div>
        </div>
      }
    >
      <CourseContent />
    </Suspense>
  );
}
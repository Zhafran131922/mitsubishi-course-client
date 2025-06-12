"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import QuizSection from "@/components/CourseSection";
import Overview from "@/components/Overview";
import QuizTaker from "@/components/Quiz";
import Sidebar from "@/components/Sidebar";
import { getMaterialByTopicId, getTopicById } from "../../../../../lib/api";

export default function Courses() {
  const { topicId } = useParams();
  const [material, setMaterial] = useState([]);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [completedMaterials, setCompletedMaterials] = useState(new Set());
  const [isMarkingDone, setIsMarkingDone] = useState(false);

  useEffect(() => {
    if (!topicId) return;

    const fetchData = async () => {
      try {
        const [materialData, topicData] = await Promise.all([
          getMaterialByTopicId(topicId),
          getTopicById(topicId),
        ]);
        setMaterial(materialData);
        setTopicTitle(topicData.title);

        if (materialData.length > 0) {
          setActiveMaterial(materialData[0]);
        }

        // Load completed materials from localStorage or API if needed
        const storedCompleted = localStorage.getItem(`completedMaterials_${topicId}`);
        if (storedCompleted) {
          setCompletedMaterials(new Set(JSON.parse(storedCompleted)));
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const handleMarkAsDone = async () => {
    if (!activeMaterial) return;
    
    try {
      setIsMarkingDone(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:3001/api/v1/materials/markdone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_user: 1, // Ini bisa diganti dengan user ID dari token atau state
          id_material: activeMaterial.id,
          isDone: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark material as done');
      }

      // Update completed materials state
      const newCompleted = new Set(completedMaterials);
      newCompleted.add(activeMaterial.id);
      setCompletedMaterials(newCompleted);
      
      // Save to localStorage
      localStorage.setItem(
        `completedMaterials_${topicId}`,
        JSON.stringify(Array.from(newCompleted))
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setIsMarkingDone(false);
    }
  };

  const handleShare = () => {
    if (!activeMaterial) return;
    
    if (navigator.share) {
      navigator.share({
        title: activeMaterial.title,
        text: `Check out this learning material: ${activeMaterial.title}`,
        url: window.location.href,
      })
      .catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  const isMaterialCompleted = (materialId) => {
    return completedMaterials.has(materialId);
  };

  const handleMaterialClick = (selectedMaterial) => {
    setActiveMaterial(selectedMaterial);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

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
              {topicTitle || "Judul tidak tersedia"}
            </h1>

            <div className="flex gap-4 mt-2 flex-wrap">
              <div className="flex items-center">
                <Image
                  src="/assets/level.png"
                  alt="Level"
                  width={24}
                  height={24}
                />
                <p className="text-gray-600 ml-2">Beginner</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 lg:mt-0 justify-end w-full">
            <button 
              onClick={handleShare}
              className="text-[#A70000] font-bold text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2"
            >
              Share
            </button>
            {activeMaterial && (
              <button 
                onClick={handleMarkAsDone}
                disabled={isMarkingDone || isMaterialCompleted(activeMaterial.id)}
                className={`flex items-center ${
                  isMaterialCompleted(activeMaterial.id) 
                    ? 'bg-green-600' 
                    : 'bg-[#A70000]'
                } text-white text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 font-bold rounded-lg`}
              >
                {isMaterialCompleted(activeMaterial.id) ? (
                  <>
                    <Image
                      src="/assets/done.png"
                      alt="Course Done"
                      width={20}
                      height={20}
                    />
                    <span className="ml-2">Course Done</span>
                  </>
                ) : (
                  <>
                    <Image
                      src="/assets/done.png"
                      alt="Mark As Done"
                      width={20}
                      height={20}
                    />
                    <span className="ml-2">
                      {isMarkingDone ? 'Processing...' : 'Mark As Done'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="w-full lg:flex-1">
            <iframe
              src={activeMaterial?.url_link || ""}
              title={activeMaterial?.title || "Video"}
              allowFullScreen
              className="w-full h-60 sm:h-80 lg:h-[600px] rounded-lg shadow-md"
            ></iframe>
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
                    } ${
                      isMaterialCompleted(item.id) ? "bg-green-50" : ""
                    }`}
                    onClick={() => handleMaterialClick(item)}
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 flex items-center">
                      {item.title}
                      {isMaterialCompleted(item.id) && (
                        <span className="ml-2 text-green-600">
                          ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          {activeMaterial ? (
            <>
              <QuizSection key={activeMaterial.id} material={activeMaterial} />
              {/* <Overview key={`overview-${activeMaterial.id}`} material={activeMaterial} /> */}
            </>
          ) : (
            <div>No material selected</div>
          )}
        </div>
      </div>
    </div>
  );
}
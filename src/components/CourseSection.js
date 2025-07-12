'use client';
import { useState, useEffect } from "react";
import Overview from "./Overview";
import Module from "./Module";
import Review from "./Review";
import QuizSection from "./Quiz";
import { jwtDecode } from "jwt-decode";

const CourseContentSection = ({ material }) => {
  const [activePage, setActivePage] = useState("overview");
  const [activeIndex, setActiveIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [loadingQuizStatus, setLoadingQuizStatus] = useState(true);

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  // Check quiz status when user ID or material changes
  useEffect(() => {
    if (!userId || !material?.id) return;

    const checkQuizStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `https://duanol.mitsubishi-training.my.id/api/v1/quiz/score/${userId}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Handle both array and single object responses
          if (Array.isArray(data)) {
            const materialStatus = data.find(item => item.id_material === material.id);
            if (materialStatus && materialStatus.status === "passed") {
              setQuizPassed(true);
            }
          } else if (data.id_material === material.id && data.status === "passed") {
            setQuizPassed(true);
          }
        }
      } catch (error) {
        console.error("Error checking quiz status:", error);
      } finally {
        setLoadingQuizStatus(false);
      }
    };

    checkQuizStatus();
  }, [userId, material]);

  // Tambahkan validasi untuk material
  const currentMaterial = Array.isArray(material) ? material : [material].filter(Boolean);

  // Filter tabs based on quiz status
  const filteredTabs = [
    { name: "Overview", key: "overview" },
    { name: "Modul", key: "course" },
    ...(!quizPassed ? [{ name: "Take a Quiz", key: "quiz" }] : [])
  ];

  const nextTab = () => {
    const nextIndex = (activeIndex + 1) % filteredTabs.length;
    setActiveIndex(nextIndex);
    setActivePage(filteredTabs[nextIndex].key);
  };

  const prevTab = () => {
    const prevIndex = (activeIndex - 1 + filteredTabs.length) % filteredTabs.length;
    setActiveIndex(prevIndex);
    setActivePage(filteredTabs[prevIndex].key);
  };

  // If trying to access quiz tab but already passed, redirect to overview
  useEffect(() => {
    if (!loadingQuizStatus && quizPassed && activePage === "quiz") {
      setActivePage("overview");
      setActiveIndex(0);
    }
  }, [loadingQuizStatus, quizPassed, activePage]);

  return (
    <div className="w-full">
      {/* Navigasi Tab */}
      <div className="hidden sm:flex flex-wrap gap-2 sm:gap-4 p-2 justify-center sm:justify-start">
        {filteredTabs.map((item, index) => (
          <button
            key={item.key}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-lg font-bold transition rounded-md 
              ${activePage === item.key
                ? "bg-red-700 text-white"
                : "bg-transparent text-black hover:bg-red-700 hover:text-white"
              }`}
            onClick={() => {
              setActivePage(item.key);
              setActiveIndex(index);
            }}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Tombol Navigasi untuk Mobile */}
      <div className="sm:hidden flex items-center justify-center gap-4 p-2">
        <button onClick={prevTab} className="px-4 py-2 bg-gray-300 text-black font-bold rounded-md">
          ←
        </button>
        <button className="px-4 py-2 bg-red-700 text-white font-bold rounded-md">
          {filteredTabs[activeIndex]?.name || "Overview"}
        </button>
        <button onClick={nextTab} className="px-4 py-2 bg-gray-300 text-black font-bold rounded-md">
          →
        </button>
      </div>

      {/* Konten */}
      <div className="bg-white w-full min-h-[300px] p-4 sm:p-5 mt-2 rounded-lg shadow-lg overflow-auto">
        {activePage === "overview" && <Overview material={currentMaterial[0]} />}
        {activePage === "course" && <Module material={currentMaterial} />}
        {activePage === "quiz" && currentMaterial[0] && !quizPassed && (
          <QuizSection material={currentMaterial[0]} />
        )}
      </div>
    </div>
  );
};

export default CourseContentSection;
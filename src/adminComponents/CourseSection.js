'use client';
import { useState } from "react";
import Overview from "./Overview";
import Module from "./Module";
import Review from "./Review";
import QuizSection from "./Quiz";

const tabs = [
  { name: "Overview", key: "overview" },
  { name: "Modul", key: "course" },
  { name: "Take a Quiz", key: "quiz" },
  { name: "Review", key: "review" },
];

const CourseContentSection = ({ material }) => {
  const [activePage, setActivePage] = useState("overview");
  const [activeIndex, setActiveIndex] = useState(0);

  // Tambahkan validasi untuk material
  const currentMaterial = Array.isArray(material) ? material : [material].filter(Boolean);

  const nextTab = () => {
    const nextIndex = (activeIndex + 1) % tabs.length;
    setActiveIndex(nextIndex);
    setActivePage(tabs[nextIndex].key);
  };

  const prevTab = () => {
    const prevIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    setActiveIndex(prevIndex);
    setActivePage(tabs[prevIndex].key);
  };

  return (
    <div className="w-full">
      {/* Navigasi Tab */}
      <div className="hidden sm:flex flex-wrap gap-2 sm:gap-4 p-2 justify-center sm:justify-start">
        {tabs.map((item, index) => (
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
          {tabs[activeIndex].name}
        </button>
        <button onClick={nextTab} className="px-4 py-2 bg-gray-300 text-black font-bold rounded-md">
          →
        </button>
      </div>

      {/* Konten */}
      <div className="bg-white w-full min-h-[300px] p-4 sm:p-5 mt-2 rounded-lg shadow-lg overflow-auto">
        {activePage === "overview" && <Overview />}
        {activePage === "course" && <Module material={currentMaterial} />}
        {activePage === "quiz" && currentMaterial[0] && (
          <QuizSection material={currentMaterial[0]} />
        )}
       {activePage === "review" && <Review material={currentMaterial[0]} />}
      </div>
    </div>
  );
};

export default CourseContentSection;
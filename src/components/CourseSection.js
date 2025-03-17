"use client";
import { useState } from "react";
import Overview from "./Overview";
import Module from "./Module";
import Review from "./Review";
import Quiz from "./Quiz";

const tabs = [
  { name: "Overview", key: "overview" },
  { name: "Modul", key: "course" },
  { name: "Take a Quiz", key: "quiz" },
  { name: "Review", key: "review" },
];

const QuizSection = () => {
  const [activePage, setActivePage] = useState("overview");
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTab = () => {
    setActiveIndex((prev) => (prev + 1) % tabs.length);
    setActivePage(tabs[(activeIndex + 1) % tabs.length].key);
  };

  const prevTab = () => {
    setActiveIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
    setActivePage(tabs[(activeIndex - 1 + tabs.length) % tabs.length].key);
  };

  return (
    <div className="w-full">
      {/* Navigasi Tab */}
      <div className="hidden sm:flex flex-wrap gap-2 sm:gap-4 p-2 justify-center sm:justify-start">
        {tabs.map((item) => (
          <button
            key={item.key}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-lg font-bold transition rounded-md 
              ${
                activePage === item.key
                  ? "bg-red-700 text-white"
                  : "bg-transparent text-black hover:bg-red-700 hover:text-white"
              }`}
            onClick={() => setActivePage(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Tombol Navigasi untuk Mobile */}
      <div className="sm:hidden flex items-center justify-center gap-4 p-2">
        <button
          onClick={prevTab}
          className="px-4 py-2 bg-gray-300 text-black font-bold rounded-md"
        >
          ←
        </button>

        <button
          className="px-4 py-2 bg-red-700 text-white font-bold rounded-md"
        >
          {tabs[activeIndex].name}
        </button>

        <button
          onClick={nextTab}
          className="px-4 py-2 bg-gray-300 text-black font-bold rounded-md"
        >
          →
        </button>
      </div>

      {/* Konten */}
      <div className="bg-white w-full min-h-[300px] p-4 sm:p-5 mt-2 rounded-lg shadow-lg overflow-auto">
        {activePage === "overview" && <Overview />}
        {activePage === "course" && <Module />}
        {activePage === "quiz" && <Quiz />}
        {activePage === "review" && <Review />}
      </div>
    </div>
  );
};

export default QuizSection;

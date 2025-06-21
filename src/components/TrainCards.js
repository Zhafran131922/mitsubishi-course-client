"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation
import Image from "next/image";
import { CheckCircle, Clock, Signal } from "lucide-react";
import { motion } from "framer-motion";
import { fetchMaterials } from "../../lib/api";

const TrainCard = ({ title, author, level, duration, image, onNavigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden w-full"
  >
    <div className="relative w-full aspect-[4/3]">
      <Image
        src={image || "/default-image.jpg"}
        alt="Materi"
        layout="fill"
        objectFit="cover"
        onError={(e) => {
          e.target.src = "/default-image.jpg";
        }}
      />
    </div>
    <div className="p-4 flex flex-col">
      <div className="flex items-center gap-1 text-gray-700 text-sm">
        <span>By Trainer</span>
        <CheckCircle className="text-green-500 w-4 h-4" />
      </div>
      <h2 className="text-lg font-bold mt-4">{title}</h2>
      <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
        <div className="flex items-center gap-1">
          <Signal className="w-4 h-4" />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      </div>
      <button 
        onClick={onNavigate}
        className="w-full bg-[#A70000] text-white py-2 rounded-md font-medium hover:bg-red-700 transition mt-4"
      >
        Buka Materi
      </button>
    </div>
  </motion.div>
);

const CardsContainer = () => {
  const router = useRouter(); // Initialize router
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [user, setUser] = useState({ username: "guest" });

  useEffect(() => {
    const storedUser = (() => {
      if (typeof window === "undefined") return { username: "guest" };
      try {
        return JSON.parse(localStorage.getItem("user")) || { username: "guest" };
      } catch {
        return { username: "guest" };
      }
    })();
    setUser(storedUser);

    const loadMaterials = async () => {
      try {
        const materials = await fetchMaterials();
        const transformedCourses = materials.map((course) => ({
          id: course.id_topic, // Include the id in the course object
          title: course.title,
          author: `User ${course.created_by}`,
          level: course.level,
          duration: `${course.duration} Menit`,
          image: getImageUrl(course.picture),
        }));
        setCourses(transformedCourses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const getImageUrl = (picturePath) => {
    if (!picturePath) return "/default-image.jpg";
    if (picturePath.startsWith("http")) return picturePath;
    const filename = picturePath.split("/").pop() || picturePath.split("/").pop();
    return `https://duanol.mitsubishi-training.my.id/uploads/${filename}`;
  };

  // Navigation handler
  const handleNavigateToCourse = (courseId) => {
    router.push(`/courses/topicId?id=${courseId}`);
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A70000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-4">
        {(showAll ? courses : courses.slice(0, 5)).map((course, index) => (
          <div key={index} className="w-full">
            <TrainCard 
              {...course}
              onNavigate={() => handleNavigateToCourse(course.id)} // Pass navigation handler
            />
          </div>
        ))}
      </div>

      {courses.length > 5 && (
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll((prev) => !prev)}
            className="bg-transparent text-white underline py-2 px-4 rounded-md font-medium hover:text-bold transition"
          >
            {showAll ? "Show Less" : "View More"}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CardsContainer;
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock, Signal } from "lucide-react";
import Sidebar from "@/adminComponents/Sidebar";
import MaterialModal from "@/adminComponents/MaterialModal";
import QuizModal from "@/adminComponents/QuizModal";
import { fetchMaterials } from "../../../../lib/api";

const TrainCard = ({
  title,
  author,
  level,
  duration,
  image,
  route,
  onDelete,
  topicId,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
      <div className="relative w-full h-40">
        <Image src={image} alt="Materi" layout="fill" objectFit="cover" />
      </div>
      <div className="p-4 flex flex-col">
        <div className="flex items-center gap-1 text-gray-700 text-sm">
          <span>By {author}</span>
          <CheckCircle className="text-green-500 w-4 h-4" />
        </div>
        <h2 className="text-lg font-bold mt-1">{title}</h2>
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <div className="flex items-center gap-1">
            <Signal className="w-4 h-4" />
            <span>{level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration} Menit</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={route} className="w-full">
            <button className="w-full bg-[#A70000] text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
              Open Course
            </button>
          </Link>
          <button
            className="w-1/3 border border-red-600 text-red-600 py-2 rounded-md font-medium hover:bg-red-100 transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminMaterial = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [newProgram, setNewProgram] = useState({
    title: "",
    author: "",
    level: "",
    duration: "",
    image: "",
    route: "",
  });

  useEffect(() => {
    const getMaterials = async () => {
      const data = await fetchMaterials();
      setMaterials(data);
    };

    getMaterials();
  }, []);

  const convertImagePath = (rawPath) => {
    const filename = rawPath.split("\\").pop(); // Ambil nama file dari path Windows
    return `http://localhost:3001/uploads/${filename}`;
  };

  const filteredCourses = materials.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveQuiz = (newQuiz) => {
    console.log("Quiz baru:", newQuiz);
    // Lakukan sesuatu dengan data quiz baru, misalnya update state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Program Added: ", newProgram);
    setIsModalOpen(false);
  };

  const handleDelete = async (id_topic, title) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus materi "${title}"?`
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token"); // Pastikan token disimpan saat login

      const response = await fetch(
        `http://localhost:3001/api/v1/topics/${id_topic}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Jika endpoint perlu token
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setMaterials((prev) =>
          prev.filter((item) => item.id_topic !== id_topic)
        );
        alert(`Materi "${title}" berhasil dihapus.`);
      } else {
        const err = await response.json();
        alert(`Gagal menghapus materi: ${err.message}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Terjadi kesalahan saat menghapus materi.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <Sidebar className="w-full lg:w-64 h-auto lg:h-screen bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      <div className="2xl:ml-30 p-6 w-full">
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Page
          </span>
          <span className="bg-red-700 text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Material
          </span>
        </div>

        <button
          className="px-4 py-2 bg-[#A70000] text-white rounded-md shadow hover:bg-red-600 transition"
          onClick={() => setIsModalOpen(true)}
        >
          Add Course
        </button>
        <button
          className="ml-4 px-4 py-2 bg-[#A70000] text-white rounded-md shadow hover:bg-red-600 transition"
          onClick={() => setIsQuizModalOpen(true)}
        >
          Add Quiz
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-6">
          {filteredCourses.map((course, index) => (
            <TrainCard
              key={index}
              title={course.title}
              author={`User ${course.created_by}`}
              level={course.level}
              duration={`${course.duration}`}
              image={
                course.picture
                  ? `http://localhost:3001/uploads/${course.picture
                      .split("\\")
                      .pop()}`
                  : "/default-image.jpg"
              }
              route={`/adminCourses/${course.id_topic}`}
              onDelete={() => handleDelete(course.id_topic, course.title)}
            />
          ))}
        </div>

        <MaterialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          newProgram={newProgram}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          materials={materials}
          onSave={handleSaveQuiz}
        />
      </div>
    </div>
  );
};

export default AdminMaterial;

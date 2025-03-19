"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock, Signal } from "lucide-react";
import Sidebar from "@/adminComponents/Sidebar";

const TrainCard = ({
  title,
  author,
  level,
  duration,
  image,
  route,
  onDelete,
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
            <span>{duration}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={route} className="w-full">
            <button className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
              Open Programs
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

const AdminProgram = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [newProgram, setNewProgram] = useState({
    title: "",
    author: "",
    level: "",
    duration: "",
    image: "",
    route: "",
  });

  const courses = Array.from({ length: 34 }, (_, index) => ({
    title: `Materi ${index + 1}`,
    author: `Pengajar ${index + 1}`,
    level:
      index % 3 === 0
        ? "Beginner"
        : index % 3 === 1
        ? "Intermediate"
        : "Advanced",
    duration: `${90 + (index % 5) * 30} Menit`,
    image: `/assets/car${(index % 3) + 1}.jpg`,
    route: `/courses/materi-${index + 1}`,
  }));

  // Filter berdasarkan search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes for new program
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit for new program
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new program to courses (or handle API request)
    console.log("New Program Added: ", newProgram);
    setIsModalOpen(false); // Close the modal after adding
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar className="w-full lg:w-64 h-auto lg:h-screen bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      {/* Container utama */}
      <div className="2xl:ml-64 p-6 w-full">
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Page
          </span>
          <span className="bg-red-700 text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Program
          </span>
        </div>

        {/* Header dan Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Programs Available
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
              onClick={() => setIsModalOpen(true)} // Open modal
            >
              Add Program
            </button>
            <input
              type="text"
              placeholder="Search Program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-full md:w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Grid Cards Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCourses.map((course, index) => (
            <TrainCard key={index} {...course} />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New Program</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newProgram.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                  type="text"
                  name="author"
                  value={newProgram.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <input
                  type="text"
                  name="level"
                  value={newProgram.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={newProgram.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newProgram.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Route</label>
                <input
                  type="text"
                  name="route"
                  value={newProgram.route}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Add Program
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  onClick={() => setIsModalOpen(false)} // Close modal
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProgram;

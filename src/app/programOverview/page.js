"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock, Signal } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const TrainCard = ({ title, author, level, duration, image, route }) => {
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
        <Link href={route}>
          <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition">
            Open Programs
          </button>
        </Link>
      </div>
    </div>
  );
};

const CardsContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = Array.from({ length: 34 }, (_, index) => ({
    title: `Materi ${index + 1}`,
    author: `Pengajar ${index + 1}`,
    level: index % 3 === 0 ? "Beginner" : index % 3 === 1 ? "Intermediate" : "Advanced",
    duration: `${90 + (index % 5) * 30} Menit`,
    image: `/assets/car${(index % 3) + 1}.jpg`,
    route: `/courses/materi-${index + 1}`,
  }));

  // Filter berdasarkan search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar className="w-full lg:w-64 h-auto lg:h-screen bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      {/* Container utama */}
      <div className="2xl:ml-64 p-6 w-full">
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Program Overview
          </span>
        </div>

        {/* Header dan Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Programs Available
          </h1>
          <input
            type="text"
            placeholder="Search Program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full md:w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Grid Cards Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCourses.map((course, index) => (
            <TrainCard key={index} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardsContainer;
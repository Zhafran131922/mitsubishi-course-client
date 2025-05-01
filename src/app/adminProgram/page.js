"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Clock, Wifi, MapPin, Award, Users, Presentation, BookOpen, Clipboard, Filter, Trash2, Edit, Plus } from "lucide-react";
import Sidebar from "@/adminComponents/Sidebar";

const ProgramCard = ({ program, onDelete, onEdit }) => {
  const getActivityIcon = () => {
    switch(program.type) {
      case 'Contest':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'Workshop':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'Presentation':
        return <Presentation className="w-5 h-5 text-purple-600" />;
      case 'Training':
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case 'Assessment':
        return <Clipboard className="w-5 h-5 text-red-600" />;
      default:
        return program.isOnline ? <Wifi className="w-5 h-5 text-blue-600" /> : <MapPin className="w-5 h-5 text-red-600" />;
    }
  };

  const getApplicationBadge = (app) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1";
    
    if (app.includes("Teams") || app.includes("Zoom")) {
      return <span className={`${baseClass} bg-blue-100 text-blue-800`}>{app}</span>;
    } else if (app.includes("LMS")) {
      return <span className={`${baseClass} bg-purple-100 text-purple-800`}>{app}</span>;
    } else {
      return <span className={`${baseClass} bg-gray-100 text-gray-800`}>{app}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] flex flex-col h-full border border-gray-200">
      {program.image && (
        <div className="relative w-full h-40">
          <Image src={program.image} alt={program.title} layout="fill" objectFit="cover" />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
            program.isOnline ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            {program.isOnline ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>Online</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3" />
                <span>Offline</span>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3">
          {getActivityIcon()}
          <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
            program.type === 'Contest' ? 'bg-yellow-100 text-yellow-800' :
            program.type === 'Workshop' ? 'bg-blue-100 text-blue-800' :
            program.type === 'Presentation' ? 'bg-purple-100 text-purple-800' :
            program.type === 'Training' ? 'bg-green-100 text-green-800' :
            program.type === 'Assessment' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {program.type || (program.isOnline ? 'Online Program' : 'Offline Program')}
          </span>
        </div>
        
        <h2 className="text-lg font-bold">{program.title}</h2>
        
        {!program.isOnline && program.location && (
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            <span>{program.location}</span>
          </div>
        )}
        
        <div className="mt-3 mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>{program.duration}</span>
          </div>
          
          {program.isOnline && program.application && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Platform:</p>
              <div className="flex flex-wrap">
                {program.application.split(",").map((app, i) => (
                  getApplicationBadge(app.trim())
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onEdit(program)}
            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(program)}
            className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md font-medium transition flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProgram = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    delivery: "all", // all, online, offline
    type: "all" // all, contest, workshop, etc.
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [programs, setPrograms] = useState([
    // Online Programs
    {
      id: 1,
      title: "Annual Theory Test Competition",
      type: "Contest",
      duration: "120 Minutes",
      application: "MOODLE (LMS)",
      route: "/programs/contest-theory-test",
      isOnline: true,
      image: "/assets/car1.jpg"
    },
    {
      id: 2,
      title: "UI/UX Design Workshop",
      type: "Workshop",
      duration: "180 Minutes",
      application: "Microsoft Teams, Zoom",
      route: "/programs/design-workshop",
      isOnline: true,
      image: "/assets/car2.jpg"
    },
    {
      id: 3,
      title: "Product Innovation Presentation",
      type: "Presentation",
      duration: "90 Minutes",
      application: "Zoom",
      route: "/programs/innovation-presentation",
      isOnline: true,
      image: "/assets/car3.jpg"
    },
    {
      id: 4,
      title: "New Product Knowledge Training",
      type: "Training",
      duration: "240 Minutes",
      application: "Microsoft Teams, LMS",
      route: "/programs/product-training",
      isOnline: true,
      image: "/assets/car2.jpg"
    },
    // Offline Programs
    {
      id: 5,
      title: "Hands-on Technical Workshop",
      type: "Workshop",
      duration: "Full Day",
      route: "/programs/technical-workshop",
      isOnline: false,
      location: "Jakarta Main Campus, Room 301",
      image: "/assets/car3.jpg"
    },
    {
      id: 6,
      title: "Annual Product Exhibition",
      type: "Exhibition",
      duration: "2 Days",
      route: "/programs/product-exhibition",
      isOnline: false,
      location: "Convention Center, Central Jakarta",
      image: "/assets/car2.jpg"
    },
    {
      id: 7,
      title: "Leadership Training Program",
      type: "Training",
      duration: "3 Days",
      route: "/programs/leadership-training",
      isOnline: false,
      location: "Bandung Training Center",
      image: "/assets/car1.jpg"
    },
    {
      id: 8,
      title: "Final Project Presentation",
      type: "Presentation",
      duration: "4 Hours",
      route: "/programs/final-presentation",
      isOnline: false,
      location: "Surabaya Campus, Auditorium",
      image: "/assets/car2.jpg"
    }
  ]);

  const filteredPrograms = programs.filter((program) => {
    // Filter by search term
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by delivery method
    const matchesDelivery = 
      filter.delivery === "all" || 
      (filter.delivery === "online" && program.isOnline) || 
      (filter.delivery === "offline" && !program.isOnline);
    
    // Filter by type
    const matchesType = filter.type === "all" || program.type === filter.type;
    
    return matchesSearch && matchesDelivery && matchesType;
  });

  const programTypes = [...new Set(programs.map(program => program.type))];
  const onlineCount = programs.filter(p => p.isOnline).length;
  const offlineCount = programs.filter(p => !p.isOnline).length;

  const handleDelete = (program) => {
    if (confirm(`Are you sure you want to delete "${program.title}"?`)) {
      setPrograms(programs.filter(p => p.id !== program.id));
    }
  };

  const handleEdit = (program) => {
    setCurrentProgram(program);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProgram(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProgramData = {
      id: currentProgram?.id || Math.max(...programs.map(p => p.id), 0) + 1,
      title: formData.get('title'),
      type: formData.get('type'),
      duration: formData.get('duration'),
      application: formData.get('application'),
      route: formData.get('route'),
      isOnline: formData.get('isOnline') === 'true',
      location: formData.get('location'),
      image: formData.get('image')
    };

    if (currentProgram) {
      // Update existing program
      setPrograms(programs.map(p => p.id === currentProgram.id ? newProgramData : p));
    } else {
      // Add new program
      setPrograms([...programs, newProgramData]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar className="w-full lg:w-30 h-auto lg:h-screen bg-gray-800 text-white fixed lg:relative top-0 left-0" />

      <div className="lg:ml-30 p-6 w-full">
        <div className="flex items-center mb-6">
          <span className="bg-black text-white px-4 py-2 text-sm font-bold transform -skew-x-12">
            ☰ Admin Page
          </span>
          <span className="bg-[#A70000] text-white px-4 py-2 text-sm font-bold transform -skew-x-12 ml-0">
            Program
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Manage Programs
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-[#A70000] text-white rounded-md shadow hover:bg-red-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Program
            </button>
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-full md:w-72 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filter Programs</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {/* Delivery Method Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Method</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilter({...filter, delivery: "all"})}
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                    filter.delivery === "all" 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <span>All</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    {programs.length}
                  </span>
                </button>
                
                <button 
                  onClick={() => setFilter({...filter, delivery: "online"})}
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                    filter.delivery === "online" 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  <span>Online</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {onlineCount}
                  </span>
                </button>
                
                <button 
                  onClick={() => setFilter({...filter, delivery: "offline"})}
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                    filter.delivery === "offline" 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Offline</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">
                    {offlineCount}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Program Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Program Type</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilter({...filter, type: "all"})}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter.type === "all" 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  All Types
                </button>
                
                {programTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter({...filter, type})}
                    className={`px-3 py-1 text-sm rounded-md ${
                      filter.type === type
                        ? type === 'Contest' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          type === 'Workshop' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          type === 'Presentation' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          type === 'Training' ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          Showing {filteredPrograms.length} of {programs.length} programs
          {(filter.delivery !== "all" || filter.type !== "all") && (
            <span className="ml-2">
              (Filtered: 
              {filter.delivery !== "all" && ` ${filter.delivery}`}
              {filter.type !== "all" && ` ${filter.type}`})
            </span>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard 
                key={program.id} 
                program={program} 
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-500">No programs found</h3>
            <p className="text-gray-400 mt-1">
              {searchTerm 
                ? `Try a different search term or reset filters`
                : (filter.delivery !== "all" || filter.type !== "all")
                  ? `No programs match your filters`
                  : "No programs available"}
            </p>
            {(searchTerm || filter.delivery !== "all" || filter.type !== "all") && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilter({ delivery: "all", type: "all" });
                }}
                className="mt-4 px-4 py-2 bg-[#A70000] text-white rounded-md hover:bg-red-700 text-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {currentProgram ? "Edit Program" : "Add New Program"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={currentProgram?.title || ""}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
                  <select
                    name="type"
                    defaultValue={currentProgram?.type || ""}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Type</option>
                    <option value="Contest">Contest</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Training">Training</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Exhibition">Exhibition</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration*</label>
                  <input
                    type="text"
                    name="duration"
                    defaultValue={currentProgram?.duration || ""}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method*</label>
                  <select
                    name="isOnline"
                    defaultValue={currentProgram?.isOnline ? "true" : "false"}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="true">Online</option>
                    <option value="false">Offline</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform (if online)</label>
                  <input
                    type="text"
                    name="application"
                    defaultValue={currentProgram?.application || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Zoom, Microsoft Teams"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (if offline)</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={currentProgram?.location || ""}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Main Campus, Room 101"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route*</label>
                  <input
                    type="text"
                    name="route"
                    defaultValue={currentProgram?.route || ""}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., /programs/program-name"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL*</label>
                  <input
                    type="text"
                    name="image"
                    defaultValue={currentProgram?.image || ""}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., /assets/program.jpg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#A70000] text-white rounded-md hover:bg-red-700"
                >
                  {currentProgram ? "Update Program" : "Add Program"}
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
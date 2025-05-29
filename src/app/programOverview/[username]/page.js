"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Wifi,
  MapPin,
  Award,
  Users,
  Presentation,
  BookOpen,
  Clipboard,
  Filter,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const ProgramCard = ({ program }) => {
  const getActivityIcon = () => {
    switch (program.type) {
      case "Contest":
        return <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />;
      case "Workshop":
        return <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
      case "Presentation":
        return (
          <Presentation className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
        );
      case "Training":
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
      case "Assessment":
        return <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
      default:
        return program.isOnline ? (
          <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        ) : (
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
        );
    }
  };

  const getApplicationBadge = (app, key) => {
    const baseClass = "px-2 py-1 rounded-full text-xs font-medium mr-1 mb-1";

    if (app.includes("Teams") || app.includes("Zoom")) {
      return (
        <span key={key} className={`${baseClass} bg-blue-100 text-blue-800`}>
          {app}
        </span>
      );
    } else if (app.includes("LMS")) {
      return (
        <span
          key={key}
          className={`${baseClass} bg-purple-100 text-purple-800`}
        >
          {app}
        </span>
      );
    } else {
      return (
        <span key={key} className={`${baseClass} bg-gray-100 text-gray-800`}>
          {app}
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden transition-transform hover:scale-[1.02] flex flex-col h-full border border-gray-200">
      {program.image && (
        <div className="relative w-full h-32 sm:h-40">
          <Image
            src={program.image}
            alt={program.title}
            layout="fill"
            objectFit="cover"
            className="transition-opacity opacity-0 duration-300"
            onLoadingComplete={(image) => image.classList.remove("opacity-0")}
          />
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${
              program.isOnline
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {program.isOnline ? (
              <>
                <Wifi className="w-3 h-3" />
                <span className="hidden xs:inline">Online</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3" />
                <span className="hidden xs:inline">Offline</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          {getActivityIcon()}
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md ${
              program.type === "Contest"
                ? "bg-yellow-100 text-yellow-800"
                : program.type === "Workshop"
                ? "bg-blue-100 text-blue-800"
                : program.type === "Presentation"
                ? "bg-purple-100 text-purple-800"
                : program.type === "Training"
                ? "bg-green-100 text-green-800"
                : program.type === "Assessment"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {program.type || (program.isOnline ? "Online" : "Offline")}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-bold line-clamp-2">
          {program.title}
        </h2>

        {!program.isOnline && program.location && (
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm mt-1">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="line-clamp-1">{program.location}</span>
          </div>
        )}

        <div className="mt-2 sm:mt-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{program.duration}</span>
          </div>

          {program.isOnline && program.application && (
            <div className="mt-1 sm:mt-2">
              <p className="text-xs text-gray-500 mb-1">Platform:</p>
              <div className="flex flex-wrap">
                {program.application
                  .split(",")
                  .map((app, i) => getApplicationBadge(app.trim(), i))}
              </div>
            </div>
          )}
        </div>

        <Link href={program.route} className="mt-auto">
          <button
            className={`w-full py-1.5 sm:py-2 rounded-md text-sm sm:text-base font-medium transition ${
              program.isOnline
                ? "bg-[#A70000] hover:bg-blue-700 text-white"
                : "bg-[#A70000] hover:bg-red-700 text-white"
            }`}
          >
            {program.isOnline ? "Join Online" : "Join Offline"}
          </button>
        </Link>
      </div>
    </div>
  );
};

const ProgramOverview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [filter, setFilter] = useState({
    delivery: "all",
    type: "all",
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allPrograms = [

    {
      title: "Annual Theory Test Competition",
      type: "Contest",
      duration: "120 Minutes",
      application: "MOODLE (LMS)",
      route: "/programs/contest-theory-test",
      isOnline: true,
      image: "/assets/car1.jpg",
    },
    {
      title: "UI/UX Design Workshop",
      type: "Workshop",
      duration: "180 Minutes",
      application: "Microsoft Teams, Zoom",
      route: "/programs/design-workshop",
      isOnline: true,
      image: "/assets/car2.jpg",
    },
    {
      title: "Product Innovation Presentation",
      type: "Presentation",
      duration: "90 Minutes",
      application: "Zoom",
      route: "/programs/innovation-presentation",
      isOnline: true,
      image: "/assets/car3.jpg",
    },
    {
      title: "New Product Knowledge Training",
      type: "Training",
      duration: "240 Minutes",
      application: "Microsoft Teams, LMS",
      route: "/programs/product-training",
      isOnline: true,
      image: "/assets/car2.jpg",
    },
    // Offline Programs
    {
      title: "Hands-on Technical Workshop",
      type: "Workshop",
      duration: "Full Day",
      route: "/programs/technical-workshop",
      isOnline: false,
      location: "Jakarta Main Campus, Room 301",
      image: "/assets/car3.jpg",
    },
    {
      title: "Annual Product Exhibition",
      type: "Exhibition",
      duration: "2 Days",
      route: "/programs/product-exhibition",
      isOnline: false,
      location: "Convention Center, Central Jakarta",
      image: "/assets/car2.jpg",
    },
    {
      title: "Leadership Training Program",
      type: "Training",
      duration: "3 Days",
      route: "/programs/leadership-training",
      isOnline: false,
      location: "Bandung Training Center",
      image: "/assets/car1.jpg",
    },
    {
      title: "Final Project Presentation",
      type: "Presentation",
      duration: "4 Hours",
      route: "/programs/final-presentation",
      isOnline: false,
      location: "Surabaya Campus, Auditorium",
      image: "/assets/car2.jpg",
    },
  ];

  const filteredPrograms = allPrograms.filter((program) => {
    const matchesSearch = program.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDelivery =
      filter.delivery === "all" ||
      (filter.delivery === "online" && program.isOnline) ||
      (filter.delivery === "offline" && !program.isOnline);
    const matchesType = filter.type === "all" || program.type === filter.type;

    return matchesSearch && matchesDelivery && matchesType;
  });

  const programTypes = [...new Set(allPrograms.map((program) => program.type))];
  const onlineCount = allPrograms.filter((p) => p.isOnline).length;
  const offlineCount = allPrograms.filter((p) => !p.isOnline).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <Sidebar
        onExpand={setSidebarExpanded}
        className="w-full lg:w-30 h-auto lg:h-screen bg-gray-800 text-white fixed lg:relative top-0 left-0 z-20"
      />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarExpanded ? "lg:ml-70" : "lg:ml-30"
        } pt-4 sm:pt-6 pb-6 px-4 sm:px-6`}
      >
        <div className="flex items-center mb-4 sm:mb-6">
          <span className="bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transform -skew-x-12">
            ☰ All Programs
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">Available Programs</h1>

          <div className="w-full md:w-auto flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center gap-2 mb-4 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium shadow-sm"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {(filter.delivery !== "all" || filter.type !== "all") && (
            <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
              {
                [filter.delivery !== "all", filter.type !== "all"].filter(
                  Boolean
                ).length
              }
            </span>
          )}
        </button>

        {/* Filter Section */}
        <div
          className={`${
            mobileFiltersOpen ? "block" : "hidden"
          } lg:block mb-6 bg-white sm:bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm sm:shadow-none border border-gray-200 sm:border-none`}
        >
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">
              Filter Programs
            </span>
            {mobileFiltersOpen && (
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
            {/* Delivery Method Filter */}
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Delivery Method
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter({ ...filter, delivery: "all" })}
                  className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1 ${
                    filter.delivery === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  <span>All</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    {allPrograms.length}
                  </span>
                </button>

                <button
                  onClick={() => setFilter({ ...filter, delivery: "online" })}
                  className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1 ${
                    filter.delivery === "online"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Online</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {onlineCount}
                  </span>
                </button>

                <button
                  onClick={() => setFilter({ ...filter, delivery: "offline" })}
                  className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md flex items-center gap-1 ${
                    filter.delivery === "offline"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Offline</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">
                    {offlineCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Program Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Program Type
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter({ ...filter, type: "all" })}
                  className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md ${
                    filter.type === "all"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  All Types
                </button>

                {programTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilter({ ...filter, type })}
                    className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-md ${
                      filter.type === type
                        ? type === "Contest"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : type === "Workshop"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : type === "Presentation"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : type === "Training"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500">
          Showing {filteredPrograms.length} of {allPrograms.length} programs
          {(filter.delivery !== "all" || filter.type !== "all") && (
            <span className="ml-1 sm:ml-2">
              (Filtered:
              {filter.delivery !== "all" && ` ${filter.delivery}`}
              {filter.type !== "all" && ` ${filter.type}`})
            </span>
          )}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {filteredPrograms.length > 0 ? (
          <div
            className={`grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 ${
              sidebarExpanded
                ? "lg:grid-cols-3 xl:grid-cols-4"
                : "lg:grid-cols-4 xl:grid-cols-5"
            } gap-4 sm:gap-6`}
          >
            {filteredPrograms.map((program, index) => (
              <ProgramCard key={index} program={program} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-white sm:bg-gray-50 rounded-lg shadow-sm sm:shadow-none border border-gray-200 sm:border-none">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">
              No programs found
            </h3>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              {searchTerm
                ? `Try a different search term or reset filters`
                : filter.delivery !== "all" || filter.type !== "all"
                ? `No programs match your filters`
                : "No programs available"}
            </p>
            {(searchTerm ||
              filter.delivery !== "all" ||
              filter.type !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter({ delivery: "all", type: "all" });
                }}
                className="mt-3 sm:mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramOverview;

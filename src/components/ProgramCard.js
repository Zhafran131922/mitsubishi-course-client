"use client";

import React from "react";
import Image from "next/image";
import {
  Clock,
  Wifi,
  MapPin,
  Award,
  Users,
  Presentation,
  BookOpen,
  Clipboard,
} from "lucide-react";

const ProgramCard = ({ program, onClick }) => {
  const getActivityIcon = () => {
    switch (program.type) {
      case "Contest":
        return <Award className="w-5 h-5 text-yellow-600" />;
      case "Workshop":
        return <Users className="w-5 h-5 text-blue-600" />;
      case "Presentation":
        return <Presentation className="w-5 h-5 text-purple-600" />;
      case "Training":
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case "Assessment":
        return <Clipboard className="w-5 h-5 text-red-600" />;
      default:
        return program.isOnline ? (
          <Wifi className="w-5 h-5 text-blue-600" />
        ) : (
          <MapPin className="w-5 h-5 text-red-600" />
        );
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(program);
  };

  const handleJoinClick = (e) => {
    e.stopPropagation();
    // Add your join logic here
    alert(`Joining ${program.isOnline ? 'Online' : 'Offline'} program: ${program.title}`);
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
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] flex flex-col h-full border border-gray-200 cursor-pointer"
      onClick={handleCardClick}
    >
      {program.image && (
        <div className="relative w-full h-40">
          <Image
            src={program.image}
            alt={program.title}
            layout="fill"
            objectFit="cover"
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

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3">
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
            {program.type ||
              (program.isOnline ? "Online Program" : "Offline Program")}
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
                {program.application
                  .split(",")
                  .map((app, i) => getApplicationBadge(app.trim(), i))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleCardClick}
          className={`mt-auto w-full py-2 rounded-md font-medium transition ${
            program.isOnline
              ? "bg-black hover:bg-gray-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {program.isOnline ? "Join Online" : "Join Offline"}
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
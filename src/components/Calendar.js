"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredEvents, setHoveredEvents] = useState([]);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const calendarRef = useRef(null);
  const [storedUser, setStoredUser] = useState(null);

  // Get current date values
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days array
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const days = generateCalendarDays();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("Token not found in localStorage");
        }
        
        const headers = {
          "Authorization": `Bearer ${token}`
        };

        // Fetch deadline topics
        const deadlineResponse = await fetch(
          "https://duanol.mitsubishi-training.my.id/api/v1/topics/deadline", 
          { headers }
        );
        
        if (!deadlineResponse.ok) {
          throw new Error("Failed to fetch deadlines");
        }
        
        const deadlineData = await deadlineResponse.json();
        
        const deadlines = deadlineData.data
          .filter(d => d.deadline)
          .map(d => {
            const datePart = d.deadline.includes('T') 
              ? d.deadline.split('T')[0]
              : d.deadline;
            return {
              ...d,
              type: "deadline",
              date: datePart
            };
          });

        // Fetch program dates
        const programResponse = await fetch(
          "https://duanol.mitsubishi-training.my.id/api/v1/program/date", 
          { headers }
        );
        
        if (!programResponse.ok) {
          throw new Error("Failed to fetch programs");
        }
        
        const programData = await programResponse.json();
        const programs = programData.data
          .filter(p => p.date_program)
          .map(p => ({
            ...p,
            type: "program",
            date: p.date_program
          }));

        // Combine events
        setEvents([...deadlines, ...programs]);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get events for the current month
  const getEventsForMonth = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === month && 
        eventDate.getFullYear() === year
      );
    });
  };

  // Get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  // Check if a day has events
  const hasEvents = (day) => {
    return getEventsForDay(day).length > 0;
  };

  // Format date for display
  const formatDateDisplay = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      });
    } catch {
      return "Invalid date";
    }
  };

  // Handle hover over a day
  const handleDayHover = (day, e) => {
    if (!day) return;
    
    const events = getEventsForDay(day);
    if (events.length > 0) {
      setHoveredDay(day);
      setHoveredEvents(events);
      
      // Get position relative to calendar container
      const rect = calendarRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredDay(null);
    setHoveredEvents([]);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setStoredUser(JSON.parse(user));
    }
  }, []);

  // Navigate to event details
  const navigateToEvent = (event) => {
    if (event.type === "deadline") {
      router.push(`/courses/topicId?id=${event.id}`);
    } else {
      router.push(`/programDetail?id=${event.id}`);
    }
  };

  const monthEvents = getEventsForMonth();

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Calendar Section - Modern Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl p-6 backdrop-blur-sm"
      >
        {/* Header with Glass Morphism */}
        <div className="flex justify-between items-center mb-6 p-4 bg-white/80 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all hover:shadow-md"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all hover:shadow-md"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Legend with Pills */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <span className="text-xs font-medium text-gray-500">LEGENDS:</span>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-blue-700">Program</span>
          </div>
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs text-red-700">Deadline</span>
          </div>
        </div>

        {/* Days of week - Modern */}
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-4">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid - Animated */}
        <div 
          ref={calendarRef}
          className="grid grid-cols-7 gap-2 text-center relative"
          onMouseLeave={handleMouseLeave}
        >
          {days.map((day, index) => {
            const isToday = 
              day === today.getDate() && 
              month === today.getMonth() && 
              year === today.getFullYear();
            
            const dayEvents = getEventsForDay(day);
            const hasDeadline = dayEvents.some(e => e.type === "deadline");
            const hasProgram = dayEvents.some(e => e.type === "program");
            
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`relative h-14 flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                  isToday
                    ? "bg-gradient-to-r from-red-500 to-red-800 text-white shadow-lg"
                    : day
                    ? "hover:bg-gray-50 text-gray-700 border border-gray-100"
                    : "text-gray-300"
                }`}
                onMouseMove={(e) => handleDayHover(day, e)}
              >
                {day}
                {hasEvents(day) && (
                  <div className="flex justify-center mt-1 space-x-1">
                    {hasDeadline && (
                      <motion.div 
                        animate={{ scale: [0.8, 1.1, 1] }}
                        className="w-2 h-2 rounded-full bg-red-500"
                      ></motion.div>
                    )}
                    {hasProgram && (
                      <motion.div 
                        animate={{ scale: [0.8, 1.1, 1] }}
                        className="w-2 h-2 rounded-full bg-blue-500"
                      ></motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {/* Animated Tooltip */}
          <AnimatePresence>
            {hoveredDay && hoveredEvents.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-10 min-w-[240px] backdrop-blur-sm"
                style={{
                  left: `${tooltipPosition.x + 10}px`,
                  top: `${tooltipPosition.y + 10}px`,
                }}
              >
                <div className="text-sm font-bold text-gray-800 mb-2">
                  {hoveredDay} {currentDate.toLocaleString("default", { month: "short" })}
                </div>
                <div className="space-y-2">
                  {hoveredEvents.map(event => (
                    <motion.div 
                      key={`${event.id}-${event.type}`}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-start p-3 rounded-lg cursor-pointer ${
                        event.type === "deadline" 
                          ? "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400" 
                          : "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400"
                      } transition-all`}
                      onClick={() => navigateToEvent(event)}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{event.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.type === "deadline" ? "Deadline Materi" : "Tanggal Program"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Upcoming Events Section - Card Style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full lg:w-96 bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-red-500 to-red-800 text-white p-5">

          <h3 className="text-xl font-bold">Upcoming Events</h3>
          <p className="text-sm text-white/90 mt-1">
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </p>
        </div>
        
        <div className="p-5">
          {/* Loading state */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-100 border-t-indigo-500 mx-auto"></div>
              <p className="mt-3 text-gray-500">Loading events...</p>
            </motion.div>
          )}
          
          {/* Error state */}
          {error && (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4"
            >
              <p className="text-red-600 text-sm font-medium">Error: {error}</p>
              <p className="text-red-500 text-xs mt-1">
                Please check your connection and try again
              </p>
            </motion.div>
          )}
          
          {/* Event Items - Modern Cards */}
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
            {monthEvents.length === 0 && !loading && !error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <p className="text-gray-500">No events scheduled this month</p>
              </motion.div>
            )}
            
            {monthEvents.map((event, index) => (
              <motion.div 
                key={`${event.id}-${event.type}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ translateX: 5 }}
                className="group bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => navigateToEvent(event)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    event.type === "deadline" 
                      ? "bg-red-100 text-red-600" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {event.type === "deadline" ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h5>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {formatDateDisplay(event.date)} • {event.type === "deadline" ? "Deadline" : "Program"}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    event.type === "deadline" 
                      ? "bg-red-50 text-red-600" 
                      : "bg-blue-50 text-blue-600"
                  }`}>
                    {event.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Calendar;
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const Calendar = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventSidebar, setShowEventSidebar] = useState(true);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredEvents, setHoveredEvents] = useState([]);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const calendarRef = useRef(null);
  const [storedUser, setStoredUser] = useState(null);


  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

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
          "http://localhost:3001/api/v1/topics/deadline", 
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
          "http://localhost:3001/api/v1/program/date", 
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

  const toggleEventSidebar = () => {
    setShowEventSidebar(!showEventSidebar);
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
    // Hanya dijalankan di client
    const user = localStorage.getItem("user");
    if (user) {
      setStoredUser(JSON.parse(user));
    }
  }, []);

  // Navigate to event details
  const navigateToEvent = (event) => {
    if (event.type === "deadline") {
      router.push(`/courses/${event.id}/${storedUser.username}`);
    } else {
      router.push(`/programDetail?id=${event.id}`);
    }
  };

  const monthEvents = getEventsForMonth();
  const today = new Date();

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[500px] w-full bg-white shadow-md rounded-md">
      {/* Calendar Side */}
      <div className="flex-1 flex flex-col p-4 lg:p-6">
        <div className="w-full bg-white rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 lg:mb-6 text-gray-700">
            <div>
              <h3 className="text-xl lg:text-2xl font-semibold">
                {currentDate.toLocaleString("default", { month: "long" })} {year}
              </h3>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <div className="flex items-center mr-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Deadline Materi</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Tanggal Program</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1 lg:p-2 rounded hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 lg:p-2 rounded hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={toggleEventSidebar}
                className="lg:hidden p-1 rounded hover:bg-gray-100"
              >
                {showEventSidebar ? "Hide Events" : "Show Events"}
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 text-center text-sm lg:text-base text-gray-600 font-medium mb-2 lg:mb-4">
            {daysOfWeek.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div 
            ref={calendarRef}
            className="grid grid-cols-7 gap-1 lg:gap-2 text-center relative"
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
                <div
                  key={index}
                  className={`relative h-10 w-10 flex flex-col items-center justify-center rounded-full text-sm lg:text-base ${
                    isToday
                      ? "bg-blue-600 text-white"
                      : day
                      ? "hover:bg-gray-100 text-gray-700"
                      : ""
                  }`}
                  onMouseMove={(e) => handleDayHover(day, e)}
                >
                  {day}
                  {hasEvents(day) && (
                    <div className="flex justify-center mt-1">
                      {hasDeadline && (
                        <div 
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            isToday ? "bg-white" : "bg-red-500"
                          }`}
                        />
                      )}
                      {hasProgram && (
                        <div 
                          className={`w-2 h-2 rounded-full mx-0.5 ${
                            isToday ? "bg-white" : "bg-blue-500"
                          }`}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Tooltip for hovered day */}
            {hoveredDay && hoveredEvents.length > 0 && (
              <div 
                className="absolute bg-white border border-gray-200 shadow-lg rounded-lg p-3 z-10 min-w-[200px]"
                style={{
                  left: `${tooltipPosition.x + 10}px`,
                  top: `${tooltipPosition.y + 10}px`,
                }}
              >
                <div className="text-sm font-medium text-gray-800 mb-2">
                  {hoveredDay} {currentDate.toLocaleString("default", { month: "short" })}
                </div>
                <div className="space-y-2">
                  {hoveredEvents.map(event => (
                    <div 
                      key={`${event.id}-${event.type}`}
                      className={`flex items-start p-2 rounded ${
                        event.type === "deadline" 
                          ? "bg-red-50 border-l-4 border-red-500" 
                          : "bg-blue-50 border-l-4 border-blue-500"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{event.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {event.type === "deadline" ? "Deadline Materi" : "Tanggal Program"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Removed action buttons */}
        </div>
      </div>

      {/* Event List Side */}
      {showEventSidebar && (
        <div className="w-full lg:w-[300px] bg-[#0c0c1d] text-white p-4 lg:p-6 flex flex-col justify-between rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base lg:text-lg font-semibold">EVENTS</h4>
              <button
                onClick={toggleEventSidebar}
                className="lg:hidden text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* Loading state */}
            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                <p className="mt-2">Loading events...</p>
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded p-3 mb-4">
                <p className="text-red-300 text-sm">Error: {error}</p>
                <p className="text-red-200 text-xs mt-1">
                  Please check your token and try again
                </p>
              </div>
            )}
            
            {/* Event Items */}
            <div className="space-y-3 lg:space-y-4 max-h-[350px] overflow-y-auto">
              {monthEvents.length === 0 && !loading && !error && (
                <p className="text-white/70 text-center py-4">
                  No events scheduled for this month
                </p>
              )}
              
              {monthEvents.map(event => (
                <div 
                  key={`${event.id}-${event.type}`} 
                  className="border-b border-white/20 pb-3 lg:pb-3 text-sm lg:text-base cursor-pointer hover:bg-white/10 rounded-lg p-3 transition-all"
                  onClick={() => navigateToEvent(event)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{event.title}</h5>
                      <div className="flex items-center mt-1">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          event.type === "deadline" ? "bg-red-500" : "bg-blue-500"
                        }`}></span>
                        <span className="text-xs text-white/70">
                          {event.type === "deadline" ? "Deadline" : "Program"} • 
                          {formatDateDisplay(event.date)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.type === "deadline" 
                        ? "bg-red-900/30 text-red-300" 
                        : "bg-blue-900/30 text-blue-300"
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Removed bottom buttons */}
        </div>
      )}
    </div>
  );
};

export default Calendar;
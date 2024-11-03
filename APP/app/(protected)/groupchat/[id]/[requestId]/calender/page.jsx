"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";
import { Findgrouprole } from "@/actions/group";
import { createCalendy, getEvents } from "@/actions/calendy";

const Calendar = ({ params }) => {
  const groupId = params.id;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Initialize new event with proper structure
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    description: "",
    priority: {
      id: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    color: "bg-blue-500",
  });

  const priorities = [
    { id: "high", label: "High", color: "bg-red-100 text-red-800" },
    { id: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { id: "low", label: "Low", color: "bg-green-100 text-green-800" },
  ];

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedEvents = await getEvents(groupId);
        // Ensure events are properly formatted with dates
        const formattedEvents = fetchedEvents.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(formattedEvents || []); // Ensure we always set an array
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
        setEvents([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      fetchEvents();
    }
  }, [groupId]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const { isAdmin } = await Findgrouprole(groupId);
        setIsAdmin(isAdmin === true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setError("Failed to check admin status");
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      checkAdminStatus();
    }
  }, [groupId]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = 0; i < firstDay.getDay(); i++) {
      const day = new Date(year, month, -i);
      days.unshift(day);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Improved event filtering for date
  const getEventsForDate = (date) => {
    if (!Array.isArray(events)) return [];

    return events.filter((event) => {
      if (!event || !event.start) return false;

      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (date) => {
    const startDate = new Date(date);
    startDate.setHours(9, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(10, 0, 0);

    setNewEvent({
      ...newEvent,
      start: startDate,
      end: endDate,
    });
    setSelectedDate(date);
  };

  const handleAddEvent = async () => {
    if (!isAdmin || !newEvent.title.trim() || !newEvent.description.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const eventData = {
        ...newEvent,
        groupId,
        id: Date.now().toString(),
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
      };

      const success = await createCalendy(groupId, eventData);

      if (success) {
        setEvents((prevEvents) => [...(prevEvents || []), eventData]);
        setShowEventModal(false);
        setNewEvent({
          title: "",
          start: new Date(),
          end: new Date(),
          description: "",
          priority: {
            id: "medium",
            label: "Medium",
            color: "bg-yellow-100 text-yellow-800",
          },
          color: "bg-blue-500",
        });
        setError(null);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event");
    }
  };

  const formatDateForInput = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };
  setShowEventModal;

  const handleStartDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setNewEvent((prev) => ({
      ...prev,
      start: newDate,
      end: new Date(Math.max(newDate, prev.end)),
    }));
  };

  const handleEndDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setNewEvent((prev) => ({
      ...prev,
      end: newDate,
    }));
  };

  // Event component
  const EventItem = ({ event }) => {
    if (!event || !event.start) return null;

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const handleEventClick = (e) => {
      e.stopPropagation(); // Prevent the date cell click handler from firing
      setSelectedEvent(event);
      setShowEventDetailsModal(true);
    };

    return (
      <div className="relative">
        <div
          className={`${event.color} text-white text-sm p-2 rounded mb-1 cursor-pointer transition-all hover:opacity-90`}
          onClick={handleEventClick}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold truncate">{event.title}</div>
            <Info size={14} />
          </div>
          <div className="text-xs flex items-center gap-1">
            <Clock size={12} />
            {formatTime(event.start)}
          </div>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading calendar...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="text-red-500" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const EventDetailsModal = () => {
    if (!selectedEvent) return null;

    const formatDateTime = (date) => {
      return new Date(date).toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
            <button
              onClick={() => setShowEventDetailsModal(false)}
              className="text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Start:</strong> {formatDateTime(selectedEvent.start)}
            </p>
            <p>
              <strong>End:</strong> {formatDateTime(selectedEvent.end)}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            {selectedEvent.priority && (
              <p>
                <strong>Priority:</strong>{" "}
                <span
                  className={`${selectedEvent.priority.color} px-2 py-1 rounded`}
                >
                  {selectedEvent.priority.label}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white p-8">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setNewEvent({
                  ...newEvent,
                  start: new Date(),
                  end: new Date(new Date().setHours(new Date().getHours() + 1)),
                });
                setShowEventModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              Add Event
            </button>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold mb-2">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {getDaysInMonth(currentDate).map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();

            return (
              <div
                key={index}
                className={`min-h-24 p-2 rounded border border-white/10 ${
                  isCurrentMonth ? "bg-white/5" : "bg-white/5 opacity-50"
                } hover:bg-white/10 cursor-pointer transition-colors relative group`}
                onClick={() => handleDateClick(date)}
              >
                <div className="font-semibold mb-2 flex items-center justify-between">
                  <span>{date.getDate()}</span>
                  {isCurrentMonth && dayEvents.length > 0 && (
                    <span className="text-xs bg-white/20 px-2 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {dayEvents.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {isAdmin && showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add Event</h3>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-700 rounded border border-white/20"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Start
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 bg-gray-700 rounded border border-white/20"
                      value={formatDateForInput(newEvent.start)}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      End
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-2 bg-gray-700 rounded border border-white/20"
                      value={formatDateForInput(newEvent.end)}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 bg-gray-700 rounded border border-white/20"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    className="w-full p-2 bg-gray-700 rounded border border-white/20"
                    value={newEvent.priority?.id || ""}
                    onChange={(e) => {
                      const priority = priorities.find(
                        (p) => p.id === e.target.value
                      );
                      setNewEvent({ ...newEvent, priority });
                    }}
                  >
                    <option value="">Select Priority</option>
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {[
                      "bg-blue-500",
                      "bg-green-500",
                      "bg-red-500",
                      "bg-yellow-500",
                      "bg-purple-500",
                    ].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${color} ${
                          newEvent.color === color ? "ring-2 ring-white" : ""
                        }`}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddEvent}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
          {showEventDetailsModal && <EventDetailsModal />}
      </div>
    );
  };


export default Calendar;

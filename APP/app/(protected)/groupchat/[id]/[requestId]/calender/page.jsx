"use client"
import {
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Tag,
  Users,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Placeholder imports for actual server actions
import { createCalendy, getEvents } from "../../../../../../actions/calendy";
import { Findgrouprole } from "../../../../../../actions/group";

const Calendar = ({ params }) => {
  const groupId = params.id;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const priorities = [
    { id: "high", label: "High", color: "bg-red-100 text-red-800" },
    { id: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { id: "low", label: "Low", color: "bg-green-100 text-green-800" },
  ];

  const colorOptions = [
    { id: "blue", className: "bg-blue-500" },
    { id: "green", className: "bg-green-500" },
    { id: "red", className: "bg-red-500" },
    { id: "yellow", className: "bg-yellow-500" },
    { id: "purple", className: "bg-purple-500" },
  ];

  // Fetch events and admin status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [fetchedEvents, { isAdmin }] = await Promise.all([
          getEvents(groupId),
          Findgrouprole(groupId)
        ]);

        const formattedEvents = fetchedEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));

        setEvents(formattedEvents);
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setError("Failed to load calendar data");
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) fetchData();
  }, [groupId]);

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Event filtering
  const getEventsForDate = useCallback((date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (eventStart <= date && eventEnd >= date) ||
        eventStart.toDateString() === date.toDateString()
      );
    });
  }, [events]);

  // Corrected calendar grid calculation
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);

    const days = [];
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      days.push(currentDate);
    }

    return days;
  }, []);

  const handleAddNewEvent = useCallback((newEvent) => {
    setEvents(prev => [...prev, {
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
      id: Date.now().toString()
    }]);
  }, []);

  // Event Component
  const EventItem = ({ event }) => {
    const handleEventClick = () => {
      setSelectedEvent(event);
      setShowEventDetailsModal(true);
    };

    return (
      <div
        onClick={handleEventClick}
        className={`
          ${colorOptions.find(c => c.id === event.color)?.className || 'bg-blue-500'}
          text-white text-sm p-2 rounded mb-1 cursor-pointer
          hover:opacity-90 transition-all
        `}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold truncate">{event.title}</span>
          <Clock size={14} />
        </div>
      </div>
    );
  };

  // Add Event Modal Component
  const AddEventModal = ({ show, onClose, onAddEvent, isAdmin, groupId }) => {
    const [newEvent, setNewEvent] = useState({
      title: "",
      start: new Date(),
      end: new Date(),
      description: "",
      location: "",
      attendees: "",
      priority: "medium",
      color: "blue",
    });
    const [localError, setLocalError] = useState(null);

    const formatDateForInput = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async () => {
      try {
        if (!isAdmin) {
          setLocalError("You do not have permission to add events");
          return;
        }

        if (!newEvent.title.trim()) {
          setLocalError("Please fill in the event title");
          return;
        }

        if (newEvent.end < newEvent.start) {
          setLocalError("End date cannot be before start date");
          return;
        }

        const eventData = {
          ...newEvent,
          groupId,
          start: newEvent.start.toISOString(),
          end: newEvent.end.toISOString(),
        };

        const success = await createCalendy(groupId, eventData);

        if (success) {
          onAddEvent(eventData);
          onClose();
          setLocalError(null);
        }
      } catch (error) {
        console.error("Error adding event:", error);
        setLocalError("Failed to add event");
      }
    };

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white rounded-t-2xl border-b p-4 flex justify-between items-center z-10">
            <h3 className="text-xl font-bold text-gray-800">Add New Event</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors rounded-full p-1 hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {localError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <AlertCircle className="inline-block mr-2" />
                {localError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                value={newEvent.title}
                placeholder="Enter event title"
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start*</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                  value={formatDateForInput(newEvent.start)}
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev,
                    start: new Date(e.target.value),
                    end: new Date(Math.max(new Date(e.target.value), prev.end))
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End*</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                  value={formatDateForInput(newEvent.end)}
                  onChange={(e) => setNewEvent(prev => ({
                    ...prev,
                    end: new Date(e.target.value)
                  }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all min-h-[100px]"
                value={newEvent.description}
                placeholder="Enter event description"
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                  value={newEvent.location}
                  placeholder="Event location"
                  onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                  value={newEvent.attendees}
                  placeholder="Comma-separated emails"
                  onChange={(e) => setNewEvent(prev => ({ ...prev, attendees: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all"
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, priority: e.target.value }))}
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex gap-2 items-center">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      className={`
                        w-8 h-8 rounded-full ${color.className}
                        ${newEvent.color === color.id ? 'ring-2 ring-blue-500 scale-110' : 'hover:scale-110'}
                        transition-all
                      `}
                      onClick={() => setNewEvent(prev => ({ ...prev, color: color.id }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="
                w-full py-3 mt-4
                bg-blue-500 text-white rounded-lg
                hover:bg-blue-600
                transition-colors
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2
              "
            >
              <Plus size={20} /> Add Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading and Error States
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading calendar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="hover:bg-blue-100 p-2 rounded-full transition"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={goToNextMonth}
                className="hover:bg-blue-100 p-2 rounded-full transition"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowEventModal(true)}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-blue-500 text-white rounded-lg
                  hover:bg-blue-600 transition
                  shadow-md hover:shadow-lg
                "
              >
                <Plus size={20} /> Add Event
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Calendar Grid */}
        <div className="overflow-y-auto h-[600px]">
          <div className="grid grid-cols-7 gap-4 p-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-500"
              >
                {day}
              </div>
            ))}

            {getDaysInMonth(currentDate).map((date) => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={date.getTime()}
                  className={`
                    min-h-[120px] p-2 rounded-lg border
                    ${isCurrentMonth
                      ? 'bg-white border-gray-200 hover:border-blue-300'
                      : 'bg-gray-50 border-gray-100 opacity-50'}
                    transition cursor-pointer
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`
                        font-semibold
                        ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                      `}
                    >
                      {date.getDate()}
                    </span>
                    {isCurrentMonth && dayEvents.length > 0 && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 rounded-full">
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
        </div>
      </div>

      {/* Modals */}
      <AddEventModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        onAddEvent={handleAddNewEvent}
        isAdmin={isAdmin}
        groupId={groupId}
      />
      {showEventDetailsModal && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowEventDetailsModal(false)}
          priorities={priorities}
        />
      )}
    </div>
  );
};

// Memoized Event Details Modal
const EventDetailsModal = ({ event, onClose, priorities }) => {
  if (!event) return null;

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CalendarIcon size={20} className="text-gray-500" />
            <span>
              {formatDateTime(event.start)} - {formatDateTime(event.end)}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-500" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Tag size={20} className="text-gray-500" />
            <span
              className={`
                px-2 py-1 rounded
                ${priorities.find(p => p.id === event.priority)?.color || ''}
              `}
            >
              {priorities.find(p => p.id === event.priority)?.label} Priority
            </span>
          </div>
          {event.attendees && (
            <div className="flex items-center gap-3">
              <Users size={20} className="text-gray-500" />
              <span>{event.attendees}</span>
            </div>
          )}
          {event.description && (
            <p className="text-gray-600 mt-2">{event.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

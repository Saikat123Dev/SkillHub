'use client'
import React, { useState,useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import { Findgrouprole } from '@/actions/group';


const Calendar = ({params}) => {
  console.log('params',params);
  const groupId=params.id;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); 
  const [showEventModal, setShowEventModal] = useState(false);
  const[isAdmin,setisAdmin]=useState(false);
  const[isLoading,setisLoading]=useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      start: new Date(2024, 9, 26, 10, 0),
      end: new Date(2024, 9, 26, 11, 0),
      description: 'Weekly team sync',
      attendees: ['John Doe', 'Jane Smith'],
      priority: 'high',
      color: 'bg-blue-500'
    }
  ]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const {isAdmin} = await Findgrouprole(groupId)
        setisAdmin(isAdmin===true)
        if(isAdmin)
        console.log('admin',isAdmin );
      } catch (error) { 
        console.error('Error checking admin status:', error);
      } finally {
        setisLoading(false);
      }
    };

    checkAdminStatus();
  }, [groupId]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    attendees: [],
    priority: 'medium',
    color: 'bg-blue-500'
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Add previous month's days
    for (let i = 0; i < firstDay.getDay(); i++) {
      const day = new Date(year, month, -i);
      days.unshift(day);
    }
    
    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
   
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const days = [];
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i));
    }
    
    return days;
  };

  const getDayHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setDate(currentDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDateForInput = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  // Helper function to parse datetime-local input value
  const parseDateFromInput = (dateString) => {
    const date = new Date(dateString);
    return date;
  };

  const handleDateClick = (date) => {
    // Set the initial times for the new event
    const startDate = new Date(date);
    startDate.setHours(9, 0, 0); // Set default start time to 9:00 AM
    const endDate = new Date(date);
    endDate.setHours(10, 0, 0); // Set default end time to 10:00 AM

    setNewEvent({
      ...newEvent,
      start: startDate,
      end: endDate
    });
    setSelectedDate(date);
    setShowEventModal(true);
  };

  // Update the event modal input handlers
  const handleStartDateChange = (e) => {
    const newDate = parseDateFromInput(e.target.value);
    setNewEvent({ ...newEvent, start: newDate });
  };

  const handleEndDateChange = (e) => {
    const newDate = parseDateFromInput(e.target.value);
    setNewEvent({ ...newEvent, end: newDate });
  };


  const handleAddEvent = () => {
    if (newEvent.title.trim()) {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
      setShowEventModal(false);
      setNewEvent({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        attendees: [],
        priority: 'medium',
        color: 'bg-blue-500'
      });
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.start.getDate() === date.getDate() &&
      event.start.getMonth() === date.getMonth() &&
      event.start.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Calendar</h1>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded ${view === 'month' ? 'bg-white/20' : 'bg-white/10'}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button
                className={`px-4 py-2 rounded ${view === 'week' ? 'bg-white/20' : 'bg-white/10'}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={`px-4 py-2 rounded ${view === 'day' ? 'bg-white/20' : 'bg-white/10'}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handlePrevious}>
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl">
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                ...(view === 'day' && { day: 'numeric' })
              })}
            </h2>
            <button onClick={handleNext}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/10 rounded-xl backdrop-blur-lg p-6">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold">
                {day}
              </div>
            ))}
          </div>

          {view === 'month' && (
            <div className="grid grid-cols-7 gap-4">
              {getDaysInMonth(currentDate).map((date, index) => (
                <div
                  key={index}
                  className={`min-h-24 p-2 rounded border border-white/10 ${
                    date.getMonth() === currentDate.getMonth()
                      ? 'bg-white/5'
                      : 'bg-white/5 opacity-50'
                  } hover:bg-white/10 cursor-pointer transition-colors`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="font-semibold mb-2">{date.getDate()}</div>
                  <div className="space-y-1">
                    {getEventsForDate(date).map(event => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white text-sm p-1 rounded truncate`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'week' && (
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays(currentDate).map((date, index) => (
                <div
                  key={index}
                  className="min-h-96 p-2 rounded border border-white/10 bg-white/5"
                >
                  <div className="font-semibold mb-2">{formatDate(date)}</div>
                  <div className="space-y-1">
                    {getEventsForDate(date).map(event => (
                      <div
                        key={event.id}
                        className={`${event.color} text-white text-sm p-2 rounded`}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-xs">{formatTime(event.start)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'day' && (
            <div className="grid grid-cols-1 gap-2">
              {getDayHours().map(hour => (
                <div
                  key={hour}
                  className="flex items-center border-t border-white/10 py-4"
                >
                  <div className="w-20 text-sm">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </div>
                  <div className="flex-1 min-h-16 rounded hover:bg-white/5 cursor-pointer">
                    {events
                      .filter(event => event.start.getHours() === hour)
                      .map(event => (
                        <div
                          key={event.id}
                          className={`${event.color} text-white text-sm p-2 rounded m-1`}
                        >
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-xs">
                            {formatTime(event.start)} - {formatTime(event.end)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Modal */}
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
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-700 rounded border border-white/20"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start</label>
                    <input
                  type="datetime-local"
                  className="w-full p-2 bg-gray-700 rounded border border-white/20"
                  value={formatDateForInput(newEvent.start)}
                  onChange={handleStartDateChange}
                />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End</label>
                    <input
                  type="datetime-local"
                  className="w-full p-2 bg-gray-700 rounded border border-white/20"
                  value={formatDateForInput(newEvent.end)}
                  onChange={handleEndDateChange}
                />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 bg-gray-700 rounded border border-white/20"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    className="w-full p-2 bg-gray-700 rounded border border-white/20"
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="flex gap-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-purple-500'].map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${color} ${
                          newEvent.color === color ? 'ring-2 ring-white' : ''
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
        </div>
        </div>
  )}

  export default  Calendar;
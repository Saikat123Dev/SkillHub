'use client';
import React, { useState } from 'react';

const AnnouncementsPage = () => {
  const [pinnedAnnouncements] = useState([
    { id: 1, content: 'Team meeting tomorrow at 10 AM', author: 'Alice Smith' },
    { id: 2, content: 'New project deadline: June 30th', author: 'John Doe' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h2 className="font-bold text-2xl mb-6">Pinned Announcements</h2>
      <div className="w-full max-w-4xl">
        {pinnedAnnouncements.map((announcement) => (
          <div key={announcement.id} className=" bg-opacity-30 backdrop-blur-lg rounded-lg p-4 mb-4 shadow-lg flex flex-col border border-white border-opacity-20">
            <div className="font-bold text-lg text-gray-200">{announcement.content}</div>
            <div className="text-sm text-gray-200 mt-2">- {announcement.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;

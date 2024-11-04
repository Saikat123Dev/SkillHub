// app/group/[id]/leaderboard/page.tsx
'use client';
import React, { useState } from 'react';

const LeaderboardPage = () => {
  const [leaderboard] = useState([
    { id: 1, name: 'Alice Smith', points: 120, role: 'Project Manager' },
    { id: 2, name: 'Bob Johnson', points: 95, role: 'Developer' },
    { id: 3, name: 'John Doe', points: 80, role: 'Designer' },
    { id: 4, name: 'Emma Wilson', points: 75, role: 'QA Tester' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h2 className="font-bold text-3xl mb-4">Group Leaderboard</h2>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {leaderboard.map((member, index) => (
          <div key={member.id} className="flex items-center p-4 border-b last:border-b-0">
            <div className="font-bold text-2xl w-10 text-center text-yellow-400">{index + 1}</div>
            <div className="flex-grow ml-4">
              <div className="font-bold">{member.name}</div>
              <div className="text-sm text-gray-300">{member.role}</div>
            </div>
            <div className="text-xl font-bold text-gray-200">{member.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardPage;

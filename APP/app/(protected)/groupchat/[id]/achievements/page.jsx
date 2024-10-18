'use client';
import React, { useState } from 'react';

const AchievementsPage = () => {
  const [groupAchievements] = useState([
    { id: 1, title: 'Sprint Master', description: 'Completed all tasks in a sprint', icon: '🏃‍♂️' },
    { id: 2, title: 'Perfect Harmony', description: 'All members contributed equally', icon: '🎵' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h2 className="font-bold text-3xl mb-4">Group Achievements</h2>
      <div className="w-full max-w-4xl">
        {groupAchievements.map((achievement) => (
         <div key={achievement.id} className=" bg-opacity-30 backdrop-blur-lg rounded-lg p-4 mb-4 shadow-lg flex items-center border border-white border-opacity-20">
         <div className="text-3xl text-white mr-4">{achievement.icon}</div>
         <div className="flex-grow">
           <h3 className="font-bold text-white text-lg">{achievement.title}</h3>
           <p className="text-sm text-gray-100">{achievement.description}</p>
         </div>
       </div>
       
         
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;

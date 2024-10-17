'use client'
import React from 'react';
import { User, Users, Info, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Correct way to use Router in Next.js

const WhatsAppGroup = () => {
  const router = useRouter(); // Correct usage of useRouter hook for navigation

  const groupCreator = {
    name: "John Doe",
    username: "@johndoe",
    avatar: "/api/placeholder/40/40"
  };

  const groupMembers = [
    { name: "Alice Smith", username: "@alicesmith", avatar: "/api/placeholder/32/32" },
    { name: "Bob Johnson", username: "@bobjohnson", avatar: "/api/placeholder/32/32" },
    { name: "Carol White", username: "@carolwhite", avatar: "/api/placeholder/32/32" },
  ];

  const groupenable = () => {
    router.push('/groupchat'); // Using router.push to navigate to '/groupchat'
  };

  return (
    <div className="min-w-full mx-auto bg-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-green-600 text-white p-4">
        <h1 className="text-3xl font-extrabold">Tech Enthusiasts</h1>
        <p className="text-sm">Created by {groupCreator.name}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <img src={groupCreator.avatar} alt={groupCreator.name} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">{groupCreator.name}</p>
            <p className="text-sm text-gray-600">{groupCreator.username}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Group Bio</h2>
          <p className="text-lg text-gray-700">A community for tech lovers to discuss the latest trends and innovations in technology.</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <div className="flex flex-wrap">
            {groupMembers.map((member, index) => (
              <div key={index} className="flex items-center mr-4 mb-2">
                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full mr-2" />
                <div>
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-base text-gray-600">{member.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button 
            onClick={groupenable} 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Check size={18} className="mr-2" />
            Accept
          </button>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <X size={18} className="mr-2" />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGroup;

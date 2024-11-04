
import React from 'react';
import Link from 'next/link';


const Layout = ({ params, children }) => {
  const {id,requestId} = params;
  // const grp = await IndividualGroup(id); // Get group ID from URL

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-700 text-white p-4 flex justify-between items-center">
      <Link href={`/group/${id}/${requestId}`} className="relative group">
  <h1 className="text-lg font-bold">Comprehensive Collaboration Hub</h1>
  <span 
    className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"
  ></span>
</Link>

        <nav className="space-x-4">
          <Link 
            href={`/groupchat/${id}/${requestId}/tasks`}
            className="px-3 py-2 rounded hover:bg-blue-600"
          >
            Tasks
          </Link>
          <Link 
            href={`/groupchat/${id}/${requestId}/calender`}
            className="px-3 py-2 rounded hover:bg-blue-600"
          >
            Calender
          </Link>
          <Link 
            href={`/groupchat/${id}/${requestId}/announcements`}
            className="px-3 py-2 rounded hover:bg-blue-600"
          >
            Announcements
          </Link>
          <Link 
            href={`/groupchat/${id}/${requestId}/leaderboard`}
            className="px-3 py-2 rounded hover:bg-blue-600"
          >
           Leaderboard
          </Link>
          <Link 
            href={`/groupchat/${id}/${requestId}/Chat`}
            className="px-3 py-2 rounded hover:bg-blue-600"
          >
            Chat
          </Link>
        </nav>
      </div>
      <div className="flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;

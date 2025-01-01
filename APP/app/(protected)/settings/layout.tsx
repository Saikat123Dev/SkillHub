'use client'
import React, { useState } from 'react';
import UserPage from "../client/page";
import Link from "next/link";
import { Settings, Briefcase, Award, ChevronLeft, ChevronRight } from 'lucide-react';


interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex flex-row w-full min-h-screen bg-gray-50">
      <nav 
        className={`
          flex flex-col 
          ${isExpanded ? 'w-80' : 'w-20'} 
          min-h-full bg-white border-r border-gray-200 
          shadow-xl transition-all duration-500 ease-in-out
          relative group
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-4 top-8 bg-white rounded-full p-2 shadow-lg 
            transform transition-transform duration-300 hover:scale-110 z-10"
        >
          {isExpanded ? 
            <ChevronLeft className="w-4 h-4 text-gray-600" /> : 
            <ChevronRight className="w-4 h-4 text-gray-600" />
          }
        </button>

        {/* User Profile Section */}
        <div className={`
          relative w-full p-6 
          bg-gradient-to-br from-gray-50 to-gray-100
          overflow-hidden transition-all duration-500
        `}>
          <div className={`
            transform transition-all duration-500 
            hover:scale-105 origin-left
            ${!isExpanded && 'scale-90 opacity-80'}
          `}>
            {isExpanded && <UserPage />}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3 p-4">
          {[
            { href: '/settings', icon: Settings, label: 'Edit Profile', rotate: true },
            { href: '/settings/projects', icon: Briefcase, label: 'Add Projects' },
            { href: '/settings/experience', icon: Award, label: 'Add Experiences' }
          ].map((item, index) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="group"
              onClick={handleNavigation}
            >
              <div className={`
                flex items-center justify-center p-3 rounded-xl text-gray-700 
                bg-transparent hover:bg-blue-50 
                transition-all duration-300 ease-in-out 
                transform hover:translate-x-2
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                ${!isExpanded && 'px-1'}
              `}>
                <item.icon 
                  className={`
                    transition-all duration-300
                    ${item.rotate ? 'group-hover:rotate-90' : 'group-hover:scale-110'}
                    ${!isExpanded ? 'w-10 h-10' : 'w-6 h-6 mr-3'}
                    text-blue-600
                  `}
                />
                <span className={`
                  font-medium transition-all duration-300
                  group-hover:text-blue-600
                  ${!isExpanded ? 'hidden' : 'block'}
                  overflow-hidden whitespace-nowrap
                `}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-50">
        <div className={`
          bg-white rounded-xl shadow-sm min-h-full p-6
          transition-all duration-500 ease-in-out
          ${isLoading ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}
        `}>
          {children}
        </div>

      </div>
        <div>
                    
                    </div>
    </div>
  );
};

export default ProtectedLayout;
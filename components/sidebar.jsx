"use client";

import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (itemKey) => {
    setActiveItem(itemKey);
  };

  return (
    <aside
      className={`min-h-screen bg-gray-900 shadow-md transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      <nav className="min-h-full flex flex-col bg-gray-800 border-r border-gray-700">
        {/* Sidebar Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <span
            className={`text-xl font-bold text-yellow-500 transition-opacity duration-300 ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Logo
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        <SidebarContext.Provider
          value={{ expanded, activeItem, handleItemClick }}
        >
          <ul className="flex-1 px-3 py-2 space-y-2">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-gray-700 p-4 flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-full">
            <UserButton />
          </div>
          <div
            className={`flex items-center ml-3 overflow-hidden transition-all duration-300 ${
              expanded ? "w-auto" : "w-0"
            }`}
          >
            <div
              className={`leading-4 transition-opacity duration-300 ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-xs text-gray-400">
                {/* Placeholder for user information */}
                
              </span>
            </div>
            {expanded && (
              <MoreVertical size={20} className="ml-auto text-gray-500" />
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, alert, href, itemKey }) {
  const { expanded, activeItem, handleItemClick } = useContext(SidebarContext);

  const isActive = activeItem === itemKey;

  const content = (
    <div className="flex items-center">
      {icon}
      <span
        className={`ml-2 transition-all duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        } ${expanded ? "w-auto" : "w-0"} whitespace-nowrap`}
      >
        {text}
      </span>
    </div>
  );

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 rounded-md cursor-pointer transition-colors group ${
        isActive
          ? "bg-indigo-700 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
      onClick={() => handleItemClick(itemKey)}
    >
      {href ? (
        <Link legacyBehavior href={href}>
          <a className="w-full h-full flex items-center">{content}</a>
        </Link>
      ) : (
        content
      )}

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded-full bg-red-500 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}
      {!expanded && (
        <div
          className={`absolute left-full ml-3 rounded-md px-2 py-1 bg-gray-800 text-white text-sm invisible opacity-0 transform -translate-x-2 group-hover:visible group-hover:opacity-100`}
        >
          {text}
        </div>
      )}
    </li>
  );
}

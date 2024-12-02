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
      className={`min-h-screen bg-gray-900 shadow-lg transition-all duration-500 ease-in-out ${
        expanded ? "w-72" : "w-20"
      }`}
    >
      <nav className="min-h-full flex flex-col bg-gray-800 border-r border-gray-700">
        {/* Sidebar Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <span
            className={`text-xl font-bold text-yellow-500 transition-opacity duration-300 ${
              expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            Logo
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>

        <SidebarContext.Provider
          value={{ expanded, activeItem, handleItemClick }}
        >
          <ul className="flex-1 px-3 py-4 space-y-2">{children}</ul>
        </SidebarContext.Provider>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-700 p-4 flex items-center">
          <div className="w-10 h-10 bg-gray-600 rounded-full">
            <UserButton />
          </div>
          <div
            className={`flex items-center ml-3 overflow-hidden transition-all duration-500 ${
              expanded ? "w-auto" : "w-0"
            }`}
          >
            <div
              className={`leading-4 transition-opacity duration-500 ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-xs text-gray-400">
                {/* Placeholder for user information */}
                User Info
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
      <span className={`text-gray-400 ${isActive && "text-white"}`}>
        {icon}
      </span>
      <span
        className={`ml-3 transition-all duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        } ${expanded ? "w-auto" : "w-0"} whitespace-nowrap text-sm font-medium`}
      >
        {text}
      </span>
    </div>
  );

  return (
    <li
      className={`relative flex items-center py-3 px-4 my-1 rounded-lg cursor-pointer transition-all duration-300 group ${
        isActive
          ? "bg-indigo-700 text-white shadow-md"
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
          className={`absolute right-3 w-2 h-2 rounded-full bg-red-500 transition-transform ${
            expanded ? "scale-100" : "scale-0"
          }`}
        ></div>
      )}

      {/* Tooltip for collapsed state */}
      {!expanded && (
        <div
          className={`absolute left-full ml-3 rounded-md px-2 py-1 bg-gray-800 text-white text-xs shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300`}
        >
          {text}
        </div>
      )}
    </li>
  );
}

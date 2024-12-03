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
        <div
            className={`min-h-screen transition-all duration-500 ease-in-out ${
                expanded ? "w-56" : "w-20"
            } rounded-lg overflow-hidden`}
        >
            <div className="min-h-full rounded-l-lg flex flex-col"  style={{ backgroundColor: '#010917' }}>
                {/* Sidebar Header */}
                <div className="p-4 flex  justify-between items-center border-b border-blue-800">
          <span
              className={`text-xl font-bold  text-white transition-opacity duration-300 ${
                  expanded ? " translate-x-0" : "opacity-0 -translate-x-4 "
              }`}
          >
            Slide
          </span>
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-2 rounded-lg bg-white transition-transform transform duration-300 hover:scale-110 shadow-lg"
                    >
                        {expanded ? (
                            <ChevronFirst size={20} className="text-black"/>
                        ) : (
                            <ChevronLast size={20} className="text-black"/>
                        )}
                    </button>
                </div>

                <SidebarContext.Provider
                    value={{expanded, activeItem, handleItemClick}}
                >
                    <ul className="flex-1  px-3 py-4 space-y-2">{children}</ul>
                </SidebarContext.Provider>

                {/* Sidebar Footer */}
                <div className="border-t border-blue-800 p-4 flex items-center">
                    <div
                        className="w-10 h-10 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <UserButton/>
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
                            <span className="text-xs text-blue-300">User</span>
                        </div>
                        {expanded && (
                            <MoreVertical size={20} className="ml-auto text-blue-400"/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export function SidebarItem({ icon, text, alert, href, itemKey }) {
    const { expanded, activeItem, handleItemClick } = useContext(SidebarContext);

    const isActive = activeItem === itemKey;

    return (
        <li
            className={`relative flex items-center py-3 px-4 my-1 rounded-lg cursor-pointer transition-all duration-300 group ${
                isActive
                    ? "bg-blue-400 text-gray-900 shadow-xl scale-105 ring-2 ring-blue-500"
                    : "text-gray-200 hover:bg-blue-400 hover:text-gray-900 hover:shadow-lg"
            }`}
            onClick={() => handleItemClick(itemKey)}
        >
            {href ? (
                <Link legacyBehavior href={href}>
                    <a className="w-full h-full flex items-center">
                        <span
                            className={`transition-colors duration-300 ${
                                isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                            }`}
                        >
                            {icon}
                        </span>
                        <span
                            className={`ml-3 transition-all duration-300 ${
                                expanded ? "opacity-100" : "opacity-0"
                            } whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                                isActive ? "text-gray-900" : "group-hover:text-gray-900"
                            }`}
                        >
                            {text}
                        </span>
                    </a>
                </Link>
            ) : (
                <div className="flex items-center">
                    <span
                        className={`transition-colors duration-300 ${
                            isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-900"
                        }`}
                    >
                        {icon}
                    </span>
                    <span
                        className={`ml-3 transition-all duration-300 ${
                            expanded ? "opacity-100" : "opacity-0"
                        } whitespace-nowrap text-sm font-medium transition-colors duration-300 ${
                            isActive ? "text-gray-900" : "group-hover:text-gray-900"
                        }`}
                    >
                        {text}
                    </span>
                </div>
            )}

            {/* Uncomment if you want alerts */}
            {/* {alert && (
                <div
                    className={`absolute right-3 w-2 h-2 rounded-full bg-red-500 transition-transform ${
                        expanded ? "scale-100" : "scale-0"
                    }`}
                ></div>
            )} */}
        </li>
    );
}

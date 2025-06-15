"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { FaUser, FaUserCircle, FaCog } from "react-icons/fa";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();
  const userId = user?.id;
  console.log(userId);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-white">
            <div className="flex items-center justify-center w-full h-full rounded-full bg-white dark:bg-gray-900 transition-all duration-300 group-hover:bg-gray-50 dark:group-hover:bg-gray-800">
              <Avatar className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-white/20 transition-all duration-300">
                <AvatarImage 
                  src={user?.image || ""} 
                  alt={user?.name || "User"} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                  <FaUser className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Online status indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-lg animate-pulse">
              <div className="w-full h-full rounded-full bg-green-400 animate-ping opacity-75"></div>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end" 
          className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-900/10 rounded-2xl overflow-hidden"
          sideOffset={8}
        >
          {/* User Info Header */}
          <div className="px-6 py-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-gray-200/50 dark:border-gray-700/50">
            <div 
              onClick={() => window.location.href = `/profile/${userId}`}
              className="flex items-center space-x-4 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-800/30 rounded-xl p-2 -m-2 transition-all duration-200"
            >
              <div className="relative">
                <Avatar className="w-14 h-14 ring-4 ring-white/50 dark:ring-gray-800/50 shadow-lg">
                  <AvatarImage 
                    src={user?.image || ""} 
                    alt={user?.name || "User"} 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
                    <FaUser className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-md"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {user?.name || "User"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link href="/profile" className="block">
              <DropdownMenuItem className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group border-0 focus:bg-gray-50 dark:focus:bg-gray-800/50">
              
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group border-0 focus:bg-gray-50 dark:focus:bg-gray-800/50">
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30 group-hover:from-gray-200 group-hover:to-slate-200 dark:group-hover:from-gray-700/40 dark:group-hover:to-slate-700/40 transition-all duration-200 mr-4">
                  <FaCog className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div
                  onClick={() => window.location.href = "/settings"}
                  className="flex-1"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Settings
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Preferences and privacy
                  </p>
                </div>
                <div className="w-2 h-2 rounded-full bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

            {/* Logout Button */}
            <div className="px-2 pb-2">
              <LogoutButton>
                <DropdownMenuItem className="px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer group border-0 focus:bg-red-50 dark:focus:bg-red-950/20 rounded-xl">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 group-hover:from-red-200 group-hover:to-rose-200 dark:group-hover:from-red-800/40 dark:group-hover:to-rose-800/40 transition-all duration-200 mr-4">
                      <ExitIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                        Sign Out
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-500">
                        End your session securely
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </DropdownMenuItem>
              </LogoutButton>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Bell, FileText, Menu, Plus, Search, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchBar from "./search-bar";

export const Navbar = ({ onSidebarToggle, isSidebarOpen }) => {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <nav className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-slate-900/90 dark:via-slate-800/95 dark:to-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl w-full shadow-2xl shadow-black/5 dark:shadow-black/20 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />
      
      <div className="relative p-3 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={onSidebarToggle}
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={toggleSearch}
          >
            {isSearchOpen ? (
              <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Search className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            )}
            <span className="sr-only">Toggle Search</span>
          </Button>

          {/* Search Bar - Desktop and Mobile */}
          <div className={`absolute left-0 right-0 top-full mt-2 p-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 z-50 transition-all duration-300 ${
            isSearchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          } md:opacity-100 md:translate-y-0 md:pointer-events-auto md:relative md:block md:w-[400px] lg:w-[500px] xl:w-[600px] md:px-0 md:py-0 md:mt-0 md:bg-transparent md:dark:bg-transparent md:border-0 md:shadow-none`}>
            <SearchBar />
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-700/80 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <X className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            )}
            <span className="sr-only">Toggle Menu</span>
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Notifications */}
            <Link 
              href={`/profile/${user?.id}/connection`} 
              className="relative p-3 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <div className="relative">
                <Bell className="h-5 w-5 text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <span className="sr-only">Notifications</span>
            </Link>

            {/* Create Post Button */}
            <Button className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-98 rounded-xl px-4 py-2.5 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Link href="/feed" className="relative flex items-center gap-2 font-medium">
                <FileText className="h-4 w-4" />
                Create Post
              </Link>
            </Button>

            {/* Create Group Button */}
            <Button className="relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-98 rounded-xl px-4 py-2.5 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Link href="/AddGroup" className="relative flex items-center gap-2 font-medium">
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline">Create</span> Group
              </Link>
            </Button>

            {/* User Button */}
            <div className="h-10 w-10 rounded-xl overflow-hidden ring-2 ring-slate-200/50 dark:ring-slate-700/50 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all duration-200 hover:scale-105">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen 
            ? "max-h-96 opacity-100 mt-4 border-t border-slate-200/60 dark:border-slate-700/60 pt-4" 
            : "max-h-0 opacity-0"
        }`}>
          <div className="space-y-1">
            {/* Mobile Notifications */}
            <Link 
              href={`/profile/${user?.id}/connection`} 
              className="flex items-center gap-3 p-3 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-99 group"
            >
              <div className="relative">
                <Bell className="h-5 w-5 text-amber-500 group-hover:text-amber-600 dark:group-hover:text-amber-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Notifications</span>
            </Link>

            {/* Mobile Create Post */}
            <Link 
              href="/feed" 
              className="flex items-center gap-3 p-3 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-99 group"
            >
              <FileText className="h-5 w-5 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Create Post</span>
            </Link>

            {/* Mobile Create Group */}
            <Link 
              href="/AddGroup" 
              className="flex items-center gap-3 p-3 hover:bg-slate-100/60 dark:hover:bg-slate-700/60 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-99 group"
            >
              <Plus className="h-5 w-5 text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Create Group</span>
            </Link>

            {/* Mobile User Profile */}
            <div className="flex items-center gap-3 p-3">
              <div className="h-8 w-8 rounded-lg overflow-hidden ring-2 ring-slate-200/50 dark:ring-slate-700/50">
                <UserButton />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

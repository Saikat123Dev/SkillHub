"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Bell, FileText, Menu, Plus, Search, X } from "lucide-react";
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
    <nav className="bg-secondary rounded-xl w-full shadow-sm relative">
      <div className="p-2 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onSidebarToggle}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSearch}
          >
            {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
            <span className="sr-only">Toggle Search</span>
          </Button>

          <div className={`absolute left-0 right-0 top-full p-2 bg-secondary rounded-b-xl shadow-lg z-50 ${isSearchOpen ? "block" : "hidden"} md:relative md:block md:w-[400px] lg:w-[500px] xl:w-[600px] md:px-2`}>
            <SearchBar />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <div className="hidden md:flex items-center gap-4">
            <Link href={`/profile/${user?.id}/connection`} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <Bell className="h-6 w-6 text-yellow-500" />
              <span className="sr-only">Notifications</span>
            </Link>
            <Button className="flex border-neutral-200 dark:border-slate-800 transform transition-transform duration-300 hover:scale-95 px-3 py-1">
              <Link href="/feed" className="text-white rounded-full font-bold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Create Post
              </Link>
            </Button>
            <Button className="flex border-neutral-200 dark:border-slate-800 transform transition-transform duration-300 hover:scale-95 px-3 py-1">
              <Link href="/AddGroup" className="text-white rounded-full font-bold flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Group
              </Link>
            </Button>
            <div className="h-9 w-9">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden flex flex-col gap-4 mt-4 border-t pt-4 border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? "block" : "hidden"}`}>
          <Link href={`/profile/${user?.id}/connection`} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-yellow-500" />
            <span>Notifications</span>
          </Link>
          <Link href="/feed" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <FileText className="h-5 w-5" />
            <span>Create Post</span>
          </Link>
          <Link href="/AddGroup" className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Plus className="h-5 w-5" />
            <span>Create Group</span>
          </Link>
          <div className="p-2">
            <div className="h-8 w-8">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

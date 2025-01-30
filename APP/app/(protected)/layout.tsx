"use client";

import { Calendar, Home, LayoutDashboard, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "../../components/navbar";
import Sidebar, { SidebarItem } from "../../components/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on wider screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Layout */}
      <div className="flex min-h-screen relative">
        {/* Sidebar - Hidden on mobile by default, shown when isSidebarOpen is true */}
        <div className={`
          fixed inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar

          >
            <SidebarItem
              itemKey="home"
              icon={<Home size={20} />}
              text="Home"
              href="/feed"
              alert
            />
            <SidebarItem
              itemKey="groups"
              icon={<LayoutDashboard size={20} />}
              text="Groups"
              href="/mygroups"
              alert
            />
            <SidebarItem
              itemKey="calendar"
              icon={<Calendar size={20} />}
              text="Calendar"
              href="/calendar"
              alert
            />
            <SidebarItem
              itemKey="settings"
              icon={<Settings size={20} />}
              text="Settings"
              href="/settings"
              alert
            />
          </Sidebar>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;

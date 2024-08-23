import { Navbar } from "../../components/navbar";
import Sidebar, { SidebarItem } from "../../components/sidebar";
import { LayoutDashboard, Home, StickyNote, Layers, Flag, Calendar, LifeBuoy, Settings } from "lucide-react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarItem 
          itemKey="home"
          icon={<Home size={20} />}
          text="Home"
          href="/home"
          alert 
        />
        <SidebarItem
          itemKey="dashboard"
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          href="/dashboard"
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
          itemKey="tasks"
          icon={<Layers size={20} />} 
          text="Tasks" 
          href="/tasks"
          alert
        />
        <SidebarItem 
          itemKey="reporting"
          icon={<Flag size={20} />} 
          text="Reporting" 
          href="/reporting"
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
      <div className="flex flex-col flex-grow w-full overflow-auto">
        <Navbar />
        <div className="flex-grow p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;

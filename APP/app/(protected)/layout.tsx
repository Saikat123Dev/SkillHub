import { Navbar } from "../../components/navbar";
import Sidebar, { SidebarItem } from "../../components/sidebar";
import { LayoutDashboard, Home, Calendar, Settings } from "lucide-react";


interface ProtectedLayoutProps {
    children: React.ReactElement;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div className="h-screen flex border-round border-gray-900/25">
            

            <Sidebar>
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
            <div className="flex flex-col flex-grow w-full overflow-hidden">
                <Navbar />
               
                <div className="flex-grow p-1 overflow-y-auto">{children}</div>
                
            </div>
           
        </div>
    );
};

export default ProtectedLayout;

import { IndividualGroup } from "@/actions/group";
import { SidebarDemo } from "@/components/group-sidebar";
import React from 'react';


const Layout =async ({ params, children }) => {
  const {id,requestId} = params;
  // const grp = await IndividualGroup(id); // Get group ID from URL


    // Fetch the group details
    const grp = await IndividualGroup(id);
    console.log('grp', grp);
  return (
    <div className="min-h-screen flex z-10">
{/*      <div className="bg-[#080f29] rounded-lg text-white p-4 flex justify-between items-center">*/}
{/*      <Link href={`/group/${id}/${requestId}`} className="relative group">*/}
{/*  <h1 className="text-lg font-bold">Comprehensive Collaboration Hub</h1>*/}
{/*  <span */}
{/*    className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"*/}
{/*  ></span>*/}
{/*</Link>*/}

{/*        <nav className="space-x-4">*/}
{/*          <Link */}
{/*            href={`/groupchat/${id}/${requestId}/tasks`}*/}
{/*            className="px-3 py-2 rounded hover:bg-blue-500"*/}
{/*          >*/}
{/*            Tasks*/}
{/*          </Link>*/}
{/*          <Link */}
{/*            href={`/groupchat/${id}/${requestId}/calender`}*/}
{/*            className="px-3 py-2 rounded hover:bg-blue-500"*/}
{/*          >*/}
{/*            Calender*/}
{/*          </Link>*/}
{/*          <Link */}
{/*            href={`/groupchat/${id}/${requestId}/announcements`}*/}
{/*            className="px-3 py-2 rounded hover:bg-blue-500"*/}
{/*          >*/}
{/*            Announcements*/}
{/*          </Link>*/}
{/*          <Link */}
{/*            href={`/groupchat/${id}/${requestId}/leaderboard`}*/}
{/*            className="px-3 py-2 rounded hover:bg-blue-500"*/}
{/*          >*/}
{/*           Leaderboard*/}
{/*          </Link>*/}
{/*          <Link */}
{/*            href={`/groupchat/${id}/${requestId}/Chat`}*/}
{/*            className="px-3 py-2 rounded hover:bg-blue-500"*/}
{/*          >*/}
{/*            Chat*/}
{/*          </Link>*/}
{/*        </nav>*/}
{/*      </div>*/}

        {/*<Sidebar>*/}
        {/*    <SidebarItem*/}
        {/*        itemKey="Tasks"*/}
        {/*        icon={<Home size={20} />}*/}
        {/*        text="Tasks"*/}
        {/*        href={`/groupchat/${id}/${requestId}/tasks`}*/}
        {/*        alert*/}
        {/*    />*/}
        {/*    <SidebarItem*/}
        {/*        itemKey="Comprehensive Collaboration Hub"*/}
        {/*        icon={<LayoutDashboard size={20} />}*/}
        {/*        text="Comprehensive Collaboration Hub"*/}
        {/*        href={`/group/${id}/${requestId}`}*/}
        {/*        alert*/}
        {/*    />*/}
        {/*    <SidebarItem*/}
        {/*        itemKey="Announcements"*/}
        {/*        icon={<Calendar size={20} />}*/}
        {/*        text="Announcements"*/}
        {/*        href={`/groupchat/${id}/${requestId}/announcements`}*/}
        {/*        alert*/}
        {/*    />*/}
        {/*    <SidebarItem*/}
        {/*        itemKey="Leaderboard"*/}
        {/*        icon={<Settings size={20} />}*/}
        {/*        text="Leaderboard"*/}
        {/*        href={`/groupchat/${id}/${requestId}/leaderboard`}*/}
        {/*        alert*/}
        {/*    />*/}
        {/*</Sidebar>*/}

     <SidebarDemo  children={children} id={id} requestId={requestId} groupName={grp.grpname} />

    </div>
  );
};

export default Layout;

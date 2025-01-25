"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Plus, Shield, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AcceptButton from "./acceptButton";

const WhatsAppGroupClient = ({ admin, currentUser, requestId, members, group }) => {
  const [hoveredMember, setHoveredMember] = useState(null);

  return (
    <div className="min-w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{group.grpname}</h1>
          <p className="text-sm opacity-80 mt-1 flex items-center">
            <Shield size={16} className="mr-2" />
            Created by {admin.name}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <img
                src={admin.profilePic}
                alt={admin.name}
                className="w-16 h-16 rounded-full border-4 border-white/30 hover:scale-110 transition-transform"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{admin.name} - Group Admin</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 flex items-center text-gray-800">
            <Info size={20} className="mr-2 text-blue-500" />
            Group Bio
          </h2>
          <p className="text-gray-700 italic">{group.grpbio || "No group bio available"}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <UserPlus size={24} className="mr-3 text-blue-600" />
            Members ({members.length})
          </h2>
          <div className="flex items-center -space-x-4">
            {members.map((profile, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredMember(profile)}
                onMouseLeave={() => setHoveredMember(null)}
                className="relative group hover:z-50"
              >
                <img
                  src={profile.user.profilePic}
                  alt={profile.user.name}
                  className="w-14 h-14 rounded-full border-3 border-white shadow-md transition-all
                    hover:scale-125 hover:border-blue-500 cursor-pointer"
                />
                {hoveredMember === profile && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-blue-900 text-white p-3 rounded-lg shadow-xl text-center min-w-[150px]">
                      <p className="font-bold">{profile.user.name}</p>
                      <p className="text-sm text-blue-300">{profile.role}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          {currentUser.id !== group.adminId ? (
            <div className="flex space-x-4">
              <AcceptButton
                groupId={group.id}
                requestId={requestId}
                userId={currentUser.id}
              />
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4
                  rounded-lg flex items-center transition-colors"
              >
                <X size={18} className="mr-2" />
                Decline
              </button>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Link
                  href="/search"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4
                    rounded-lg flex items-center transition-all hover:shadow-md"
                >
                  <Plus className="mr-2" size={20} />
                  Add Members
                </Link>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Members</DialogTitle>
                </DialogHeader>
                {/* Future: Add member search/invite functionality */}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGroupClient;

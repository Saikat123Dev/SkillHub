"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AcceptButton from "./acceptButton";

const WhatsAppGroupClient = ({ admin, currentUser, requestId, members, group }) => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const isMember = members.some((member) => member.user.id === currentUser.id);
  const isAdmin = admin.id === currentUser.id; // Check if current user is the admin

  console.log(members);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-all hover:shadow-2xl border border-gray-100">
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Members */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <UserPlus size={24} className="mr-3 text-blue-500" />
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
                  src={profile.user.image}
                  alt={profile.user.name}
                  className="w-12 h-12 rounded-full border-3 border-white shadow-md transition-all hover:scale-125 hover:border-blue-500 cursor-pointer"
                />
                {hoveredMember === profile && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-blue-900 text-white p-3 rounded-lg shadow-xl text-center min-w-[150px]">
                      <p className="font-bold">{profile.user.name}</p>
                      <p className="text-sm text-blue-200">{profile.role}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          {!isMember && currentUser.id !== group.adminId ? (
            <div className="flex space-x-4">
              <AcceptButton groupId={group.id} requestId={requestId} userId={currentUser.id} />
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all hover:shadow-md">
                <X size={18} className="mr-2" />
                Decline
              </button>
            </div>
          ) : isAdmin ? (
            <Dialog>
              <DialogTrigger asChild>
                <Link
                  href="/search"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all hover:shadow-md"
                >
                  <Plus className="mr-2" size={20} />
                  Add Members
                </Link>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-xl shadow-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">Add New Members</DialogTitle>
                </DialogHeader>
                <p className="text-gray-600">Search and invite new members to join the group (future implementation).</p>
              </DialogContent>
            </Dialog>
          ) : null} {/* Hide the Add Members button for normal members */}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGroupClient;

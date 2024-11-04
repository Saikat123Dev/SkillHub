"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import Link from "next/link";
import AcceptButton from "./acceptButton";

const WhatsAppGroupClient = ({ admin, currentUser, members, group }) => {
  return (
    <div className="min-w-full mx-auto bg-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-green-600 text-white p-4">
        <h1 className="text-3xl font-extrabold">{group.grpname}</h1>
        <p className="text-sm">Created by {admin.name}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={admin.profilePic}
            alt={admin.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{admin.name}</p>
            <p className="text-sm text-gray-600">@{admin.username}</p>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Group Bio</h2>
          <p className="text-lg text-gray-700">{group.grpbio}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Members({members.length})
          </h2>
          <div className="flex items-center">
            {members.map((profile: any, index: any) => (
              <div
                key={index}
                className={`-ml-3 first:ml-0 relative group hover:z-30`}
              >
                <div className="relative">
                  <img
                    src={profile.user.profilePic}
                    alt={profile.user.profilePic}
                    className="w-12 h-12 rounded-full border-2  bg-gray-600 transition-transform duration-300 
                             transform hover:scale-110 hover:border-black"
                  />

                  <div
                    className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                                transition-all duration-300 pointer-events-none min-w-[120px]"
                  >
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-white/10">
                      <div className="text-center">
                        <p className="text-white font-semibold text-sm whitespace-nowrap">
                          {profile.user.name}
                        </p>
                        <p className="text-blue-300 text-xs">{profile.role}</p>
                      </div>

                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 
                                    border-r border-b border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentUser.id !== group.adminId ? (
          <div className="flex justify-between">
            <AcceptButton groupId={group.id} userId={currentUser.id} />
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center">
              <X size={18} className="mr-2" />
              Decline
            </button>
          </div>
        ) : (
          <div className="w-32">
            <Link
              href="/search"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <Plus className="mr-2" size={20} />
              Members
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppGroupClient;

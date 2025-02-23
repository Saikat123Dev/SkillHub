"use client";

import { Plus, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AcceptButton from "./acceptButton";

const WhatsAppGroupClient = ({ admin, currentUser, requestId, members, group, session }) => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [notification, setNotification] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState({});

  const isMember = members.some((member) => member.user.id === currentUser.id);
  const isAdmin = admin?.id === currentUser?.id;

  // Load invited status from local storage on mount
  useEffect(() => {
    const storedInvitedUsers = JSON.parse(localStorage.getItem("invitedUsers")) || {};
    setInvitedUsers(storedInvitedUsers);
  }, []);

  useEffect(() => {
    if (isAdmin && group?.id) {
      fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          setRecommendedUsers(data.recommendedUsers || []);
        })
        .catch((error) => {
          console.error("Error fetching recommendations:", error);
          setRecommendedUsers([]);
        });
    }
  }, [isAdmin, group?.id]);

  const inviteUser = async (user) => {
    if (!currentUser?.id) {
      setNotification({ type: "error", message: "Error: User is not logged in." });
      return;
    }

    setInvitedUsers((prev) => {
      const updated = { ...prev, [user.id]: true };
      localStorage.setItem("invitedUsers", JSON.stringify(updated)); // Save to local storage
      return updated;
    });

    try {
      const response = await fetch("/api/connect/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: user.id,
          senderId: currentUser?.id,
          message: `Join the group ${group.name}`,
          purpose: "Group Invitation",
          groupId: group.id,
          groupname: group.name,
          groupUrl: `/group/${group.id}`,
        }),
      });

      if (response.ok) {
        setNotification({ type: "success", message: "Invitation sent successfully!" });
      } else {
        const errorData = await response.json();
        setNotification({
          type: "error",
          message: `Failed to send invitation: ${errorData.message || "Unknown error"}`,
        });

        setInvitedUsers((prev) => {
          const updated = { ...prev, [user.id]: false };
          localStorage.setItem("invitedUsers", JSON.stringify(updated)); // Update local storage
          return updated;
        });
      }
    } catch (error) {
      setNotification({ type: "error", message: "Error sending invitation." });

      setInvitedUsers((prev) => {
        const updated = { ...prev, [user.id]: false };
        localStorage.setItem("invitedUsers", JSON.stringify(updated)); // Update local storage
        return updated;
      });
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
      <div className="p-6 space-y-6">
        {/* Members Section */}
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

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          {!isMember && currentUser.id !== group.adminId ? (
            <div className="flex space-x-4">
              <AcceptButton groupId={group.id} requestId={requestId} userId={currentUser.id} />
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all hover:shadow-md">
                <X size={18} className="mr-2" />
                Decline
              </button>
            </div>
          ) : isAdmin && (
            <Link
              href="/search"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all hover:shadow-md"
            >
              <Plus className="mr-2" size={20} />
              Add Members
            </Link>
          )}
        </div>

        {/* Recommended Users Section */}
        {isAdmin && recommendedUsers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mt-6">Recommended Users</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {recommendedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.role || "User"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => inviteUser(user)}
                    disabled={invitedUsers[user.id]}
                    className={`${
                      invitedUsers[user.id] ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                    } text-white font-bold py-2 px-4 rounded-lg transition-all`}
                  >
                    {invitedUsers[user.id] ? "Invited" : "Invite"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div
            className={`mt-4 p-3 rounded-lg text-white ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppGroupClient;

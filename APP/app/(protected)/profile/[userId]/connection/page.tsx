"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { useEffect, useState } from "react";

type FriendRequest = {
  groupname: string;
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  projectDescription: string;
  purpose: string;
  mutualSkill: string;
  groupUrl: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  avatar: string;
};

const LoadingState = () => (
  <div className="w-full space-y-8">
    <div className="flex justify-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-2 border-gray-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
          {[1, 2, 3].map((j) => (
            <div key={j} className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const getInitials = (name: string) => {
  return name.split(" ").map((part) => part[0]).join("").toUpperCase();
};

const FriendRequestsPage = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useCurrentUser();
  const receiverId = session?.id;

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(
        `https://skill-hub-ftc6.vercel.app/api/connect/getAll?receiverId=${receiverId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch friend requests");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setFriendRequests(data);
      } else if (data.message) {
        setFriendRequests([]);
        setError(data.message);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const acceptFriendRequest = async (id: string) => {
    try {
      const response = await fetch("https://skill-hub-ftc6.vercel.app/api/connect/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept friend request");
      }
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== id)
      );
    } catch (error) {
      console.log("Error while accepting friend request:", error.message);
    }
  };

  const rejectFriendRequest = async (id: string) => {
    try {
      const response = await fetch("https://skill-hub-ftc6.vercel.app/api/connect/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject friend request");
      }
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== id)
      );
    } catch (error) {
      console.log("Error while rejecting friend request:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold text-black tracking-tight text-center mb-16 font-serif">
          Friend Requests
        </h1>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <p className="text-red-600 text-center text-lg">{error}</p>
        ) : friendRequests.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No friend requests available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {friendRequests
              .filter((request) => request.status === "PENDING")
              .map((request) => (
                <div
                  key={request.id}
                  className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 p-6 space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    {request.avatar ? (
                      <img
                        className="w-16 h-16 rounded-full border-2 border-black"
                        src={request.avatar}
                        alt={request.sender.name}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center">
                        <span className="text-black font-bold text-xl">
                          {getInitials(request.sender.name)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-black">
                        {request.sender.name}
                      </h2>
                      <p className="text-sm font-medium text-gray-600">
                        {request.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Project Description</h3>
                      <p className="text-black">{request.projectDescription}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Purpose</h3>
                      <p className="text-black">{request.purpose}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Mutual Skill</h3>
                      <p className="text-black">{request.mutualSkill}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Group</h3>
                      <p className="text-black">{request.groupname}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Link
                      href={`${request.groupUrl}/${request.id}`}
                      className="text-black underline hover:no-underline font-medium"
                    >
                      View Group Details
                    </Link>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => acceptFriendRequest(request.id)}
                        className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectFriendRequest(request.id)}
                        className="flex-1 bg-white text-black border-2 border-black py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequestsPage;

"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";
import AcceptButton from "../../../../../components/acceptButton";

const AcceptPostRequestButton = ({ requestId }: { requestId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/connect/member/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      if (!response.ok) {
        throw new Error("Failed to accept request");
      }
      alert("Request accepted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="flex-1 bg-green-500 text-white border-2 border-black py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
    >
      {loading ? "Accepting..." : "Accept"}
    </button>
  );
};

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  projectDescription: string;
  purpose?: string | null;
  mutualSkill?: string | null;
  groupUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  groupId: string;
  groupname: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  group: {
    id: string;
    grpname: string;
    grpbio: string;
  };
  post?: {
    id: string;
    description: string;
    techStack: string[];
    looking: string[];
  };
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const FriendRequestsPage = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useCurrentUser();
  const receiverId = session?.id;

  const fetchFriendRequests = async () => {
    if (!receiverId) return;

    try {
      const response = await fetch(
        `/api/connect/getAll?receiverId=${receiverId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch friend requests");
      }
      const data = await response.json();
      setFriendRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, [receiverId]);

  // Correct placement of console.log
  useEffect(() => {
    if (friendRequests.length > 0) {
      console.log("Friend Requests:", friendRequests[0].status);
    }
  }, [friendRequests]);

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch("/api/connect/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject request");
      }

      alert("Request rejected successfully");

      // Remove rejected request from state
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl font-bold text-black tracking-tight text-center mb-16 font-serif">
          Friend Requests
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600 text-center text-lg">{error}</p>
        ) : friendRequests.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            No friend requests available.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {friendRequests
              .filter((request) => request.status === "PENDING")
              .map((request) => (
                <div
                  key={request.id}
                  className="bg-white border-2 border-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6 space-y-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center">
                      <span className="text-black font-bold text-xl">
                        {getInitials(request.sender.name)}
                      </span>
                    </div>
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
                    <p className="text-black">{request.projectDescription}</p>
                    {request.purpose && (
                      <p className="text-gray-600">Purpose: {request.purpose}</p>
                    )}
                    {request.mutualSkill && (
                      <p className="text-gray-600">
                        Mutual Skill: {request.mutualSkill}
                      </p>
                    )}
                    <p className="text-gray-600">
                      Group: {request.group.grpname}
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    {request.post?.id ? (
                      <AcceptPostRequestButton requestId={request.id} />
                    ) : (
                      <AcceptButton
                        requestId={request.id}
                        groupId={request.group.id}
                        userId={request.receiverId}
                      />
                    )}
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 bg-white text-black border-2 border-black py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      Reject
                    </button>
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

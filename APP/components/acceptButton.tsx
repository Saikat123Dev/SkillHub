"use client"; // Marks this component as a Client Component

import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

type AcceptButtonProps = {
  requestId: string;
  groupId: string;
  userId: string;
};

export default function AcceptButton({ requestId, groupId, userId }: AcceptButtonProps) {
  const [status, setStatus] = useState("pending");
  const router = useRouter(); // Use the router

  const handleAccept = async () => {
    try {
      // Run both requests in parallel
      const [acceptResponse, addGroupResponse] = await Promise.all([
        // Accept friend request
        fetch(`/api/connect/accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId }),
        }),

        // Add user to the group
        fetch(`/api/group/${groupId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, groupId }),
        }),
      ]);

      // Check if both responses were successful
      if (acceptResponse.ok && addGroupResponse.ok) {
        setStatus("accepted");
        // Redirect using useRouter
        router.push(`/groupchat/${groupId}`); // Use groupId in the URL
        console.log("Friend request accepted and user added to group successfully.");
      } else {
        setStatus("error");
        console.error("Failed to complete one or both requests.");
      }
    } catch (error) {
      setStatus("error");
      console.error("Error processing requests:", error);
    }
  };

  // Render based on request status
  if (status === "accepted") {
    return <p className="text-green-500 font-bold">Accepted</p>;
  }

  if (status === "error") {
    return <p className="text-red-500 font-bold">Error</p>;
  }

  return (
    <button
      onClick={handleAccept}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
    >
      <Check size={18} className="mr-2" />
      Accept
    </button>
  );
}

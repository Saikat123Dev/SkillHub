"use client"; // Marks this component as a Client Component

import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

type AcceptButtonProps = {
  groupId: string;
  userId: string;
};

export default function AcceptButton({ groupId, userId }: AcceptButtonProps) {
  const [status, setStatus] = useState("pending");
  const router = useRouter(); 
  
  const handleAccept = async () => {
    try {
      // Make a single request to add the user to the group
      const addGroupResponse = await fetch(`/api/group/${groupId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, groupId }),
      });

      // Check if the response was successful
      if (addGroupResponse.ok) {
        setStatus("accepted");
        // Redirect using useRouter
        router.push(`/groupchat/${groupId}`); // Use groupId in the URL
        console.log("User added to group successfully.");
      } else {
        setStatus("error");
        console.error("Failed to add user to group.");
      }
    } catch (error) {
      setStatus("error");
      console.error("Error processing the request:", error);
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

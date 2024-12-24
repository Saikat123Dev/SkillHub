"use client";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Ensure react-toastify is installed and imported

type AcceptButtonProps = {
  requestId: string;
  groupId: string;
  userId: string;
};

export default function AcceptButton({ requestId, groupId, userId }: AcceptButtonProps) {
  const [status, setStatus] = useState("pending");
  const router = useRouter();

  const handleAccept = async () => {
    try {
      console.log("Starting handleAccept...");

      const [acceptResponse, addGroupResponse] = await Promise.all([
        fetch(`/api/connect/accept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId }),
        }),
        fetch(`/api/group/${groupId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, groupId }),
        }),
      ]);

      console.log("Responses received", { acceptResponse, addGroupResponse });

      // Check responses
      if (acceptResponse.ok && addGroupResponse.ok) {
        setStatus("accepted");
        toast.success("Request accepted, and user added to the group!");
        router.push(`/groupchat/${groupId}/${requestId}`);
      } else {
        // Attempt to parse addGroupResponse for specific error details
        const addGroupResult = await addGroupResponse.json().catch(() => ({}));

        if (addGroupResult.code === "P2002") {
          toast.info("User is already a member of this group.");
          setStatus("already_member");
        } else {
          toast.error("Failed to add user to group.");
          setStatus("error");
        }
      }
    } catch (error) {
      console.error("Error processing requests:", error);
      setStatus("error");
      toast.error("Error processing requests.");
    }
  };

  // Render based on request status
  if (status === "accepted") {
    return <p className="text-green-500 font-bold">Accepted</p>;
  }
  if (status === "already_member") {
    return <p className="text-blue-500 font-bold">Already a Member</p>;
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

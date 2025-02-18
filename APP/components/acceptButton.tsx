"use client";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type AcceptButtonProps = {
  requestId: string;
  groupId: string;
  userId: string;
};

export default function AcceptButton({ requestId, groupId, userId }: AcceptButtonProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "already_member" | "error" | "loading">("pending");
  const router = useRouter();

  const handleAccept = async () => {
    setStatus("loading");
    try {
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

      if (acceptResponse.ok && addGroupResponse.ok) {
        setStatus("accepted");
        toast.success("Request accepted, and user added to the group!");
        router.push(`/groupchat/${groupId}/${requestId}`);
      } else {
        const addGroupResult = await addGroupResponse.json().catch(() => ({}));
        if (addGroupResult.code === "P2002") {
          toast.info("User is already a member of this group.");
          setStatus("already_member");
        } else {
          throw new Error("Failed to add user to group.");
        }
      }
    } catch (error) {
      console.error("Error processing requests:", error);
      toast.error("Error processing requests.");
      setStatus("error");
    }
  };

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
    <motion.button
      onClick={handleAccept}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      disabled={status === "loading"}
    >
      {status === "loading" ? (
        <Loader2 size={18} className="mr-2 animate-spin" />
      ) : (
        <Check size={18} className="mr-2" />
      )}
      Accept
    </motion.button>
  );
}

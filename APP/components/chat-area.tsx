import EmojiPicker from "emoji-picker-react";
import {
  Send,
  Smile
} from "lucide-react";
import { io } from "socket.io-client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
interface Message {
  id: string;
  sender: string;
  content?: string; // Optional for file sharing
  time: string;
  isOwn?: boolean;
  userId?: string;
  groupId?: string;
  fileName?: string;
  fileData?: string;
  fileUrl?: string; // For streamed files
}

export function ChatArea({ id, requestId }: { id: string; requestId: string }) {
  const session = useSession();

  const currentUserId = session.data?.user.id;
  const username = session.data?.user.name;
  const [message, setMessage] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/message?id=${id}&requestId=${requestId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        const initialMessages = data.map((message: any) => ({
          id: message.id,
          sender: message.sender,
          content: message.content,
          time: message.time,
          isOwn: message.userId === currentUserId,
          userId: message.userId,
          groupId: message.groupId,
        }));
        setMessages(initialMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id, requestId, currentUserId]);

  useEffect(() => {
    socketRef.current = io("http://localhost:8001");

    // Listen for regular messages
    socketRef.current.on("message", (messageData: any) => {
      const parsedMessage = JSON.parse(messageData);
      const parsedMessageContent = JSON.parse(parsedMessage.message);

      const newMessage: Message = {
        id: parsedMessageContent.id,
        sender: parsedMessageContent.sender || "Unknown",
        content: parsedMessageContent.content,
        fileName: parsedMessageContent.fileName,
        fileData: parsedMessageContent.fileData,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: parsedMessageContent.userId === currentUserId,
        userId: parsedMessageContent.userId,
        groupId: parsedMessageContent.groupId,
      };

      setMessages((prev) =>
        prev.some((msg) => msg.id === newMessage.id) ? prev : [...prev, newMessage]
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [currentUserId]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedMessageId(null);
      }
    };

    if (selectedMessageId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [selectedMessageId]);

  const handleEmojiClick = (emoji: { emoji: string }) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleSend = () => {
    if (message.trim() && socketRef.current) {
      const timestamp = new Date();
      const messageId = `${Date.now()}-${currentUserId}`;

      const newMessage = {
        id: messageId,
        content: message.trim(),
        sender: "You",
        userId: currentUserId,
        groupId: id,
        time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      socketRef.current.emit("event:message", JSON.stringify(newMessage));

      const localMessage: Message = {
        id: messageId,
        sender: "You",
        content: message.trim(),
        userId: currentUserId,
        groupId: id,
        time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
      };

      setMessages((prev) => [...prev, localMessage]);
      setMessage("");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !socketRef.current) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxFileSize) {
      alert("File size exceeds 10MB. Please upload a smaller file.");
    } else {
      const reader = new FileReader();

      reader.onload = () => {
        const fileData = reader.result as string; // File content as base64 string
        const timestamp = new Date();
        const messageId = `${Date.now()}-${currentUserId}`;

        const newMessage = {
          id: messageId,
          sender: "You",
          userId: currentUserId,
          groupId: id,
          time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          fileName: file.name,
          fileData, // Base64 string
        };

        socketRef.current.emit("event:message", JSON.stringify(newMessage));

        setMessages((prev) => [...prev, { ...newMessage, isOwn: true }]);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <img
              src="https://i.pravatar.cc/150?u=group"
              alt="Group"
            />
          </Avatar>
          <div>
            <h3 className="font-semibold">Real estate deals</h3>
            <p className="text-sm text-muted-foreground">10 members</p>
          </div>
        </div>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex group relative ${message.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[70%] relative ${message.isOwn ? "flex-row-reverse" : ""}`}
              >
                {!message.isOwn && (
                  <Avatar className="h-8 w-8">
                    <img
                      src={`https://i.pravatar.cc/150?u=${message.sender}`}
                      alt={message.sender}
                    />
                  </Avatar>
                )}
                <div className="relative">
                  {!message.isOwn && (
                    <p className="text-sm text-muted-foreground mb-1">{message.sender}</p>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content && <p>{message.content}</p>}
                    {message.fileName && (
                      <div>
                        <p className="text-sm font-bold">File: {message.fileName}</p>
                        <a
                          href={message.fileData}
                          download={message.fileName}
                          className="text-blue-500 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    )}
                    <p className="text-xs mt-1 opacity-70">{message.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4 relative">
        {isEmojiPickerVisible && (
          <div className="absolute bottom-16 left-0 z-50">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <div className="flex gap-2 items-center">
          <Button
            size="icon"
            variant="outline"
            className="rounded-lg p-2"
            onClick={() => setIsEmojiPickerVisible((prev) => !prev)}
          >
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 rounded-lg"
          />
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <Button
            size="icon"
            className="rounded-lg p-3"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            📎
          </Button>
          <Button
            size="icon"
            className="rounded-lg bg-blue-500 text-white p-3"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

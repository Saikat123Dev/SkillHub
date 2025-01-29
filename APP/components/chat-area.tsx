"use client";

import { useSocket } from "@/hooks/useSocket";
import { Message } from "@/services/socketClient";
import EmojiPicker from "emoji-picker-react";
import { AlertCircle, Send, Smile } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

interface ChatAreaProps {
  id: string;
  requestId: string;
  groupName?: string;
  memberCount?: number;
}

export function ChatArea({ id, requestId, groupName = "Chat Group", memberCount = 0 }: ChatAreaProps) {
  const session = useSession();
  const currentUserId = session.data?.user.id;
  const username = session.data?.user.name;
  const [message, setMessage] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize socket connection
  const { messages, error: socketError, sendMessage, sendFile, isConnected } = useSocket(
    process.env.NEXT_PUBLIC_SOCKET_URL || "https://skillhub-kc05.onrender.com",
    id
  );

  // Format message for consistency between DB and new messages
  const formatMessage = (msg: any) => {
    const parsedDate = new Date(msg.createdAt);
    const time = isNaN(parsedDate.getTime()) ? "Invalid Date" : parsedDate.toLocaleTimeString();
    return {
      id: msg.id,
      sender: msg.userName,
      content: msg.content,
      time: time,
      isOwn: msg.userId === currentUserId,
      userId: msg.userId,
    };
  };



  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/message?id=${id}&requestId=${requestId}`);
        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();

        if (data.messages && Array.isArray(data.messages)) {  // Ensure it's an array
          const formattedMessages = data.messages.map((msg: any) => formatMessage(msg));
          setInitialMessages(formattedMessages);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };


    fetchMessages();
  }, [id, requestId, currentUserId, username]);

  // Format socket messages
  const formattedSocketMessages = messages.map((msg) => formatMessage(msg));

  // Handle message sending
  const handleSend = () => {
    if (message.trim() && currentUserId && username) {
      sendMessage(message.trim(), currentUserId, username);
      setMessage("");
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [formattedSocketMessages]);

  // Handle emoji selection
  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setMessage((prev) => prev + emojiData.emoji);
    setIsEmojiPickerVisible(false);
  };

  // Handle key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUserId || !username) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      alert("File size exceeds 10MB. Please upload a smaller file.");
      return;
    }

    try {
      setUploadProgress(0);
      await sendFile(file, currentUserId, username, (progress) => {
        setUploadProgress(progress);
      });
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Combine initial and socket messages
  const allMessages = [...initialMessages, ...formattedSocketMessages];

  const MessageBubble = ({ msg }: { msg: Message }) => (
    <div className={`flex group ${msg.isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex gap-3 max-w-[70%] ${msg.isOwn ? "flex-row-reverse" : ""}`}>
        <Avatar className="h-8 w-8 shrink-0">
          <img src={`https://i.pravatar.cc/150?u=${msg.userId}`} alt={msg.sender} />
        </Avatar>
        <div className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"}`}>
          <p className="text-sm text-muted-foreground mb-1">{msg.sender}</p>
          <div
            className={`rounded-lg p-3 ${
              msg.isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            {msg.content && <p className="break-words">{msg.content}</p>}
            {msg.fileName && (
              <div className="mt-2">
                <p className="text-sm font-semibold mb-1">📎 {msg.fileName}</p>
                <a
                  href={msg.fileData || msg.fileUrl}
                  download={msg.fileName}
                  className="text-xs underline hover:no-underline"
                >
                  Download
                </a>
              </div>
            )}
            <p className="text-xs mt-1 opacity-70">{msg.time}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-h-[calc(100vh-64px)] relative">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center gap-3 max-w-6xl mx-auto w-full">
          <Avatar className="h-10 w-10">
            <img src={`https://i.pravatar.cc/150?u=${id}`} alt={groupName} />
          </Avatar>
          <div>
            <h3 className="font-semibold">{groupName}</h3>
            <p className="text-sm text-muted-foreground">
              {memberCount} members • {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Alerts */}
      {(loadError || socketError) && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loadError || socketError}</AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="text-muted-foreground">Loading messages...</span>
            </div>
          ) : (
            allMessages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="absolute bottom-20 left-0 right-0 px-4">
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 left-0 right-0 bg-background border-t z-20">
        <div className="max-w-6xl mx-auto w-full p-4">
          {isEmojiPickerVisible && (
            <div className="absolute bottom-full left-4 mb-2">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <div className="flex gap-2 items-center">
            <Button
              size="icon"
              variant="outline"
              className="rounded-lg p-2 shrink-0"
              onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
            >
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write your message..."
              className="flex-1 rounded-lg"
              disabled={!isConnected}
            />


            <Button
              size="icon"
              className="rounded-lg bg-primary text-primary-foreground p-2 shrink-0"
              onClick={handleSend}
              disabled={!message.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

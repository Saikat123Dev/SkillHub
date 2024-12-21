import {
  Copy,
  Edit2,
  Laugh,
  MoreVertical,
  Reply,
  Send,
  Share2,
  Smile,
  Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Message {
    id: number;
    sender: string;
    content: string;
    time: string;
    isOwn?: boolean;
    userId?: string;
    groupId?: string;
}

export function ChatArea({ id, requestId }: { id: string, requestId: string }) {
  const session = useSession();
const username = session.data?.user.name
    const [message, setMessage] = useState("");
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
    const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [lastMessageId, setLastMessageId] = useState(0);

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`/api/message?id=${id}&requestId=${requestId}`);
            const data = await response.json();
            const initialMessages = data.map((message: any) => ({
                id: message.id,
                sender: message.sender,
                content: message.content,
                time: message.time,
                isOwn: message.userId === requestId,
                userId: message.userId,
                groupId: message.groupId
            }));
            setMessages(initialMessages);
            setLastMessageId(data.length ? data[data.length - 1].id : 0); // Set the last message ID
        };

        fetchMessages();
    }, [id, requestId]);

    useEffect(() => {
        socketRef.current = io('http://localhost:8001');
        socketRef.current.on('message', (messageData: any) => {
            const parsedMessage = JSON.parse(messageData);
            const parsedMessage2 = JSON.parse(parsedMessage.message);
            const newMessage: Message = {
                id: lastMessageId + 1,
                sender: parsedMessage2.sender || 'Unknown',
                content: parsedMessage2.content,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                userId: parsedMessage2.userId,
                groupId: parsedMessage2.groupId
            };
            setLastMessageId(prev => prev + 1);
            setMessages(prev => [...prev, newMessage]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [lastMessageId]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setSelectedMessageId(null);
            }
        }

        if (selectedMessageId !== null) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [selectedMessageId]);

    const handleEmojiClick = (emoji: { emoji: string }) => {
        setMessage((prev) => prev + emoji.emoji);
    };

    const handleSend = () => {
        if (message.trim() && socketRef.current) {
            const timestamp = new Date();
            const newMessage = {
                content: message.trim(),
                sender: 'You',
                userId: requestId,
                groupId: id,
                timestamp: timestamp.toISOString(),
                time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Emit the complete message object to the socket server
            socketRef.current.emit('event:message', JSON.stringify(newMessage));

            // Add message to local state
            const localMessage: Message = {
                id: lastMessageId + 1,
                sender: 'You',
                content: message.trim(),
                userId: requestId,
                groupId: id,
                time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: true
            };

            setLastMessageId(prev => prev + 1);
            setMessages(prev => [...prev, localMessage]);
            setMessage("");
        }
    };

    const MessageActions = [
        {
            icon: Reply,
            label: "Reply",
            action: () => console.log("Reply")
        },
        {
            icon: Edit2,
            label: "Edit",
            action: () => console.log("Edit")
        },
        {
            icon: Trash2,
            label: "Delete",
            action: () => console.log("Delete")
        },
        {
            icon: Copy,
            label: "Copy",
            action: () => console.log("Copy")
        },
        {
            icon: Share2,
            label: "Forward",
            action: () => console.log("Forward")
        },
        {
            icon: Laugh,
            label: "React",
            action: () => console.log("React")
        }
    ];

    return (
        <div className="flex flex-col h-screen">
            {/* Header Section */}
            <div className="border-b p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <img src="https://i.pravatar.cc/150?u=group" alt="Group" />
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
                            onMouseEnter={() => setHoveredMessageId(message.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
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
                                 <p>{username}</p>
                                <div className="relative">
                                    {!message.isOwn && (
                                        <p className="text-sm text-muted-foreground mb-1">{message.sender}</p>
                                    )}
                                    <div
                                        className={`rounded-lg p-3 relative ${
                                            message.isOwn
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary"
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                        <p className="text-xs mt-1 opacity-70">{message.time}</p>

                                        {hoveredMessageId === message.id && (
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute -top-2 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full"
                                                onClick={() => setSelectedMessageId(
                                                    selectedMessageId === message.id ? null : message.id
                                                )}
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-500" />
                                            </Button>
                                        )}
                                    </div>

                                    {selectedMessageId === message.id && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute z-50 top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="p-1">
                                                {MessageActions.map((action) => (
                                                    <Button
                                                        key={action.label}
                                                        variant="ghost"
                                                        className="w-full justify-start px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                        onClick={action.action}
                                                    >
                                                        <action.icon className="mr-2 h-4 w-4 text-gray-500" />
                                                        {action.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Emoji Picker & Input Area */}
            <div className="border-t border-gray-300 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 relative">
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
                        <Smile className="h-5 w-5 text-gray-500 dark:text-gray-200" />
                    </Button>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message..."
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 px-4 py-2"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                    />
                    <Button
                        size="icon"
                        className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white p-3 transition-all duration-200 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        onClick={handleSend}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

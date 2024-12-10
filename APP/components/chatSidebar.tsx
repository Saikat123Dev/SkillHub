"use client";

import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import { Input } from "./ui/input";
import {  Users } from "lucide-react";

export function Sidebar() {
    const chats = [
        { id: 1, name: "Real estate deals", type: "group", status: "typing..." },
        { id: 2, name: "Kate Johnson", type: "direct", status: "online" },
        { id: 3, name: "Tamara Shevchenko", type: "direct", status: "offline" },
        { id: 4, name: "Joshua Clarkson", type: "direct", status: "online" },
        { id: 5, name: "Jeroen Zoet", type: "direct", status: "away" },
    ];

    return (
        <div className="flex h-full flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                        <img src="https://github.com/shadcn.png" alt="User" />
                    </Avatar>
                    <div>
                        <h3 className="font-semibold">Jontray Arnold</h3>
                        <p className="text-sm text-muted-foreground">available</p>
                    </div>
                </div>
                <div className="relative">
                    <Input
                        placeholder="Search"
                        className="pl-10 bg-secondary border border-transparent rounded-lg py-2 px-4 w-full transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                        >
                            {chat.type === "group" ? (
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="h-5 w-5" />
                                </div>
                            ) : (
                                <Avatar className="h-10 w-10">
                                    <img
                                        src={`https://i.pravatar.cc/150?u=${chat.id}`}
                                        alt={chat.name}
                                    />
                                </Avatar>
                            )}
                            <div>
                                <h4 className="font-medium">{chat.name}</h4>
                                <p className="text-sm text-muted-foreground">{chat.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

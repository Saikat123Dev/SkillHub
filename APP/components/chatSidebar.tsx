"use client";

import { useEffect, useState } from 'react';
import { useCurrentUser } from '../hooks/use-current-user';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Search, User, Shield, Crown } from "lucide-react";

interface Member {
  id: string;
  userId: string;
  groupId: string;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function Sidebar({ id }: { id: string }) {
  const currentUser = useCurrentUser();
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch group members
        const membersResponse = await fetch(`https://skill-hub-ftc6.vercel.app/api/groupMembers/${id}`);
        if (!membersResponse.ok) {
          throw new Error('Failed to fetch members');
        }
        const membersData: Member[] = await membersResponse.json();
        setMembers(membersData);

        // Fetch user details for each member
        const userPromises = membersData.map(async (member) => {
          const userResponse = await fetch(`https://skill-hub-ftc6.vercel.app/api/user/${member.userId}`);
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user details for userId: ${member.userId}`);
          }
          const userData: User = await userResponse.json();
          return { userId: member.userId, user: userData };
        });

        // Wait for all user details to be fetched
        const userResults = await Promise.all(userPromises);
        const usersMap = userResults.reduce((acc, { userId, user }) => {
          acc[userId] = user;
          return acc;
        }, {} as { [key: string]: User });

        setUsers(usersMap);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter members based on search query
  const filteredMembers = members.filter((member) => {
    const user = users[member.userId];
    if (!user) return false;
    return user.name.toLowerCase().includes(searchQuery);
  });

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="w-3 h-3 text-amber-500" />;
      case 'moderator':
        return <Shield className="w-3 h-3 text-blue-500" />;
      default:
        return <User className="w-3 h-3 text-gray-500" />;
    }
  };

  if (loading) return (
    <div className="flex h-full flex-col p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[80px]" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[60px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="text-center text-red-500 p-4 rounded-lg bg-red-50">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        {/* Current User Profile */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={currentUser.avatar || "https://github.com/shadcn.png"} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{currentUser.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Available
            </p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 w-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          <h4 className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Group Members ({filteredMembers.length})
          </h4>
          
          {filteredMembers.map((member) => {
            const user = users[member.userId];
            if (!user) return null;

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage 
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`} 
                    alt={user.name} 
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getRoleIcon(member.role)}
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.role.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
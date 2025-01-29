"use client";

import { useEffect, useState } from 'react';
import { Avatar } from "./ui/avatar";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

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
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Fetch group members
        const membersResponse = await fetch(`http://localhost:3000/api/groupMembers/${id}`);
        if (!membersResponse.ok) {
          throw new Error('Failed to fetch members');
        }
        const membersData: Member[] = await membersResponse.json();
        setMembers(membersData);

        // Fetch user details for each member
        const userPromises = membersData.map(async (member) => {
          const userResponse = await fetch(`http://localhost:3000/api/user/${member.userId}`);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          {members.map((member) => {
            const user = users[member.userId];
            if (!user) return null; // Skip rendering if user details are not available

            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <img
                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                    alt={user.name}
                  />
                </Avatar>
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{member.role.toLowerCase()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

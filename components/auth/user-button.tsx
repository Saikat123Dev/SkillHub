"use client";

import { FaUser, FaCog } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();
  const userId = user?.id;
  console.log(userId)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        {/* Profile */}
        <div>
          <DropdownMenuItem>
            <FaUser className="h-4 w-4 mr-2" />
           <Link href={`http://localhost:3000/my_profile/${userId}`}>
           Profile
           </Link>
          </DropdownMenuItem>
        </div>
        
        {/* Profile Settings */}
        <div>
          <DropdownMenuItem>
            <FaCog className="h-4 w-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
        </div>
        
        {/* Logout Button */}
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

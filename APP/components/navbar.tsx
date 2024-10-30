"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus,Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import SearchBar from "./search-bar";
import {useCurrentUser} from "@/hooks/use-current-user"
export const Navbar = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-full shadow-sm">
      <div className="flex items-center justify-between w-full space-x-4">
        {/* Use your SearchBar component here */}
        <SearchBar />

        
        <div className="flex items-center justify-center gap-10">

        <Link href={`http://localhost:3000/profile/${user?.id}/connection`}>
  <Bell size={30} color="black" style={{ fill: 'yellow', color: 'yellow' }} />
</Link>
          <Button className="border-neutral-200 dark:border-slate-800 transform transition-transform duration-300 hover:scale-95 px-3 py-1">
            <Link href="/feed" className="text-white rounded-full font-bold">
              Create Post
            </Link>
          </Button>
          <Button className="border-neutral-200 dark:border-slate-800 transform transition-transform duration-300 hover:scale-95 px-3 py-1">
            <Link
              href="/AddGroup"
              className="text-white rounded-full font-bold flex items-center"
            >
              <Plus className="mr-2" size={18} />{" "}
              Group
            </Link>
          </Button>


          <UserButton />
        </div>
      </div>
    </nav>
  );
};

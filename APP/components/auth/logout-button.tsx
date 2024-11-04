"use client";

import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter(); // Initialize router

  const onClick = async () => {
    await logout(); // Ensure logout completes
    router.push("/auth/login"); // Redirect to the login page
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

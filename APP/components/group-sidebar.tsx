"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

interface SidebarDemoProps {
    children: React.ReactNode;
    id: string;
    requestId: string;
    groupName: string;
}

export function SidebarDemo({ children, id, requestId, groupName }: SidebarDemoProps) {
    const links = [
        {
            label: "Chat",
            href: `${requestId}/Chat`,
            icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Task",
            href: `${requestId}/tasks`,
            icon: <IconUserBolt className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Calender",
            href: `${requestId}/calender`,
            icon: <IconSettings className="h-5 w-5 flex-shrink-0" />,
        }
    ];

    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            )}
        >
            {/* Sidebar */}
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="flex flex-col justify-between h-full gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {/* Render Logo or Logo Icon based on `open` */}
                        {open ? (
                            <Logo id={id} requestId={requestId} groupName={groupName} />
                        ) : (
                            <LogoIcon />
                        )}
                        {/* Render Navigation Links */}
                        <div className="mt-8 flex lg:flex-col gap-2">
                            {links.map((link, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    className="transition-transform duration-150 ease-in-out"
                                >
                                    <SidebarLink key={idx} link={link} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1">{children}</div>
        </div>
    );
}

interface LogoProps {
    id: string;
    requestId: string;
    groupName: string;
}

export const Logo = ({ id, requestId, groupName }: LogoProps) => {
    return (
        <Link
            href={`/group/${id}/${requestId}`}
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                {groupName}
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal lg:block hidden space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};

"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SidebarDemoProps {
    children: React.ReactNode;
    id: string;
    requestId: string;
    groupName:string;
}

export function SidebarDemo({ children, id, requestId,groupName }: SidebarDemoProps) {
    const links = [
        {
            label: "Dashboard",
            href: "#",
            icon: <IconBrandTabler className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Profile",
            href: "#",
            icon: <IconUserBolt className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Settings",
            href: "#",
            icon: <IconSettings className="h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Logout",
            href: "#",
            icon: <IconArrowLeft className="h-5 w-5 flex-shrink-0" />,
        },
    ];

    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="flex flex-col justify-between h-full gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo id={id} requestId={requestId} groupName={groupName} />: <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
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
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <Image
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex-1">{children}</div>
        </div>
    );
}

interface LogoProps {
    id: string;
    requestId: string;
    groupName:string;
}

export const Logo = ({ id, requestId,groupName }: LogoProps) => {
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
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};

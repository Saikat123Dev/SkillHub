"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types
interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
    isMobile: boolean;
}
interface MobileNavigationProps {
  children: React.ReactNode;
  className?: string;
}
// Context
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

// Main Sidebar Components
export const Sidebar = ({
    children,
    open,
    setOpen,
    animate = true,
}: {
    children: React.ReactNode;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate, isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const SidebarBody = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const { isMobile } = useSidebar();

    return isMobile ? (
        <MobileNavigation className={className}>{children}</MobileNavigation>
    ) : (
        <DesktopNavigation className={className}>{children}</DesktopNavigation>
    );
};

// Desktop Navigation
const DesktopNavigation = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const { open, setOpen, animate } = useSidebar();

    return (
        <motion.div
            className={cn(
                "h-full px-4 py-6 hidden md:flex md:flex-col",
                "bg-white dark:bg-neutral-900",
                "border-r border-neutral-200 dark:border-neutral-800",
                className
            )}
            animate={{
                width: animate ? (open ? "180px" : "50px") : "180px",
            }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div className="flex flex-col space-y-4">
                {children}
            </div>
        </motion.div>
    );
};

// Mobile Navigation
const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
  className,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center h-24 md:hidden">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "flex items-center gap-4 px-6 ",
          "bg-transparent backdrop-blur-md",
          "rounded-3xl border ",
          "max-w-fit mx-auto",
          className
        )}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-3 py-0 pb-10 rounded-full",
              "transition-all duration-300",
              "bg-gradient-to-br from-white/20 via-transparent to-white/10",
              "hover:bg-gradient-to-br hover:from-white/30 hover:to-white/15",
              " hover:shadow-xl"
            )}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};


// Sidebar Link Component
export const SidebarLink = ({
    link,
    className,
}: {
    link: NavItem;
    className?: string;
}) => {
    const { open, isMobile } = useSidebar();

    return (
        <Link
            href={link.href}
            className={cn(
                "group flex flex-col items-center gap-1 p-1 rounded-xl transition-all",
                isMobile ? [
                    "relative",
                    "min-w-[64px]",
                    "hover:bg-black/5 dark:hover:bg-white/5",
                ] : [
                    "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    "active:bg-neutral-200 dark:active:bg-neutral-700",
                ],
                className
            )}
        >
            <div className={cn(
                "flex-shrink-0 transition-colors",
                isMobile ? "w-6 h-6" : "w-5 h-5",
                "text-neutral-600 dark:text-neutral-400",
                "group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
            )}>
                {link.icon}
            </div>

            <span className={cn(
                "text-xs transition-colors",
                isMobile ? "font-medium" : "text-sm",
                !isMobile && !open && "hidden",
                "text-neutral-600 dark:text-neutral-400",
                "group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
            )}>
                {link.label}
            </span>
        </Link>
    );
};

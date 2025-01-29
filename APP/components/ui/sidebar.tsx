"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { createContext, useContext, useEffect, useState } from "react";

// Types remain the same
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

// Context and hooks remain the same
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

// Main Sidebar Components remain the same
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

// Desktop Navigation remains the same
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

// Enhanced Mobile Navigation
// Previous imports and context remain the same...

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
  className,
}) => {
  return (
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center items-center md:hidden">
          <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={cn(
                  "flex items-center gap-6 px-10",  // Increased gap between items
                  "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg",
                  "rounded-2xl border border-neutral-200 dark:border-neutral-800",
                  "shadow-lg shadow-neutral-900/10",
                  "max-w-fit mx-auto",
                  className
              )}
          >
              {React.Children.map(children, (child, index) => (
                  <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                          "flex flex-col items-center justify-center",
                          "px-5 py-1.5",  // Adjusted padding
                          "rounded-xl",
                          "-mt-6",  // Shift icons upward
                          "transition-all duration-200",
                          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                          "active:bg-neutral-200 dark:active:bg-neutral-700"
                      )}
                  >
                      {child}
                  </motion.div>
              ))}
          </motion.div>
      </div>
  );
};

// Enhanced SidebarLink Component with adjusted spacing
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
              "group flex items-center transition-all",
              isMobile ? [
                  "flex-col",
                  "gap-1.5",  // Reduced gap for mobile
                  "min-w-[48px]",
              ] : [
                  "gap-2 p-2",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  "active:bg-neutral-200 dark:active:bg-neutral-700",
              ],
              "rounded-xl",
              className
          )}
      >
          <div className={cn(
              "flex-shrink-0 transition-colors",
              isMobile ? "w-6 h-6" : "w-5 h-5",  // Slightly larger icons for mobile
              "text-neutral-600 dark:text-neutral-400",
              "group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
          )}>
              {link.icon}
          </div>

          <span className={cn(
              "transition-colors whitespace-nowrap",
              isMobile ? "text-xs font-medium" : "text-sm",  // Added font-medium for better readability
              !isMobile && !open && "hidden",
              "text-neutral-600 dark:text-neutral-400",
              "group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
          )}>
              {link.label}
          </span>
      </Link>
  );
};

export default MobileNavigation;

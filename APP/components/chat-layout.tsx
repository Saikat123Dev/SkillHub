"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ChatArea } from "./chat-area";
import { Sidebar } from "./chatSidebar";

export function ChatLayout({ id, requestId }: { id: string; requestId: string }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
            setIsSidebarVisible(window.innerWidth >= 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="h-screen w-full bg-background relative">
            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`lg:hidden fixed top-1/2 transform -translate-y-1/2 z-50 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors shadow-md`}
                style={{
                    left: isSidebarVisible ? "calc(100% - 48px)" : "8px", // Adjust position dynamically
                }}
                aria-label={isSidebarVisible ? "Close sidebar" : "Open sidebar"}
            >
                {isSidebarVisible ? (
                    <ChevronRight className="w-6 h-6" />
                ) : (
                    <ChevronLeft className="w-6 h-6" />
                )}
            </button>

            <PanelGroup direction="horizontal" className="h-full">
                <Panel defaultSize={55} minSize={30} className="border-r">
                    <ChatArea id={id} requestId={requestId} />
                </Panel>

                {(isLargeScreen || isSidebarVisible) && (
                    <>
                        <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/20 transition-colors" />
                        <Panel
                            defaultSize={20}
                            minSize={15}
                            className={`${!isLargeScreen ? 'fixed right-0 top-0 h-full bg-background shadow-lg' : ''}`}
                        >
                            <Sidebar id={id} />
                        </Panel>
                    </>
                )}
            </PanelGroup>
        </div>
    );
}

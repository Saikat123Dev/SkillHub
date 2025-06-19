"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { ChatArea } from "./chat-area";
import { Sidebar } from "./chatSidebar";

export default function ChatLayout({
  id,
  requestId,
}: {
  id: string;
  requestId: string;
}) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024;
      setIsLargeScreen(isLg);
      setIsSidebarVisible(isLg);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <div className="h-screen w-full bg-muted relative overflow-hidden">
      {/* Sidebar Toggle Button for Mobile */}
      {!isLargeScreen && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-1/2 z-50 p-2 transition-all duration-300 ease-in-out transform -translate-y-1/2 bg-primary text-white rounded-full shadow-lg hover:scale-105 focus:outline-none`}
          style={{
            left: isSidebarVisible ? "calc(100% - 3rem)" : "1rem",
          }}
          aria-label={isSidebarVisible ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarVisible ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      )}

      <PanelGroup direction="horizontal" className="h-full w-full">
        {/* Chat Area */}
        <Panel
          defaultSize={60}
          minSize={30}
          className="bg-background flex flex-col border-r border-border"
        >
          <ChatArea id={id} requestId={requestId} />
        </Panel>

        {/* Sidebar */}
        {(isLargeScreen || isSidebarVisible) && (
          <>
            <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/30 transition-colors" />
            <Panel
              defaultSize={30}
              minSize={20}
              className={`bg-background transition-all duration-300 ease-in-out ${
                !isLargeScreen ? "fixed right-0 top-0 h-full shadow-2xl z-40" : ""
              }`}
            >
              <Sidebar id={id} />
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
}

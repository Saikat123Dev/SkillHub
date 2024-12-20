"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar } from "./chatSidebar";
import { ChatArea } from "./chat-area";

export function ChatLayout() {
    return (
        <div className="h-screen w-full bg-background">

            <PanelGroup direction="horizontal" className="h-full">
                <Panel defaultSize={55} minSize={30} className="border-r">

                    <ChatArea />
                </Panel>
                <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/20 transition-colors" />
                <Panel defaultSize={20} minSize={15}>
                    <Sidebar />
                </Panel>
                <PanelResizeHandle className="w-1.5 bg-border hover:bg-primary/20 transition-colors" />

            </PanelGroup>
        </div>
    );
}

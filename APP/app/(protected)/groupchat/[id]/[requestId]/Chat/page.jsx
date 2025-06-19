"use client";

// @ts-ignore
import ChatLayout from "../../../../../../components/chat-layout";

export default function ChatRoom({params}) {
  const { id, requestId } = params;

  return (
    <main className="w-full h-screen overflow-hidden">
      <ChatLayout id={id} requestId={requestId} />
    </main>
  );
}

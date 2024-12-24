 "use client";
// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import { Send } from "lucide-react";
// import { useCurrentUser } from "@/hooks/use-current-user";
// import dynamic from "next/dynamic";
//
// const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
//
// const ChatRoom = () => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const messagesEndRef = useRef(null);
//   const session = useCurrentUser();
//   const username = session.name;
//
//   const room = "room1"; // Hardcoded room name
//
//   useEffect(() => {
//     const newSocket = io("http://localhost:3001", {
//       transports: ["websocket"],
//       withCredentials: true,
//     });
//
//     newSocket.on("connect", () => {
//       setConnectionStatus("connected");
//
//       // Join the room after connecting
//       if (username) {
//         newSocket.emit("joinRoom", { username, room }, () => {
//           console.log(`${username} joined room: ${room}`);
//         });
//       }
//     });
//
//     newSocket.on("connect_error", (error) => {
//       setConnectionStatus("error");
//     });
//
//     newSocket.on("disconnect", (reason) => {
//       setConnectionStatus("disconnected");
//     });
//
//     setSocket(newSocket);
//
//     return () => {
//       newSocket.close();
//     };
//   }, [username]);
//
//   useEffect(() => {
//     if (!socket) return;
//
//     const messageListener = (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     };
//
//     // Listen for messages within the room
//     socket.on("message", messageListener);
//
//     return () => {
//       socket.off("message", messageListener);
//     };
//   }, [socket]);
//
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);
//
//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (inputMessage.trim() && username.trim() && socket) {
//       const messageData = { user: username, message: inputMessage, date: new Date() }; // Add date to message
//       socket.emit('message', messageData);
//       setMessages((prevMessages) => [...prevMessages, messageData]);
//       setInputMessage('');
//
//
//       // Send the message to the room
//       socket.emit("message", messageData);
//
//       // Clear the input field
//       setInputMessage("");
//     }
//   };
//
//   // Use this to listen for messages from the server
//   useEffect(() => {
//     if (!socket) return;
//
//     const messageListener = (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     };
//
//     // Listen for messages within the room
//     socket.on("message", messageListener);
//
//     return () => {
//       socket.off("message", messageListener);
//     };
//   }, [socket]);
//
//   const onEmojiClick = (emojiObject) => {
//     setInputMessage((prevMessage) => prevMessage + emojiObject.emoji);
//   };
//
//   const toggleEmojiPicker = () => {
//     setShowEmojiPicker(!showEmojiPicker);
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 text-white flex flex-col items-center p-6">
//       <div className="shadow-lg rounded-lg border border-white border-opacity-20  p-4 flex justify-between items-center mb-4 w-full max-w-3xl">
//         <h1 className=" text-3xl font-bold text-gray-200">Group Chat</h1>
//         <span
//           className={`px-3 py-1 rounded-full text-black font-semibold ${
//             connectionStatus === 'connected'
//               ? 'bg-green-500'
//               : connectionStatus === 'error'
//               ? 'bg-red-500'
//               : 'bg-yellow-500'
//           }`}
//         >
//           {connectionStatus}
//         </span>
//       </div>
//       <div className="flex-grow overflow-auto rounded-lg p-4 shadow-inner w-full max-w-3xl">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-4 ${msg.user === username ? "text-right" : "text-left"}`}
//           >
//             <div
//               className={`inline-block p-3 rounded-lg transition-transform duration-200 ease-in-out ${
//                 msg.user === username ? 'bg-blue-200' : 'bg-gray-300'
//               }`}
//             >
//               <p className="font-semibold text-black">{msg.user}</p>
//               <p className="text-gray-700">{msg.message}</p>
//               <p className="text-xs text-gray-500 opacity-70">{msg.date ? new Date(msg.date).toLocaleString() : 'Just now'}</p>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={sendMessage} className="text-black bg-white p-4 flex items-center rounded-lg shadow-md mt-4 w-full max-w-3xl">
//         <button
//           type="button"
//           onClick={toggleEmojiPicker}
//           className="mr-2 px-3 py-2 rounded-full hover:bg-gray-400 transition"
//         >
//           😊
//         </button>
//         {showEmojiPicker && (
//           <div className="absolute bottom-16 left-0 z-10">
//             <Picker onEmojiClick={onEmojiClick} />
//           </div>
//         )}
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           className="flex-grow p-2 borderborder border-white border-opacity-20 bg-opacity-30 backdrop-blur-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           placeholder="Type a message..."
//         />
//         <button type="submit" className="bg-gray-500 text-black p-2 rounded-r-md hover:bg-gray-600 transition">
//           <Send size={24} />
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default ChatRoom;
// @ts-ignore

import { ChatLayout } from "@/components/chat-layout";

export default function ChatRoom({params}) {
  const {id, requestId} = params
  return (
      <div>
        <ChatLayout id={id} requestId={requestId} />

      </div>
  );
}

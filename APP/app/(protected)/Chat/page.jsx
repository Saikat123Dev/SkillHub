"use client"
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import dynamic from 'next/dynamic';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const ChatRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);
  const session = useCurrentUser();
  const username = session.name;

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
    });

    newSocket.on('connect_error', (error) => {
      setConnectionStatus('error');
    });

    newSocket.on('disconnect', (reason) => {
      setConnectionStatus('disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const messageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message', messageListener);

    return () => {
      socket.off('message', messageListener);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && username.trim() && socket) {
      const messageData = { user: username, message: inputMessage };
      socket.emit('message', messageData);
      
      // Immediately clear the input and add the message to the local state
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage('');
    }
  };

  const onEmojiClick = (emojiObject) => {
    setInputMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Group Chat</h1>
        <span
          className={`px-2 py-1 rounded ${
            connectionStatus === 'connected'
              ? 'bg-green-500'
              : connectionStatus === 'error'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          } text-white`}
        >
          {connectionStatus}
        </span>
      </div>
      <div className="flex-grow overflow-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.user === username ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.user === username ? 'bg-gray-300' : 'bg-gray-200'
              }`}
            >
              <p className="font-bold text-black">{msg.user}</p>
              <p>{msg.message}</p>
              <p className="text-xs opacity-50">{msg.date ? new Date(msg.date).toLocaleString() : 'Just now'}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="bg-white p-4 flex items-center relative">
        <button
          type="button"
          onClick={toggleEmojiPicker}
          className="mr-2 px-3 py-2 rounded bg-gray-300"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-0">
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-gray-500 text-white p-2 rounded-r hover:bg-gray-600">
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
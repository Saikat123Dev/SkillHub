import { ChatSocketClient, Message } from '@/services/socketClient';
import { useEffect, useRef, useState } from 'react';

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  onMessage?: (message: Message) => void;
}

export function useSocket(
  serverUrl: string,
  roomId: string,
  options: UseSocketOptions = {}
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<ChatSocketClient | null>(null);

  useEffect(() => {
    let isSubscribed = true;
    socketRef.current = new ChatSocketClient(serverUrl);

    const setupSocket = async () => {
      if (!socketRef.current || !isSubscribed) return;

      try {
        const unsubConnection = socketRef.current.onConnectionChange((status) => {
          if (isSubscribed) {
            setIsConnected(status);
            if (status) {
              options.onConnect?.();
            } else {
              options.onDisconnect?.();
            }
          }
        });

        await socketRef.current.joinRoom(roomId);

        const unsubMessage = socketRef.current.onMessage((message) => {
          if (isSubscribed) {
            setMessages(prev => [...prev, message]);
            options.onMessage?.(message);
          }
        });

        const unsubError = socketRef.current.onError((err) => {
          if (isSubscribed) {
            setError(err);
            options.onError?.(err);
          }
        });

        return () => {
          unsubConnection();
          unsubMessage();
          unsubError();
        };
      } catch (error) {
        if (isSubscribed) {
          setError(error instanceof Error ? error.message : 'Failed to setup socket');
        }
      }
    };

    const cleanup = setupSocket();

    return () => {
      isSubscribed = false;
      cleanup?.then(unsub => unsub?.());
      if (socketRef.current) {
        socketRef.current.leaveRoom(roomId).catch(console.error);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [serverUrl, roomId]);

  const sendMessage = async (content: string, userId: string, sender: string) => {
    if (!socketRef.current) {
      setError('Socket not initialized');
      return;
    }

    try {
      const message: Omit<Message, 'time' | 'isOwn'> = {
        id: `${Date.now()}-${userId}`,
        content,
        sender,
        userId,
        groupId: roomId
      };

      await socketRef.current.sendMessage(message);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send message');
    }
  };

  const sendFile = async (
    file: File,
    userId: string,
    sender: string,
    onProgress?: (progress: number) => void
  ) => {
    if (!socketRef.current) {
      setError('Socket not initialized');
      return;
    }

    try {
      await socketRef.current.sendFileMessage(
        roomId,
        userId,
        sender,
        file,
        onProgress
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send file');
    }
  };

  const clearError = () => setError(null);

  return {
    messages,
    error,
    clearError,
    sendMessage,
    sendFile,
    isConnected
  };
}

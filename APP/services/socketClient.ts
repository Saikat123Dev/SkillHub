import { io } from "socket.io-client";

export interface Message {
  id: string;
  sender: string;
  content?: string;
  time: string;
  isOwn?: boolean;
  userId?: string;
  groupId?: string;
  fileName?: string;
  fileData?: string;
  fileUrl?: string;
}

interface ServerToClientEvents {
  message: (data: string) => void;
  error: (error: string) => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
}

interface ClientToServerEvents {
  'event:message': (data: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export class ChatSocketClient {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];
  private errorHandlers: ((error: string) => void)[] = [];
  private connectionHandlers: ((status: boolean) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(serverUrl: string) {
    this.connect(serverUrl);
  }

  private connect(serverUrl: string) {
    try {
      const socketOptions = {
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling'],
        withCredentials: true,

        autoConnect: false  // Prevent auto-connection
      };

      this.socket = io(serverUrl, socketOptions);

      // Connect manually after setting up listeners
      this.setupEventListeners();
      this.socket.connect();  // Manually initiate connection here

    } catch (error) {
      console.error('Socket connection error:', error);
      this.notifyError('Failed to initialize socket connection');
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Listener for successful connection
    this.socket.on('connect', () => {
      console.log('Connected to socket server with ID:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(true);
    });

    // Listener for disconnect event
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      this.notifyConnectionChange(false);
    });

    // Listener for connection errors
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.notifyError(`Failed to connect after ${this.maxReconnectAttempts} attempts`);
        this.socket?.disconnect();
      }
    });

    // Listener for incoming messages
    this.socket.on("message", (message: string) => {
      console.log("📩 Incoming message:", message);

      try {
        const parsedMessage = JSON.parse(message);
        console.log("✅ Parsed message:", parsedMessage);

        const validMessage = this.validateMessage(parsedMessage);
        if (validMessage) {
          this.notifyMessageHandlers(validMessage);
        } else {
          console.error("❌ Received invalid message:", message);
        }
      } catch (error) {
        console.error("❌ Error parsing incoming message:", error);
      }
    });

  }


  private validateMessage(message: any): Message | null {
    if (!message.id || !message.sender) {
      console.error('Invalid message format:', message);
      return null;
    }
    return message as Message;
  }

  public joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket is not initialized'));
        return;
      }

      this.socket.once('connect', () => {
        this.socket?.emit('join:group', roomId);
        resolve();
      });

      if (!this.socket.connected) {
        console.log('Socket not connected yet, waiting...');
      }
    });
  }

  public leaveRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket is not initialized'));
        return;
      }

      this.socket.once('connect', () => {
        this.socket?.emit('leave:group', roomId);
        resolve();
      });

      if (!this.socket.connected) {
        console.log('Socket not connected yet, waiting...');
      }
    });
  }

  public sendMessage(message: Omit<Message, 'time' | 'isOwn'>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      try {
        const messageWithTime = {
          ...message,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        };

        this.socket.emit('event:message', JSON.stringify(messageWithTime));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public sendFileMessage(
    groupId: string,
    userId: string,
    sender: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const messageId = `${Date.now()}-${userId}`;
          const message = {
            id: messageId,
            sender,
            userId,
            groupId,
            fileName: file.name,
            fileData: reader.result as string,
          };

          await this.sendMessage(message);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (onProgress) {
        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress((event.loaded / event.total) * 100);
          }
        };
      }

      reader.readAsDataURL(file);
    });
  }

  public onMessage(handler: (message: Message) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public onError(handler: (error: string) => void): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(h => h !== handler);
    };
  }

  public onConnectionChange(handler: (status: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    };
  }

  private notifyMessageHandlers(message: Message): void {
    this.messageHandlers.forEach(handler => handler(message));
  }

  private notifyError(error: string): void {
    this.errorHandlers.forEach(handler => handler(error));
  }

  private notifyConnectionChange(status: boolean): void {
    this.connectionHandlers.forEach(handler => handler(status));
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

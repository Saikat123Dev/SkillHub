import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { Server, Socket } from "socket.io";

interface Message {
  content: string;
  sender: string;
  timestamp: number;
}

interface GroupMessage {
  groupId: string;
  message: Message;
}

class SocketService {
  private _io: Server;
  private pub: Redis;
  private sub: Redis;
  private prisma: PrismaClient;

  constructor() {
    console.log("Init Socket Service...");
    this.prisma = new PrismaClient();  // Initialize Prisma Client

    // Initialize Redis clients
    this.pub = new Redis("rediss://default:AbwVAAIjcDE2Yjg0ZThjNDk4M2Q0ZjMxODkxZjMwY2EwNjkwNmY3YXAxMA@keen-bream-48149.upstash.io:6379");

    this.sub = new Redis("rediss://default:AbwVAAIjcDE2Yjg0ZThjNDk4M2Q0ZjMxODkxZjMwY2EwNjkwNmY3YXAxMA@keen-bream-48149.upstash.io:6379");

    // Subscribe to Redis channel
    this.sub.on("message", (channel, messageStr) => {
      if (channel === "GROUP_MESSAGES") {
        try {
          const { groupId, message } = JSON.parse(messageStr);
          console.log(`Broadcasting message to group ${groupId}`);
          console.log(`Message content: ${JSON.stringify(message)}`);

          // Fetch clients in the room before broadcasting the message
          this.io.of("/").in(groupId).fetchSockets().then(sockets => {
            const clients = sockets.map(socket => socket.id);  // Get socket IDs
            console.log(`Clients in group ${groupId}:`, clients);
          }).catch(err => {
            console.error("Error fetching clients in room:", err);
          });

          // Broadcast the message to the group room
          this.io.to(groupId).emit("message", JSON.stringify(message));
          console.log(`Message broadcasted to room ${groupId}`);
        } catch (error) {
          console.error("Error processing Redis message:", error);
        }
      }
    });

    // Initialize Socket.IO server
    this._io = new Server({
      cors: {
        origin: "skill-hub-ftc6.vercel.app", // Make sure this matches your client URL exactly
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["*"]
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling']
    });

    this.sub.subscribe("GROUP_MESSAGES", (err) => {
      if (err) {
        console.error("Failed to subscribe to Redis channel:", err);
      }
    });
  }

  public initListeners() {
    console.log("Init Socket Listeners...");

    this._io.on("connect", (socket: Socket) => {
      console.log(`New Socket Connected: ${socket.id}`);

      socket.on("disconnect", (reason) => {
        console.log(`Socket ${socket.id} disconnected due to ${reason}`);
      });

      socket.onAny((event, ...args) => {
        console.log(`Event received: ${event}`, args);
      });

      socket.on("join:group", (groupId: string) => {
        if (!groupId) {
          socket.emit("error", "Group ID is required");
          return;
        }
        console.log(`Socket ${socket.id} joining group ${groupId}`);
        socket.join(groupId);
        socket.emit("group:joined", groupId);
      });

      socket.on("leave:group", (groupId: string) => {
        if (!groupId) {
          socket.emit("error", "Group ID is required");
          return;
        }
        console.log(`Socket ${socket.id} leaving group ${groupId}`);
        socket.leave(groupId);
        socket.emit("group:left", groupId);
      });

      // Modify the event:message handler
      socket.on("event:message", async (messageStr: string) => {
        try {
          const data = JSON.parse(messageStr);
          console.log("Received message data:", data);

          if (!data.groupId || !data.content) {
            socket.emit("error", "Invalid message format");
            return;
          }

          // Add proper message formatting
          const messageData = {
            ...data,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          };

          // Save message to database in parallel with Redis publish
          const saveMessagePromise = this.prisma.message.create({
            data: {
              content: messageData.content,
              groupId: data.groupId,
              userId: data.userId || null,  // Assuming userId is passed with the message
            }
          });

          const publishMessagePromise = this.pub.publish(
            "GROUP_MESSAGES",
            JSON.stringify({
              groupId: data.groupId,
              message: messageData
            })
          );

          // Wait for both operations to complete in parallel
          await Promise.all([saveMessagePromise, publishMessagePromise]);

          console.log("Published message to Redis and saved to DB:", messageData);

        } catch (error) {
          console.error("Error handling message:", error);
          socket.emit("error", "Failed to process message");
        }
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;

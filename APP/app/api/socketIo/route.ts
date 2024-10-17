import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/utils/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const GET = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // Adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    // Append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

// You can also define other HTTP methods if needed
export const POST = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  // Handle POST requests if necessary
};

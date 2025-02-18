import http from "http";

import SocketService from "./src/lib/socket";

async function init() {
  try {
    // Initialize socket service
    const socketService = new SocketService();

    // Create HTTP server
    const httpServer = http.createServer();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8001;

    // Initialize socket listeners before attaching to server
    socketService.initListeners();

    // Attach socket service to HTTP server with CORS configuration
    socketService.io.attach(httpServer, {
      cors: {
        origin: ["https://skill-hub-ftc6.vercel.app"], // Add your client's origin
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["*"]
      },
      maxHttpBufferSize: 10 * 1024 * 1024,
    });

    // Start Kafka message consumer


    // Enhanced error handling for socket connections
    socketService.io.on('connection_error', (error) => {
      console.error('Socket.IO Connection Error:', error);
    });

    socketService.io.on('connect', (socket) => {
      console.log(`Client connected with ID: ${socket.id}`);

      socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
      });
    });

    // Server error handling
    httpServer.on('error', (error) => {
      console.error('HTTP Server Error:', error);
      if ((error as any).code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });

    // Start the server
    httpServer.listen(PORT, () => {
      console.log(`HTTP Server started at PORT: ${PORT}`);
      console.log(`Socket.IO server is ready to accept connections`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async () => {
      console.log('Received shutdown signal. Closing server...');

      // Close socket connections
      await new Promise<void>((resolve) => {
        socketService.io.close(() => {
          console.log('Socket.IO server closed');
          resolve();
        });
      });

      // Close HTTP server
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          console.log('HTTP Server closed');
          resolve();
        });
      });

      process.exit(0);
    };

    // Handle various termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    // Global error handlers
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Log the error but don't exit immediately to allow for graceful shutdown
      gracefulShutdown();
    });

  } catch (error) {
    console.error('Server Initialization Error:', error);
    process.exit(1);
  }
}

// Start the server
init().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});

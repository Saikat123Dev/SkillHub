import http from "http";
import { startMessageConsumer } from "./src/lib/kafka";
import SocketService from "./src/lib/socket";

async function init() {
  try {
    // Start Kafka message consumer
    await startMessageConsumer().catch((kafkaError) => {
      console.error('Failed to start Kafka message consumer:', kafkaError);
      throw kafkaError;
    });

    // Initialize socket service
    const socketService = new SocketService();

    // Create HTTP server
    const httpServer = http.createServer();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8001;

    // Attach socket service to HTTP server
    socketService.io.attach(httpServer);

    // Error handling for socket connections
    socketService.io.on('connection_error', (error) => {
      console.error('Socket.IO Connection Error:', error);
    });

    // Server error handling
    httpServer.on('error', (error) => {
      console.error('HTTP Server Error:', error);

      // Handle specific port-related errors
      if ((error as any).code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });

    // Start the server
    httpServer.listen(PORT, () => {
      console.log(`HTTP Server started at PORT: ${PORT}`);
    });

    // Initialize socket listeners
    socketService.initListeners();

    // Graceful shutdown handling
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down gracefully...');
      httpServer.close(() => {
        console.log('HTTP Server closed');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Optional: exit the process in case of critical errors
      process.exit(1);
    });

  } catch (error) {
    console.error('Initialization Error:', error);
    process.exit(1);
  }
}

init();

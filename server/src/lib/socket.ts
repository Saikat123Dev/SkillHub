import Redis from "ioredis";
import { Server } from "socket.io";
import { produceMessage } from "./kafka";

const pub = new Redis();

const sub = new Redis();

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
            maxHttpBufferSize: 10 * 1024 * 1024,
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io = this.io;
        console.log("Init Socket Listeners...");

        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id);
            socket.on("event:message", async (message ) => {
                console.log("New Message Rec.", message);
                // publish this message to redis
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            });
        });

        sub.on("message", async (channel, message) => {
            if (channel === "MESSAGES") {
                console.log("new message from redis", message);
                io.emit("message", message);
                await produceMessage(message);
                console.log("Message Produced to Kafka Broker");
            }
        });
    }

    get io() {
        return this._io;
    }
}

export default SocketService;

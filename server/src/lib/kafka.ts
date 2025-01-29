import { Kafka, Producer } from "kafkajs";
import prismaClient from "./prisma";

const kafka = new Kafka({
    clientId:"kafka_service",
    brokers: ['localhost:9092']
});


let producer: Producer | null = null;


export async function createProducer(): Promise<Producer> {
    if (producer) return producer;

    producer = kafka.producer();
    try {
        await producer.connect();
        console.log("Producer connected to Kafka");
    } catch (error) {
        console.error("Failed to connect producer:", error);
        throw error;
    }
    return producer;
}

export async function produceMessage(message: string): Promise<boolean> {
    const producer = await createProducer();
    try {
        await producer.send({
            topic: "MESSAGES",
            messages: [{ key: `message-${Date.now()}`, value: message }],
        });
        console.log(`Message sent: ${message}`);
        return true;
    } catch (error) {
        console.error("Failed to produce message:", error);
        return false;
    }
}


export async function startMessageConsumer() {
  console.log("Consumer is starting...");
  const consumer = kafka.consumer({ groupId: "default-group" });

  try {
      await consumer.connect();
      await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

      await consumer.run({
          eachMessage: async ({ message }) => {
              if (!message.value) return;

              const messageText = message.value.toString();
              console.log("Received message:", messageText);

              try {
                  // Parse the message as a JSON object
                  const parsedMessage = JSON.parse(messageText);
                  if (parsedMessage && parsedMessage.message) {
                      // Parse the inner message JSON
                      const msg = JSON.parse(parsedMessage.message);

                      // Save to the database
                      const data = await prismaClient.message.create({
                          data: {
                              content: msg.content, // This is the actual content
                              userId: msg.userId,
                              groupId: msg.groupId
                          },
                      });

                      console.log("Message saved to database", data);
                  } else {
                      console.error('Message format invalid:', parsedMessage);
                  }
              } catch (err) {
                  console.error("Failed to parse or save message:", err);
              }
          },
      });
      console.log("Consumer is running...");
  } catch (error) {
      console.error("Failed to start consumer:", error);
  }
}

export default kafka;

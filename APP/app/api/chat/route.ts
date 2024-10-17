// pages/api/chat.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiResponseServerIO } from '@/utils/next'; // Ensure this is the correct path for your custom response

export function POST(req: NextApiRequest, res: NextApiResponseServerIO) {
  // Get message from the request body
  const message = req.body;

  // Ensure that the message is defined and not empty
  if (!message || Object.keys(message).length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  // Emit the message to the 'message' channel
  res?.socket?.server?.io?.emit('message', message);

  // Return the message as a response
  return res.status(201).json(message);
}

// Handle other HTTP methods (optional)
export function OPTIONS(req: NextApiRequest, res: NextApiResponseServerIO) {
  res.setHeader('Allow', ['POST', 'OPTIONS']);
  res.status(200).end();
}

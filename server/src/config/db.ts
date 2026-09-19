import mongoose from 'mongoose';
import { config } from './config.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    isConnected = true;
    console.log(`[MongoDB] Connected to ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Connection error: ${err.message}`);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Connection disconnected');
      isConnected = false;
    });
  } catch (error) {
    console.error(`[MongoDB] Failed to connect: ${(error as Error).message}`);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('[MongoDB] Connection closed');
  }
}

export function isDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

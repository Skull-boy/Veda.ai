import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vedaai';

  mongoose.connection.on('connected', () => {
    console.log('[mongodb] Connected to MongoDB');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[mongodb] Connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[mongodb] Disconnected from MongoDB');
  });

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
}

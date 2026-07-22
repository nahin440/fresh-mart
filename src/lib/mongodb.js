import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not defined — running in demo mode with JSON data');
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (!MONGODB_URI) return null;
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Don't cache a failed connection attempt — otherwise one bad connect
    // permanently breaks every request on this warm serverless instance
    // until Vercel cold-starts a new one, even after the underlying issue
    // (e.g. a transient network blip, or a not-yet-whitelisted IP) is fixed.
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

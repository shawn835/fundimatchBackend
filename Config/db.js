import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) throw new Error('MONGO_URI is not defined');

const client = new MongoClient(uri);

let isConnected = false;

export const connectToDb = async () => {
  try {
    if (!isConnected) {
      await client.connect();
      isConnected = true;
      console.log('Connected to MongoDB');

      client.db(process.env.MONGO_DB_NAME);
    }
    return client.db(process.env.MONGO_DB_NAME);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

export const readCollection = async (collectionName) => {
  try {
    const db = await connectToDb();
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw new Error('Database error');
  }
};

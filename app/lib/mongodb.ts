import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

if (!process.env.MONGODB_URI) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI must be defined in production.");
  }
  console.log(
    "No MONGODB_URI environment variable found. Using default URI for development."
  );
}

const client = new MongoClient(uri);
let isConnected = false;

export async function connectToDatabase(): Promise<MongoClient> {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log("Connected to MongoDB.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
  return client;
}

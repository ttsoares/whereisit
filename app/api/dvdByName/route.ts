import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { MongoClient, Db } from "mongodb";
import { DVDDoc } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json(); // Get the name from the request body

    if (!name) {
      return NextResponse.json(
        { error: "DVD name is required" },
        { status: 400 }
      );
    }

    const client: MongoClient = await connectToDatabase();
    const db: Db = client.db("whereisit");

    // Check if a DVD with the same name exists
    const existingDvd = await db.collection<DVDDoc>("dvds").findOne({ name });

    if (existingDvd) {
      return NextResponse.json({
        exists: true,
        dvd: existingDvd,
        message: "A DVD with this name already exists",
      });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking DVD existence:", error);
    return NextResponse.json(
      { error: "Failed to check DVD existence" },
      { status: 500 }
    );
  }
}

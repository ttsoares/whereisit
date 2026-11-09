import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { MongoClient } from "mongodb";
import { DVDDoc } from "@/app/lib/types";
import { wildcardToRegex } from "@/app/lib/functions";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query || typeof query !== "string" || query.length > 100) {
    return NextResponse.json(
      { error: "Invalid query parameter (1 to 100 characters)." },
      { status: 400 }
    );
  }

  try {
    const client: MongoClient = await connectToDatabase();
    const db = client.db("whereisit");

    // Runs inside Mongo on the flat `files` array: only the matches leave the DB
    const results = await db
      .collection<DVDDoc>("dvds")
      .aggregate([
        { $project: { _id: 0, name: 1, files: 1 } },
        { $unwind: "$files" },
        { $match: { "files.name": { $regex: wildcardToRegex(query), $options: "is" } } },
        { $project: { dvd: "$name", name: "$files.name", path: "$files.path" } },
      ])
      .toArray();

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching files:", error);
    return NextResponse.json(
      { error: "Failed to search files." },
      { status: 500 }
    );
  }
}

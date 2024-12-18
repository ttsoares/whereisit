import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { MongoClient } from "mongodb";
import { DVDDoc, DirectoryItem } from "@/app/lib/types";

// Recursive function to search through contents
async function searchContents(
  items: DirectoryItem[],
  regex: RegExp,
  results: { name: string; path: string }[]
) {
  for (const item of items) {
    if (item.type === "file" && regex.test(item.name)) {
      results.push({ name: item.name, path: item.path });
    } else if (item.type === "directory" && item.contents) {
      await searchContents(item.contents, regex, results);
    }
  }
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json(
      { error: "Invalid query parameter." },
      { status: 400 }
    );
  }

  // Convert the wildcard query to a regex pattern
  const regexPattern = "^" + query.replace(/\*/g, ".*") + "$"; // Convert '*' to '.*'
  const regex = new RegExp(regexPattern, "i"); // Case-insensitive

  const results: { name: string; path: string }[] = [];

  try {
    const client: MongoClient = await connectToDatabase();
    const db = client.db("whereisit");

    const cursor = db.collection<DVDDoc>("dvds").find();
    while (await cursor.hasNext()) {
      const dvd = await cursor.next();
      if (dvd) {
        await searchContents(dvd.contents, regex, results);
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error searching files:", error);
    return NextResponse.json(
      { error: "Failed to search files." },
      { status: 500 }
    );
  }
}

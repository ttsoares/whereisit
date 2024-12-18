import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { MongoClient, Db } from "mongodb";
import { DVDDoc, DirectoryItem } from "@/app/lib/types";

async function calculateFileStatistics() {
  const client: MongoClient = await connectToDatabase();
  const db: Db = client.db("whereisit");

  let totalFiles = 0;
  let totalSize = 0;

  // Cursor to iterate through each DVD document one at a time
  const cursor = db.collection<DVDDoc>("dvds").find();

  while (await cursor.hasNext()) {
    const dvd = await cursor.next();

    if (dvd) {
      // Calculate file count and size for the current DVD document
      const { fileCount, fileSize } = calculateFilesAndSize(dvd.contents);
      totalFiles += fileCount;
      totalSize += fileSize;
    }
  }

  return { totalFiles, totalSize };
}

// Recursive helper function to count files and sizes within a DVD's contents
function calculateFilesAndSize(contents: DirectoryItem[]) {
  let fileCount = 0;
  let fileSize = 0;

  for (const item of contents) {
    if (item.type === "file") {
      fileCount += 1;
      fileSize += item.size || 0;
    } else if (item.type === "directory" && item.contents) {
      const result = calculateFilesAndSize(item.contents); // Recursive traversal
      fileCount += result.fileCount;
      fileSize += result.fileSize;
    }
  }

  return { fileCount, fileSize };
}

export async function GET() {
  try {
    const { totalFiles, totalSize } = await calculateFileStatistics();
    const response = NextResponse.json({ totalFiles, totalSize });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("Error calculating file statistics:", error);
    return NextResponse.json(
      { error: "Failed to calculate file statistics" },
      { status: 500 }
    );
  }
}

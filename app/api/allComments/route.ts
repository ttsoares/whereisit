import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { MongoClient, Db } from "mongodb";
import { revalidateTag } from "next/cache";

interface DVDDoc {
  name: string;
  comment: string;
}

async function getAllComments(): Promise<DVDDoc[]> {
  try {
    const client: MongoClient = await connectToDatabase();
    const db: Db = client.db("whereisit");
    const dvds = await db
      .collection<DVDDoc>("dvds")
      .find(
        { comment: { $ne: "comment" } },
        { projection: { name: 1, comment: 1, _id: 0 } }
      )
      .toArray();
    return dvds;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function GET() {
  const dvds = await getAllComments();
  revalidateTag("dvds");
  if (dvds.length !== 0) {
    const response = NextResponse.json({ dvds });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } else {
    return NextResponse.json({ error: "No DVDs found" }, { status: 404 });
  }
}

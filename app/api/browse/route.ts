import { NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";
import { connectToDatabase } from "@/app/lib/mongodb";

import { DVDDoc } from "@/app/lib/types";

export async function POST(req: Request) {
  try {
    const { dvdName } = await req.json();

    if (!dvdName || !dvdName.startsWith("DVD-")) {
      return NextResponse.json(
        { error: "Invalid DVD name format" },
        { status: 400 }
      );
    }

    // Extract the numeric part of the DVD name
    const targetNumber = parseInt(dvdName.replace("DVD-", ""), 10);

    if (isNaN(targetNumber)) {
      return NextResponse.json(
        { error: "Invalid DVD number" },
        { status: 400 }
      );
    }

    const client: MongoClient = await connectToDatabase();
    const db: Db = client.db("whereisit");

    // Window of 5 around the target; the DB itself decides where the collection starts and ends
    const dvdNames = [-2, -1, 0, 1, 2]
      .map((d) => targetNumber + d)
      .filter((n) => n >= 1)
      .map((n) => `DVD-${String(n).padStart(3, "0")}`);

    // Query the database for DVDs with the calculated names
    const dvds = await db
      .collection<DVDDoc>("dvds")
      .find({ name: { $in: dvdNames } }, { projection: { files: 0 } })
      .toArray();

    // $in returns storage order, which is not name order
    const num = (d: DVDDoc) => parseInt(d.name.replace("DVD-", ""), 10);
    dvds.sort((a, b) => num(a) - num(b));

    if (dvds.length === 0) {
      return NextResponse.json(
        { error: `No DVDs around ${dvdName}: end of the collection.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ dvds });
  } catch (error) {
    console.error("Error in /api/browse:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

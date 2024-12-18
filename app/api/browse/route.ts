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

    // return error if the target number is too small
    if (targetNumber < 3) {
      return NextResponse.json(
        { error: "Reached the beginning of the collection" },
        { status: 400 }
      );
    }

    const client: MongoClient = await connectToDatabase();
    const db: Db = client.db("whereisit");

    const collection = db.collection<DVDDoc>("dvds");
    const estimate = await collection.estimatedDocumentCount();

    // 76 and 413 are dead.
    // the number of registers is 2 less than the number on DVD's name
    const lastPossibleNumber = estimate - 2;
    if (targetNumber > lastPossibleNumber) {
      return NextResponse.json(
        { error: "Reached the end of the collection" },
        { status: 400 }
      );
    }

    // Calculate the range of DVD numbers to fetch
    const dvdNumbers = [
      targetNumber - 2,
      targetNumber - 1,
      targetNumber,
      targetNumber + 1,
      targetNumber + 2,
    ];
    const dvdNames = dvdNumbers.map((num) => {
      if (num < 10) {
        return `DVD-00${num}`;
      }
      if (num < 100) {
        return `DVD-0${num}`;
      }
      return `DVD-${num}`;
    });

    // Query the database for DVDs with the calculated names
    const dvds = await db
      .collection<DVDDoc>("dvds")
      .find({ name: { $in: dvdNames } })
      .toArray();

    return NextResponse.json({ dvds });
  } catch (error) {
    console.error("Error in /api/browse:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

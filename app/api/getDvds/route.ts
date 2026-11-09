import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import { MongoClient } from "mongodb";
import { DVDDoc } from "@/app/lib/types";

// Without this Next 14 prerenders the GET at build time and the totals freeze
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client: MongoClient = await connectToDatabase();
    // Per-DVD totals are stored at save time; Mongo sums them and returns one small doc
    const [totals] = await client
      .db("whereisit")
      .collection<DVDDoc>("dvds")
      .aggregate([
        { $group: { _id: null, totalFiles: { $sum: "$fileCount" }, totalSize: { $sum: "$totalSize" } } },
      ])
      .toArray();

    const response = NextResponse.json({
      totalFiles: totals?.totalFiles ?? 0,
      totalSize: totals?.totalSize ?? 0,
    });
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

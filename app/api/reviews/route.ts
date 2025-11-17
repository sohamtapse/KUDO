import { NextResponse } from "next/server";
import Review from "@/models/Review";
import "../../../db/db";

export async function GET() {
  const reviews = await Review.find().sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

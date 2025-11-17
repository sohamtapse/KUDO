import { NextResponse } from "next/server";
import Review from "@/models/Review";

export async function GET() {
  const reviews = await Review.find().sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

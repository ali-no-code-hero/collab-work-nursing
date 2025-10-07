import { NextResponse } from "next/server";

// Optional proxy endpoint for CORS-friendly job fetching
export async function GET() {
  const upstream = process.env.JOBS_API_URL;
  if (!upstream) {
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
  const res = await fetch(upstream);
  const data = await res.json();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";

// Optional proxy endpoint for CORS-friendly job fetching
export async function GET(request: Request) {
  const upstream = process.env.JOBS_API_URL;
  const apiKey = process.env.COLLABWORK_API_KEY;
  
  if (!upstream) {
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
  
  // Get query parameter from URL, default to "nursing" for nursing jobs
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'nursing';
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  // Add query parameter to the URL
  const urlWithQuery = `${upstream}?query=${encodeURIComponent(query)}`;
  
  const res = await fetch(urlWithQuery, { headers });
  const data = await res.json();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";

// API endpoint for getting personalized nursing jobs based on email
export async function GET(request: Request) {
  const apiKey = process.env.COLLABWORK_API_KEY;
  const apiUrl = 'https://api.collabwork.com/api:partners/get_nursing_form_record_jobs';
  
  if (!apiKey) {
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
  
  // Get email parameter from URL, default to chosennurse@hotmail.com
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'chosennurse@hotmail.com';
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add email and api_key to the URL
  const urlWithParams = `${apiUrl}?email=${encodeURIComponent(email)}&api_key=${apiKey}`;
  
  try {
    const res = await fetch(urlWithParams, { headers });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching personalized jobs:', error);
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
}

import { NextResponse } from "next/server";

// API endpoint for getting personalized nursing jobs based on email
export async function GET(request: Request) {
  const apiKey = process.env.COLLABWORK_API_KEY;
  const apiUrl = process.env.JOBS_API_URL || 'https://api.collabwork.com/api:partners/get_nursing_form_record_jobs';
  
  console.log('Environment variables:', {
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined',
    apiUrl: apiUrl,
    nodeEnv: process.env.NODE_ENV
  });
  
  if (!apiKey) {
    console.error('COLLABWORK_API_KEY is not set');
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
  
  console.log('Making API request to:', urlWithParams);
  
  try {
    const res = await fetch(urlWithParams, { headers });
    console.log('API response status:', res.status);
    
    const data = await res.json();
    console.log('API response data:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching personalized jobs:', error);
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
}

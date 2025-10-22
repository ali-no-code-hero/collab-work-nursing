import { NextResponse } from "next/server";

// API endpoint for getting personalized nursing jobs based on email
export async function GET(request: Request) {
  const apiKey = process.env.COLLABWORK_API_KEY;
  const apiUrl = process.env.JOBS_API_URL || 'https://api.collabwork.com/api:partners/get_nursing_form_record_jobs';
  
  console.log('Environment variables:', {
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'undefined',
    apiUrl: apiUrl,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('COLLAB') || key.includes('JOBS'))
  });
  
  if (!apiKey) {
    console.error('COLLABWORK_API_KEY is not set');
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
  
  // Get email parameter from URL, default to chosennurse@hotmail.com
  // Handle + symbol in email addresses properly by parsing the raw query string
  const url = new URL(request.url);
  const rawQuery = url.search;
  let email = 'chosennurse@hotmail.com';
  
  if (rawQuery) {
    const emailMatch = rawQuery.match(/[?&]email=([^&]*)/);
    if (emailMatch) {
      // Decode the email parameter while preserving + symbols
      email = decodeURIComponent(emailMatch[1]);
      console.log('Raw email parameter:', emailMatch[1]);
      console.log('Decoded email:', email);
    }
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add email and api_key to the URL
  const urlWithParams = `${apiUrl}?email=${encodeURIComponent(email)}&api_key=${apiKey}`;
  
  console.log('Making API request to:', urlWithParams);
  console.log('API key being used:', apiKey);
  
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

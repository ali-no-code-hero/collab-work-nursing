import { NextResponse } from "next/server";

// API endpoint for getting personalized nursing jobs based on email
export async function GET(request: Request) {
  const apiKey = process.env.XANO_API_KEY || process.env.COLLABWORK_API_KEY;
  const apiUrl = 'https://api.collabwork.com/api:partners/get_nursing_form_record_jobs';
  
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
      
      // Fix the common issue where + gets converted to space in browser URLs
      // Check if the email contains spaces and if so, convert them back to +
      if (email.includes(' ') && email.includes('@')) {
        email = email.replace(/ /g, '+');
      }
      
      // Improved email validation
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(email) || email.length > 254) {
        return NextResponse.json(
          { error: 'Invalid email address' }, 
          { status: 400 }
        );
      }
      
      // Prevent email injection attacks by ensuring no special characters
      if (email.includes(';') || email.includes('<') || email.includes('>')) {
        return NextResponse.json(
          { error: 'Invalid email format' }, 
          { status: 400 }
        );
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Decoded email:', email.substring(0, 10) + '...');
      }
    }
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add email and api_key to the URL
  const urlWithParams = `${apiUrl}?email=${encodeURIComponent(email)}&api_key=${apiKey}`;
  
  // Log request details without exposing API key
  console.log('Making API request to:', `${apiUrl}?email=${encodeURIComponent(email)}&api_key=***REDACTED***`);
  // API key logged for debugging only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('API key (first 10 chars):', apiKey?.substring(0, 10) + '...');
  }
  
  try {
    const res = await fetch(urlWithParams, { 
      headers,
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    console.log('API response status:', res.status);
    
    if (!res.ok) {
      console.error('API error:', res.status, res.statusText);
      return NextResponse.json({ jobs: [] }, { status: 200 });
    }
    
    const data = await res.json();
    console.log('API response data:', data);
    
    // Add security headers to response
    return NextResponse.json(data, {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    });
  } catch (error) {
    console.error('Error fetching personalized jobs:', error);
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
}

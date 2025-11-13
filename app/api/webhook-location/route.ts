import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { validateCSRF } from "../../../lib/csrf";

export async function POST(request: NextRequest) {
  // CSRF protection
  if (!validateCSRF(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }
  const apiKey = process.env.XANO_API_KEY;
  
  if (!apiKey) {
    console.error('XANO_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { email, city, state } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      console.error('Missing or invalid email:', email);
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!city || typeof city !== 'string' || !state || typeof state !== 'string') {
      console.error('Missing or invalid city/state:', { city, state });
      return NextResponse.json({ error: 'City and state are required' }, { status: 400 });
    }

    // Sanitize and validate email
    const sanitizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Sanitize city and state
    const sanitizedCity = city.trim().substring(0, 100);
    const sanitizedState = state.trim().substring(0, 2).toUpperCase();

    // Validate state is 2 characters (US state code)
    if (sanitizedState.length !== 2) {
      return NextResponse.json({ error: 'Invalid state code' }, { status: 400 });
    }

    // Call external API
    // Create timeout signal (fallback for older Node.js versions)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    let response;
    try {
      response = await fetch('https://api.collabwork.com/api:partners/webhook_just_state_nurse_ascent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          city: sanitizedCity,
          state: sanitizedState,
          api_key: apiKey,
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request timeout after 10 seconds');
        return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
      }
      throw fetchError; // Re-throw to be caught by outer catch
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Location webhook error:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
        url: 'https://api.collabwork.com/api:partners/webhook_just_state_nurse_ascent',
      });
      return NextResponse.json({ 
        error: 'Failed to process location',
        details: process.env.NODE_ENV === 'development' ? errorText : undefined
      }, { status: 500 });
    }

    const responseText = await response.text();
    return NextResponse.json({ success: true, response: responseText });
  } catch (error) {
    console.error('Error in webhook-location API:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}


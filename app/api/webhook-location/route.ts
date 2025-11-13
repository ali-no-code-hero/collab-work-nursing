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
    const body = await request.json();
    const { email, city, state } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!city || typeof city !== 'string' || !state || typeof state !== 'string') {
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
    const response = await fetch('https://api.collabwork.com/api:partners/webhook_just_state_nurse_ascent', {
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
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Location webhook error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to process location' }, { status: 500 });
    }

    const responseText = await response.text();
    return NextResponse.json({ success: true, response: responseText });
  } catch (error) {
    console.error('Error in webhook-location API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


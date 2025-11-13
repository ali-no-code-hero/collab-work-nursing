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
    const { job_title, job_url, email, job_eid } = body;

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Sanitize and validate email
    const sanitizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(sanitizedEmail) || sanitizedEmail.length > 254) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Sanitize other fields
    const sanitizedJobTitle = (job_title || '').toString().trim().substring(0, 500);
    const sanitizedJobUrl = (job_url || '').toString().trim().substring(0, 2000);
    const sanitizedJobEid = (job_eid || '').toString().trim().substring(0, 100);

    // Call external API
    const response = await fetch('https://api.collabwork.com/api:ERDpOWih/log_apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        job_title: sanitizedJobTitle,
        job_url: sanitizedJobUrl,
        email: sanitizedEmail,
        job_eid: sanitizedJobEid,
        api_key: apiKey,
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.error('Failed to log apply:', response.status);
      return NextResponse.json({ error: 'Failed to log apply' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in log-apply API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


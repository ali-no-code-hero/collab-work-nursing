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
    const { 
      email, 
      city, 
      state, 
      licenses, 
      specialties, 
      job_types, 
      current_workplace, 
      open_to_opportunities,
      id 
    } = body;

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

    // Sanitize all fields
    const sanitizedCity = city ? city.trim().substring(0, 100) : '';
    const sanitizedState = state ? state.trim().substring(0, 2).toUpperCase() : '';
    const sanitizedWorkplace = current_workplace ? current_workplace.trim().substring(0, 200) : '';
    
    // Sanitize arrays
    const sanitizedLicenses = Array.isArray(licenses) 
      ? licenses.map((l: string) => l.toString().trim().substring(0, 100)).filter(Boolean)
      : [];
    const sanitizedSpecialties = Array.isArray(specialties)
      ? specialties.map((s: string) => s.toString().trim().substring(0, 100)).filter(Boolean)
      : [];
    const sanitizedJobTypes = Array.isArray(job_types)
      ? job_types.map((j: string) => j.toString().trim().substring(0, 100)).filter(Boolean)
      : [];

    // Build payload
    const payload: Record<string, any> = {
      city: sanitizedCity,
      state: sanitizedState,
      email: sanitizedEmail,
      licenses: sanitizedLicenses,
      specialties: sanitizedSpecialties,
      job_types: sanitizedJobTypes,
      current_workplace: sanitizedWorkplace,
      open_to_opportunities: open_to_opportunities || '',
      api_key: apiKey,
    };

    if (id) {
      payload.id = String(id).substring(0, 100);
    }

    // Call external API
    const response = await fetch('https://api.collabwork.com/api:partners/webhook_curated_jobs_nurse_ascent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000), // 15 second timeout for form submission
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Submit webhook error:', response.status, errorText);
      return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in webhook-submit API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


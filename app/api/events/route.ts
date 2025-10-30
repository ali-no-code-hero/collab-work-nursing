import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Minimal server-side log; extend to persist as needed
    console.log('[EVENT]', JSON.stringify(body));
    return NextResponse.json({ status: 'ok' });
  } catch (e: any) {
    console.error('Failed to log event', e?.message || e);
    return NextResponse.json({ status: 'error' }, { status: 400 });
  }
}



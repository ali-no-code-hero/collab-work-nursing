import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute per IP
  // Stricter limits for form submission endpoints
  formSubmissionLimit: 5, // 5 submissions per minute
};

function getRateLimitKey(request: NextRequest): string {
  // Get IP address for rate limiting
  const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  // For POST requests, try to get email from body if available
  const url = new URL(request.url);
  const email = url.searchParams.get('email') || 'unknown';
  return `${ip}-${email}`;
}

function checkRateLimit(key: string, maxRequests: number = RATE_LIMIT.maxRequests): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    const pathname = request.nextUrl.pathname;
    
    // Stricter rate limiting for form submission endpoints
    const isFormSubmission = pathname.includes('webhook-submit') || pathname.includes('webhook-location');
    const limit = isFormSubmission ? RATE_LIMIT.formSubmissionLimit : RATE_LIMIT.maxRequests;
    
    const allowed = checkRateLimit(key, limit);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': limit.toString(),
          }
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};


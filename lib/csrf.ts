import { NextRequest } from 'next/server';

/**
 * Simple CSRF protection by checking Origin header
 * For production, consider implementing token-based CSRF protection
 */
export function validateCSRF(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Allow requests from same origin (no origin header) or from our domain
  if (!origin) {
    // Same-origin request (no origin header)
    return true;
  }
  
  // Check if origin matches our domain
  const allowedOrigins: string[] = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://collab-work-nursing.vercel.app',
    'https://collab-work-nursing-env-staging-collab-work-1ae2c176.vercel.app',
  ].filter((url): url is string => typeof url === 'string' && url.length > 0);
  
  // Allow requests from our domains
  if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return true;
  }
  
  // For development, allow localhost
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return true;
  }
  
  return false;
}


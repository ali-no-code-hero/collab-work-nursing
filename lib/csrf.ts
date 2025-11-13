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
    // Also check referer as fallback for same-origin requests
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        const hostname = refererUrl.hostname;
        const allowedHostnames = [
          'na.collabwork.com',
          'collab-work-nursing.vercel.app',
          'localhost',
        ];
        if (allowedHostnames.some(allowed => hostname === allowed || hostname.endsWith(`.${allowed}`))) {
          return true;
        }
      } catch (e) {
        // Invalid referer URL, continue with normal validation
      }
    }
    return true;
  }
  
  // Check if origin matches our domain
  const allowedOrigins: string[] = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'https://collab-work-nursing.vercel.app',
    'https://collab-work-nursing-env-staging-collab-work-1ae2c176.vercel.app',
    'https://na.collabwork.com',
    'http://na.collabwork.com',
  ].filter((url): url is string => typeof url === 'string' && url.length > 0);
  
  // Allow requests from our domains
  // Check both exact match and startsWith for flexibility
  if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
    return true;
  }
  
  // Also check hostname match as fallback
  try {
    const originUrl = new URL(origin);
    const originHostname = originUrl.hostname;
    const allowedHostnames = [
      'na.collabwork.com',
      'collab-work-nursing.vercel.app',
      'localhost',
    ];
    if (allowedHostnames.some(allowed => originHostname === allowed || originHostname.endsWith(`.${allowed}`))) {
      return true;
    }
  } catch (e) {
    // Invalid origin URL, continue with normal validation
  }
  
  // For development, allow localhost
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return true;
  }
  
  // Log CSRF rejection for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.warn('CSRF validation failed:', { origin, referer, allowedOrigins });
  }
  
  return false;
}


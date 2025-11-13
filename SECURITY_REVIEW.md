# Security Review & Recommendations

## Current Security Measures ✅

1. **Security Headers** - Good implementation:
   - CSP (Content Security Policy)
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security
   - X-XSS-Protection

2. **Rate Limiting** - Implemented for API routes (20 requests/minute)

3. **Input Validation** - Basic email validation exists

4. **Error Handling** - Errors don't expose sensitive information

5. **HTTPS Enforcement** - HSTS header configured

## Security Issues & Recommendations 🔒

### 🔴 Critical Issues

#### 1. **API Key Exposure in Client-Side Code**
**Issue**: `NEXT_PUBLIC_XANO_API_KEY` is exposed in browser bundle, making it visible to anyone.

**Risk**: API key can be extracted and abused.

**Recommendation**: 
- Move all API calls that require authentication to server-side API routes
- Never expose API keys in client-side code
- Use server-side API routes as a proxy for all authenticated requests

**Files Affected**:
- `app/page.tsx` (log_page_view)
- `components/JobCard.tsx` (log_apply)
- `app/form/page.tsx` (webhook calls)

#### 2. **Missing Input Length Limits**
**Issue**: Form inputs don't have `maxLength` attributes, allowing potential DoS attacks via large payloads.

**Risk**: Attackers could submit extremely large strings, causing server issues.

**Recommendation**: Add `maxLength` to all text inputs:
- Email: 254 characters (RFC 5321)
- City: 100 characters
- State: Already limited (dropdown)
- Workplace: 200 characters

### 🟡 High Priority Issues

#### 3. **Weak Email Validation**
**Issue**: Basic regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) doesn't catch all invalid formats.

**Recommendation**: Use a more robust email validation library or stricter regex:
```typescript
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
```

#### 4. **No CSRF Protection**
**Issue**: Form submissions don't have CSRF tokens.

**Risk**: Cross-site request forgery attacks.

**Recommendation**: 
- Implement CSRF tokens for form submissions
- Use Next.js built-in CSRF protection or add tokens manually
- Verify origin/referer headers

#### 5. **Rate Limiting Only on API Routes**
**Issue**: Rate limiting only applies to `/api/*` routes, not form submissions.

**Risk**: Form submissions can be spammed.

**Recommendation**: Extend rate limiting to form submission endpoints or add client-side rate limiting.

#### 6. **CSP Allows 'unsafe-inline' and 'unsafe-eval'**
**Issue**: Content Security Policy allows inline scripts and eval.

**Risk**: XSS attacks easier to execute.

**Recommendation**: 
- Remove `'unsafe-inline'` and `'unsafe-eval'` from CSP
- Use nonces or hashes for inline scripts
- Move all inline scripts to external files

### 🟢 Medium Priority Issues

#### 7. **Session Storage Not Encrypted**
**Issue**: Sensitive form data stored in `sessionStorage` without encryption.

**Risk**: XSS attacks could read sensitive data.

**Recommendation**: 
- Don't store sensitive data in sessionStorage
- If necessary, encrypt sensitive data before storage
- Consider using httpOnly cookies for sensitive data

#### 8. **Excessive Console Logging**
**Issue**: Many `console.log` statements in production code.

**Risk**: Information leakage, performance impact.

**Recommendation**: 
- Remove or conditionally log only in development
- Use a logging library that respects NODE_ENV
- Never log sensitive data (API keys, emails, etc.)

#### 9. **No Input Sanitization**
**Issue**: User inputs are not sanitized before being sent to APIs.

**Risk**: Injection attacks, XSS.

**Recommendation**: 
- Sanitize all user inputs before API calls
- Use libraries like `DOMPurify` for HTML sanitization
- Escape special characters in strings

#### 10. **Geolocation API Usage**
**Issue**: Geolocation API is used without explicit user consent check.

**Recommendation**: Ensure proper user consent flow for geolocation access.

### 🔵 Low Priority / Best Practices

#### 11. **Error Messages Could Be More Generic**
**Recommendation**: Ensure error messages don't reveal system internals.

#### 12. **API Timeout Configuration**
**Good**: Already implemented (10 second timeout in jobs route).

**Recommendation**: Apply timeouts to all external API calls.

#### 13. **CORS Configuration**
**Current**: Only allows GET, OPTIONS for API routes.

**Recommendation**: Review CORS settings to ensure they're as restrictive as needed.

## Implementation Priority

1. **Immediate**: Move API keys to server-side (Critical)
2. **High**: Add input length limits (Critical)
3. **High**: Improve email validation (High)
4. **High**: Add CSRF protection (High)
5. **Medium**: Remove unsafe CSP directives (High)
6. **Medium**: Extend rate limiting (High)
7. **Medium**: Sanitize inputs (Medium)
8. **Low**: Reduce console logging (Medium)

## Additional Security Considerations

- **Dependency Scanning**: Regularly scan for vulnerable dependencies
- **Security Headers**: Consider adding `Permissions-Policy` more restrictively
- **Monitoring**: Implement security monitoring and alerting
- **Regular Audits**: Schedule regular security audits
- **Penetration Testing**: Consider professional penetration testing


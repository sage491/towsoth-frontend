# Security Configuration for Towsoth Frontend

This document outlines the security measures implemented in the frontend and configuration needed for production deployment.

## Content Security Policy (CSP)

To protect against XSS and other injection attacks, configure the following CSP headers on your hosting service:

### Recommended CSP Headers

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.towsoth.edu https://*.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

### For Netlify

Add to `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.towsoth.edu https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### For Vercel

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.towsoth.edu https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

## Security Features Implemented

### 1. Input Sanitization
- All user inputs are sanitized before being sent to the backend
- SQL injection patterns are detected and blocked
- XSS attack vectors are neutralized using DOMPurify

### 2. Email Validation
- Email addresses are validated using the `validator` library
- Ensures proper format before authentication

### 3. Password Validation
- Minimum 8 characters required
- Must contain uppercase, lowercase, numbers, and special characters
- Password strength indicator provided to users

### 4. Request Data Sanitization
- All API request bodies are automatically sanitized
- Dangerous characters and SQL injection patterns are removed
- Special handling for password fields (validated but not sanitized)

### 5. XSS Protection
- DOMPurify library integrated for HTML sanitization
- Prevents malicious script injection
- Safe rendering of user-generated content

### 6. Client-side Rate Limiting
- RateLimiter class available for throttling requests
- Prevents brute force attacks
- Configurable attempt limits and time windows

## Environment Variables

Ensure the following environment variables are set:

```
VITE_API_BASE_URL=https://api.towsoth.edu
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## HTTPS Enforcement

Always serve the application over HTTPS in production. Configure your hosting provider to:
1. Enforce HTTPS redirects
2. Use HSTS (HTTP Strict Transport Security)
3. Use valid SSL/TLS certificates

## Regular Security Updates

1. Run `npm audit` regularly to check for vulnerabilities
2. Update dependencies promptly when security patches are released
3. Review and update CSP headers as the application evolves

## Additional Recommendations

### Backend Security (to be implemented on backend)
1. Use parameterized queries to prevent SQL injection
2. Implement rate limiting on API endpoints
3. Use CSRF tokens for state-changing operations
4. Implement proper session management
5. Validate and sanitize all inputs on the server side
6. Use prepared statements for database queries
7. Implement input validation middleware
8. Add request size limits
9. Use secure password hashing (bcrypt/argon2)
10. Implement proper CORS configuration

### Authentication
1. Use secure, httpOnly cookies for authentication tokens
2. Implement token expiration and refresh mechanisms
3. Add account lockout after failed login attempts
4. Use 2FA (Two-Factor Authentication) for sensitive accounts

## Testing Security

Run the following tests regularly:
1. `npm audit` - Check for dependency vulnerabilities
2. Manual penetration testing
3. XSS attack simulation
4. SQL injection testing on backend
5. CSRF testing

## Incident Response

If a security vulnerability is discovered:
1. Document the issue immediately
2. Assess the severity and impact
3. Implement a fix as soon as possible
4. Update all affected systems
5. Notify users if necessary
6. Review logs for potential exploitation

## Contact

For security concerns or to report vulnerabilities, please contact:
security@towsoth.edu

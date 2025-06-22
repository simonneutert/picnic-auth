/** Creates security headers for responses */
export function createSecurityHeaders(): Headers {
  const headers = new Headers();
  
  // Prevent MIME type sniffing
  headers.set("X-Content-Type-Options", "nosniff");
  
  // Prevent page from being displayed in frame/iframe
  headers.set("X-Frame-Options", "DENY");
  
  // Enable XSS filtering (legacy browsers)
  headers.set("X-XSS-Protection", "1; mode=block");
  
  // HSTS for HTTPS connections (31536000 = 1 year)
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  
  // Prevent referrer information leakage
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Basic Content Security Policy
  headers.set("Content-Security-Policy", "default-src 'none'; script-src 'none'; object-src 'none'");
  
  return headers;
}

/** Combines CORS and security headers */
export function createCombinedHeaders(corsOrigin: string): Headers {
  const headers = createSecurityHeaders();
  headers.set("Access-Control-Allow-Origin", corsOrigin);
  return headers;
}
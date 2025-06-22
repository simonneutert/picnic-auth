/** Rate limiter entry */
interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

/** Rate limiter configuration */
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

/** In-memory rate limiter using sliding window */
export class RateLimiter {
  private attempts = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;
  private cleanupInterval: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.config = { maxAttempts, windowMs };
    
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /** Check if IP is rate limited */
  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(ip);

    if (!entry) {
      // First attempt from this IP
      this.attempts.set(ip, { attempts: 1, windowStart: now });
      return false;
    }

    // Check if window has expired
    if (now - entry.windowStart >= this.config.windowMs) {
      // Reset window
      this.attempts.set(ip, { attempts: 1, windowStart: now });
      return false;
    }

    // Increment attempts in current window
    entry.attempts++;
    
    return entry.attempts > this.config.maxAttempts;
  }

  /** Get remaining attempts for IP */
  getRemainingAttempts(ip: string): number {
    const entry = this.attempts.get(ip);
    if (!entry) return this.config.maxAttempts;

    const now = Date.now();
    if (now - entry.windowStart >= this.config.windowMs) {
      return this.config.maxAttempts;
    }

    return Math.max(0, this.config.maxAttempts - entry.attempts);
  }

  /** Get time until rate limit resets */
  getResetTime(ip: string): number {
    const entry = this.attempts.get(ip);
    if (!entry) return 0;

    const now = Date.now();
    const resetTime = entry.windowStart + this.config.windowMs;
    return Math.max(0, resetTime - now);
  }

  /** Add rate limit headers to response */
  addHeaders(headers: Headers, ip: string): void {
    const remaining = this.getRemainingAttempts(ip);
    const resetTime = Math.ceil(this.getResetTime(ip) / 1000);
    
    headers.set("X-RateLimit-Limit", this.config.maxAttempts.toString());
    headers.set("X-RateLimit-Remaining", remaining.toString());
    headers.set("X-RateLimit-Reset", resetTime.toString());
  }

  /** Clean up expired entries */
  private cleanup(): void {
    const now = Date.now();
    for (const [ip, entry] of this.attempts.entries()) {
      if (now - entry.windowStart >= this.config.windowMs) {
        this.attempts.delete(ip);
      }
    }
  }

  /** Destroy rate limiter and cleanup */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.attempts.clear();
  }
}

/** Extract IP address from request */
export function getClientIP(req: Request): string {
  // Check common headers for real IP
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const xRealIP = req.headers.get("x-real-ip");
  if (xRealIP) {
    return xRealIP;
  }

  // Fallback to connection info (may not be available in all environments)
  return "unknown";
}
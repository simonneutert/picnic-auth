import { initFromEnv } from "./lib/init-from-env.ts";
import { routeAuth } from "./lib/route-auth.ts";
import { routeBearerAuth } from "./lib/route-bearer-auth.ts";
import { stringTo32ByteArray } from "./lib/string-to-32byte-array.ts";
import { createCorsHeaders } from "./lib/cors-header.ts";
import { RateLimiter, getClientIP } from "./lib/rate-limiter.ts";

const { user, expirationTime, JWTsecret, serverPort, corsOrigin } = initFromEnv();

let encodedJWTSecret: Uint8Array;
if (!JWTsecret || JWTsecret.length < 32) {
  throw new Error("Secret key not set or too short");
} else {
  encodedJWTSecret = await stringTo32ByteArray(JWTsecret, JWTsecret);
}

// Initialize rate limiter (5 attempts per 15 minutes)
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000);

const AUTH_ROUTE = new URLPattern({ pathname: "/auth" });
const BEARER_ROUTE = new URLPattern({ pathname: "/auth/bearer" });

async function handler(req: Request): Promise<Response> {
  const matchAuthRoute = AUTH_ROUTE.exec(req.url);
  const matchBearerRoute = BEARER_ROUTE.exec(req.url);
  const clientIP = getClientIP(req);

  if (matchAuthRoute && req.method === "POST") {
    // Check rate limit for auth endpoint
    if (rateLimiter.isRateLimited(clientIP)) {
      const headers = createCorsHeaders(corsOrigin);
      rateLimiter.addHeaders(headers, clientIP);
      return new Response("Too Many Requests", {
        status: 429,
        headers,
      });
    }

    const response = await routeAuth(req, user, encodedJWTSecret, expirationTime, corsOrigin);
    
    // Add rate limit headers to all auth responses
    rateLimiter.addHeaders(response.headers, clientIP);
    
    return response;
  }

  if (matchBearerRoute && req.method === "POST") {
    return await routeBearerAuth(req, encodedJWTSecret, corsOrigin);
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: createCorsHeaders(corsOrigin),
  });
}

Deno.serve({ port: serverPort }, handler);

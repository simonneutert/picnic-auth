import { PicnicAccount } from "./picnic-account.ts";
import { createJWT } from "./picnic-jwt.ts";

import * as bcrypt from "bcrypt";
import { promiseWithTimeout } from "./promise-with-timeout.ts";
import { createCorsHeaders } from "./cors-header.ts";

/** Handles basic authentication for a request */
export async function routeAuth(
  req: Request,
  user: PicnicAccount,
  secret: Uint8Array,
  expirationTime: string,
  corsOrigin: string,
): Promise<Response> {
  try {
    // Validate Content-Type header
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return new Response("Content-Type must be application/json", {
        status: 400,
        headers: createCorsHeaders(corsOrigin),
      });
    }

    // Check request size limit (1KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1024) {
      return new Response("Request too large", {
        status: 413,
        headers: createCorsHeaders(corsOrigin),
      });
    }

    const requestBody = await promiseWithTimeout(
      req.json(),
      5000,
      "Request timed out",
    ) as { username: string; password: string };

    // Validate input format
    const validationError = validateAuthInput(requestBody);
    if (validationError) {
      return new Response(validationError, {
        status: 400,
        headers: createCorsHeaders(corsOrigin),
      });
    }

    const { username, password } = requestBody;

    // Always perform bcrypt comparison to prevent timing attacks
    // Use stored password hash as comparison target regardless of username validity
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    // Use constant-time comparison for username
    const isUsernameMatch = constantTimeStringCompare(username, user.username);
    
    if (isUsernameMatch && isPasswordMatch) {
      const jwt = await createJWT(user, secret, expirationTime);
      return new Response(JSON.stringify(jwt), {
        headers: createCorsHeaders(corsOrigin),
      });
    } else {
      return respondWithUnauthorized(corsOrigin);
    }
  } catch (error) {
    console.error(error);
    return respondWithUnauthorized(corsOrigin);
  }
}

/** Validates authentication input */
function validateAuthInput(body: unknown): string | null {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }

  const bodyObj = body as Record<string, unknown>;

  if (!bodyObj.username || typeof bodyObj.username !== "string") {
    return "Username is required and must be a string";
  }

  if (!bodyObj.password || typeof bodyObj.password !== "string") {
    return "Password is required and must be a string";
  }

  // Basic format validation
  if (bodyObj.username.length < 1 || bodyObj.username.length > 100) {
    return "Username must be between 1 and 100 characters";
  }

  if (bodyObj.password.length < 1 || bodyObj.password.length > 200) {
    return "Password must be between 1 and 200 characters";
  }

  // Check for basic SQL injection patterns (basic protection)
  const sqlPattern = /('|('')|;|--|\/\*|\*\/|xp_|sp_)/i;
  if (sqlPattern.test(bodyObj.username) || sqlPattern.test(bodyObj.password)) {
    return "Invalid characters in credentials";
  }

  return null;
}

/** Constant-time string comparison to prevent timing attacks */
function constantTimeStringCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/** Responds with an unauthorized response */
function respondWithUnauthorized(corsOrigin: string): Response {
  return new Response("Unauthorized", {
    status: 401,
    headers: createCorsHeaders(corsOrigin),
  });
}

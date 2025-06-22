import * as jose from "jose";
import { createCorsHeaders } from "./cors-header.ts";

/** Handles bearer token authentication for a request */
export async function routeBearerAuth(
  req: Request,
  secret: Uint8Array,
  corsOrigin: string,
): Promise<Response> {
  const authHeader = parseBearerTokenFromHeader(
    req.headers.get("Authorization"),
  );
  try {
    const { payload } = await jose.jwtDecrypt(
      authHeader,
      secret,
    );
    return new Response(JSON.stringify(payload), {
      headers: createCorsHeaders(corsOrigin),
    });
  } catch (_error) {
    console.error("JWT validation failed");
    return new Response("Unauthorized", {
      status: 401,
      headers: createCorsHeaders(corsOrigin),
    });
  }
}

/** Parses the bearer token from the Authorization header */
export function parseBearerTokenFromHeader(
  bearerToken: string | null,
): string {
  if (bearerToken == null) return "";

  const tokens = bearerToken.split(" ");
  if (tokens.length !== 2) {
    return "";
  }
  return tokens.pop() || "";
}

/** Decrypts a JWT */
export async function decryptJwt(
  jwt: string,
  secret: Uint8Array,
): Promise<jose.JWTDecryptResult> {
  return await jose.jwtDecrypt(jwt, secret);
}

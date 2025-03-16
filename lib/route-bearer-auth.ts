import * as jose from "jose";
import corsHeader from "./cors-header.ts";

/** Handles bearer token authentication for a request */
export async function routeBearerAuth(
  req: Request,
  secret: Uint8Array,
): Promise<Response> {
  const authHeader = parseBearerTokenFromHeader(
    req.headers.get("Authorization"),
  );
  let debugProtectedHeader: jose.CompactJWEHeaderParameters | unknown;
  try {
    const { payload, protectedHeader } = await jose.jwtDecrypt(
      authHeader,
      secret,
    );
    debugProtectedHeader = protectedHeader;
    return new Response(JSON.stringify(payload), {
      headers: corsHeader.header,
    });
  } catch (error) {
    console.error(error);
    if (debugProtectedHeader) {
      console.error(debugProtectedHeader);
    }

    return new Response("Unauthorized", {
      status: 401,
      headers: corsHeader.header,
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

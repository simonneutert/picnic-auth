import * as jose from "jose";

/** Convert a string to a 32-byte array */
export function stringTo32ByteArray(
  secret: string,
): Uint8Array {
  const decodedSecret = jose.base64url.decode(
    new TextEncoder().encode(secret + secret),
  );
  return decodedSecret.slice(0, 32); // Limit to 32 bytes
}

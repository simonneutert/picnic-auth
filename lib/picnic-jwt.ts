import * as jose from "jose";

import { PicnicAccount } from "./picnic-account.ts";

// https://github.com/panva/jose/blob/main/docs/jwt/encrypt/classes/EncryptJWT.md
export async function createJWT(
  user: PicnicAccount,
  secret: Uint8Array,
  expirationTime: string,
): Promise<string> {
  const jwt = await new jose.EncryptJWT({ username: user.username })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    // .setIssuer("urn:example:issuer")
    // .setAudience("urn:example:audience")
    .setExpirationTime(expirationTime) // see lib/jose-jwt-expiration-time.ts
    .encrypt(secret);

  return jwt;
}

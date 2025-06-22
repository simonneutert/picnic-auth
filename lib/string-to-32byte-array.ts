/** Convert a string to a 32-byte array using proper key derivation */
export async function stringTo32ByteArray(
  secret: string,
): Promise<Uint8Array> {
  // Import the secret as raw key material
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // Derive a 32-byte key using PBKDF2
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("picnic-auth-salt-v1"), // Fixed salt for simplicity
      iterations: 100000, // OWASP recommended minimum
      hash: "SHA-256"
    },
    keyMaterial,
    256 // 32 bytes * 8 bits
  );

  return new Uint8Array(derivedKey);
}

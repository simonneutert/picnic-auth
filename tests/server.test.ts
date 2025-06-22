import { PicnicAccount } from "../lib/picnic-account.ts";
import * as bcrypt from "bcrypt";
import { defaultPasswordBcrypt } from "../lib/default-password-bcrypt.ts";
import { createJWT } from "../lib/picnic-jwt.ts";
import { assert, assertEquals } from "jsr:@std/assert";
import { defaultUsername } from "../lib/default-username.ts";
import { validateExpirationTime } from "../lib/jose-jwt-expiration-time.ts";
import { stringTo32ByteArray } from "../lib/string-to-32byte-array.ts";
import { parseBearerTokenFromHeader } from "../lib/route-bearer-auth.ts";

Deno.test("async test", async () => {
  const jwt = createJWT(
    { username: "picnic", password: "mypicnic" },
    await stringTo32ByteArray("secretsecretsecretsecretsecretsecretsecretsecret"),
    "1h",
  );

  assert((await jwt).startsWith("eyJ"));
});

Deno.test("stringTo32ByteSecret", async () => {
  const derivedKey = await stringTo32ByteArray("secretsecretsecretsecretsecretsecretsecretsecret");
  
  // Test that it returns 32 bytes
  assertEquals(derivedKey.length, 32);
  
  // Test that it's deterministic (same input = same output)
  const derivedKey2 = await stringTo32ByteArray("secretsecretsecretsecretsecretsecretsecretsecret");
  assertEquals(derivedKey, derivedKey2);
  
  // Test that different inputs produce different outputs
  const differentKey = await stringTo32ByteArray("differentsecret");
  assert(derivedKey.some((byte, index) => byte !== differentKey[index]));
  
  // Test environment-based salt produces different results
  const jwtSecret = "myjwtsecretkeymyjwtsecretkeymyjwtsecretkey";
  const envBasedKey = await stringTo32ByteArray("testsecret", jwtSecret);
  const fixedSaltKey = await stringTo32ByteArray("testsecret");
  assert(envBasedKey.some((byte, index) => byte !== fixedSaltKey[index]));
  
  // Test environment-based salt is deterministic
  const envBasedKey2 = await stringTo32ByteArray("testsecret", jwtSecret);
  assertEquals(envBasedKey, envBasedKey2);
});

Deno.test("parse bearer token from header", () => {
  assertEquals(parseBearerTokenFromHeader("Bearer ey"), "ey");
  assertEquals(parseBearerTokenFromHeader("Bearer"), "");
});

Deno.test("PicnicAccount", () => {
  const picnicAccount = {
    username: "picnic",
    password: "mypicnic",
  } as PicnicAccount;

  assertEquals(picnicAccount.username, "picnic");
  assertEquals(picnicAccount.password, "mypicnic");
});

Deno.test("bcrypt test default user and default password", async () => {
  const isPasswordMatch = await bcrypt.compare(
    "mypicnic",
    defaultPasswordBcrypt,
  );
  assert(defaultUsername === "picnic" && isPasswordMatch);
});

Deno.test("validateExpirationTime", () => {
  assertEquals(validateExpirationTime("1h"), "1h");
  assertEquals(validateExpirationTime("1hour"), "1hour");
  assertEquals(validateExpirationTime("2hours"), "2hours");

  [
    "sec",
    "secs",
    "second",
    "seconds",
    "s",
    "minute",
    "minutes",
    "min",
    "mins",
    "m",
    "hour",
    "hours",
    "hr",
    "hrs",
    "h",
    "day",
    "days",
    "d",
    "week",
    "weeks",
    "w",
    "year",
    "years",
    "yr",
    "yrs",
    "y",
  ].forEach((time) => {
    assertEquals(validateExpirationTime(`1${time}`), `1${time}`);
    assertEquals(validateExpirationTime(`120${time}`), `120${time}`);
  });
  assertEquals(validateExpirationTime(`120.1days`), null);
  assertEquals(validateExpirationTime(`xxx:years`), null);
});

Deno.test("validateExpirationTime default", () => {
  assertEquals(validateExpirationTime("1x"), null);
});

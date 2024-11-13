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
    stringTo32ByteArray("secretsecretsecretsecretsecretsecretsecretsecret"),
    "1h",
  );

  assert((await jwt).startsWith("eyJ"));
});

Deno.test("stringTo32ByteSecret", () => {
  assertEquals(
    stringTo32ByteArray("secretsecretsecretsecretsecretsecretsecretsecret"),
    new Uint8Array(
      [
        177,
        231,
        43,
        122,
        219,
        30,
        114,
        183,
        173,
        177,
        231,
        43,
        122,
        219,
        30,
        114,
        183,
        173,
        177,
        231,
        43,
        122,
        219,
        30,
        114,
        183,
        173,
        177,
        231,
        43,
        122,
        219,
      ],
    ),
  );
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

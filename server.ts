import { initFromEnv } from "./lib/init-from-env.ts";
import { routeAuth } from "./lib/route-auth.ts";
import { routeBearerAuth } from "./lib/route-bearer-auth.ts";
import { stringTo32ByteArray } from "./lib/string-to-32byte-array.ts";

const { user, expirationTime, JWTsecret, serverPort } = initFromEnv();

let encodedJWTSecret: Uint8Array;
if (!JWTsecret || JWTsecret.length < 32) {
  throw new Error("Secret key not set or too short");
} else {
  encodedJWTSecret = stringTo32ByteArray(JWTsecret);
}

const AUTH_ROUTE = new URLPattern({ pathname: "/auth" });
const BEARER_ROUTE = new URLPattern({ pathname: "/auth/bearer" });

async function handler(req: Request): Promise<Response> {
  const matchAuthRoute = AUTH_ROUTE.exec(req.url);
  const matchBearerRoute = BEARER_ROUTE.exec(req.url);

  if (matchAuthRoute && req.method === "POST") {
    return await routeAuth(req, user, encodedJWTSecret, expirationTime);
  }

  if (matchBearerRoute && req.method === "POST") {
    return await routeBearerAuth(req, encodedJWTSecret);
  }

  return new Response("Unauthorized", {
    status: 401,
  });
}

Deno.serve({ port: serverPort }, handler);

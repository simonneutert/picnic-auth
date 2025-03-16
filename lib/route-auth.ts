import { PicnicAccount } from "./picnic-account.ts";
import { createJWT } from "./picnic-jwt.ts";

import * as bcrypt from "bcrypt";
import { promiseWithTimeout } from "./promise-with-timeout.ts";
import corsHeader from "./cors-header.ts";

/** Handles basic authentication for a request */
export async function routeAuth(
  req: Request,
  user: PicnicAccount,
  secret: Uint8Array,
  expirationTime: string,
): Promise<Response> {
  try {
    const { username, password } = await promiseWithTimeout(
      req.json(),
      5000,
      "Request timed out",
    ) as { username: string; password: string };

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (username === user.username && isPasswordMatch) {
      const jwt = await createJWT(user, secret, expirationTime);
      return new Response(JSON.stringify(jwt), {
        headers: corsHeader.header,
      });
    } else {
      return respondWithUnauthorized();
    }
  } catch (error) {
    console.error(error);
    return respondWithUnauthorized();
  }
}

/** Responds with an unauthorized response */
function respondWithUnauthorized(): Response {
  return new Response("Unauthorized", {
    status: 401,
    headers: corsHeader.header,
  });
}

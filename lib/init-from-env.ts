import { defaultPasswordBcrypt } from "./default-password-bcrypt.ts";
import { defaultUsername } from "./default-username.ts";
import {
  defaultExpirationTime,
  validateExpirationTime,
} from "./jose-jwt-expiration-time.ts";
import { PicnicAccount } from "./picnic-account.ts";

export interface ServerEnv {
  user: PicnicAccount;
  expirationTime: string; // like "60m", @see joseJwtExpirationTime
  JWTsecret: string;
  serverPort: number;
}

/**
 * Initializes the server environment from the environment variables.
 *
 * The following environment variables are required:
 *
 * - PICNIC_USERNAME: The username for the Picnic API
 * - PICNIC_PASSWORD_BCRYPT: The password for the Picnic API, hashed with bcrypt
 * - PICNIC_JWT_EXPIRATION_TIME: The expiration time for the JWT token
 * - PICNIC_JWT_SECRET: The secret key for the JWT token
 * - PICNIC_PORT: The port for the server
 */
export function initFromEnv(): ServerEnv {
  const picnicUsername = Deno.env.get("PICNIC_USERNAME") || defaultUsername;
  const picnicPassword = Deno.env.get("PICNIC_PASSWORD_BCRYPT") ||
    defaultPasswordBcrypt; // "mypicnic"

  const user = {
    username: picnicUsername,
    password: picnicPassword,
  } as PicnicAccount;
  return {
    user,
    expirationTime: _loadJWTExpirationTimeEnv(),
    JWTsecret: _loadJWTSecretEnv(),
    serverPort: _loadPicnicPortEnv(),
  };
}

/** Loads the JWT expiration time from the environment variables. */
function _loadJWTExpirationTimeEnv(): string {
  const envExpirationTime = Deno.env.get("PICNIC_JWT_EXPIRATION_TIME") ||
    defaultExpirationTime;
  const expirationTime = validateExpirationTime(envExpirationTime);
  if (expirationTime) {
    console.log(`JWT Expiration time: ${expirationTime}`);
    return expirationTime;
  } else {
    logErrorUsingDefaultTime(envExpirationTime, defaultExpirationTime);
    return defaultExpirationTime;
  }
}

/** Logs an error message when the expiration time is invalid. */
function logErrorUsingDefaultTime(time: string, defaultTime: string): void {
  console.error(`Invalid expiration time: ${time}`);
  console.error(`Using default expiration time: ${defaultTime}`);
}

/** Loads the JWT secret key from the environment variables. */
function _loadJWTSecretEnv(): string {
  const envJWTsecret = Deno.env.get("PICNIC_JWT_SECRET");
  if (!envJWTsecret || envJWTsecret.length < 32) {
    console.log(
      "PICNIC_JWT_SECRET is not set or too short, generating a random one.",
    );
    console.log(`
      ############################################################
      
      Please set PICNIC_JWT_SECRET in your environment variables.
      
      If you're using Docker:
      $ docker run --rm -it -e PICNIC_JWT_SECRET="$(openssl rand -hex 64)" ...

      Deno (run):
      $ PICNIC_JWT_SECRET="$(openssl rand -hex 64)" deno run --allow-env --allow-net server.ts
      
      Deno (serve):
      $ export PICNIC_JWT_SECRET="$(openssl rand -hex 64)"; deno serve --allow-env --allow-net --parallel server.ts

      ############################################################
    `);
    throw new Error("Secret key not set or too short");
  }
  return envJWTsecret;
}

/** Loads the server port from the environment variables. */
function _loadPicnicPortEnv(): number {
  const picnicPort = parseInt(Deno.env.get("PICNIC_PORT") || "8000");
  return picnicPort;
}

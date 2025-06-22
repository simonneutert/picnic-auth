import { createCombinedHeaders } from "./security-headers.ts";

/** Creates CORS headers with the specified origin */
export function createCorsHeaders(origin: string): Headers {
  return createCombinedHeaders(origin);
}

/** @deprecated Use createCorsHeaders() instead */
const header = new Headers();
header.append("Access-Control-Allow-Origin", "*");

export default { header };

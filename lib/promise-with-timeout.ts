/*
Why/Purpose:
  In the deno docs it says:

  "Be aware that the req.text() call can fail if the user hangs
  up the connection before the body is fully received. Make sure
  to handle this case. Do note this can happen in all methods that
  read from the request body, such as req.json(), req.formData(),
  req.arrayBuffer(), req.body.getReader().read(), req.body.pipeTo(),
  etc."

  This is why we use promiseWithTimeout to handle the case where the
  user hangs up the connection before the body is fully received.
*/

/** Wraps a promise with a timeout */
export function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMsg?: string,
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(errorMsg));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/** Custom error class for timeout errors */
class TimeoutError extends Error {
  constructor(message = "Operation timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

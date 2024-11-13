enum JoseJwtExpirationTime {
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
}

export const defaultExpirationTime = "60m";

/** Validates the expiration time. */
export function validateExpirationTime(
  time: string,
): string | null {
  // checking the numeric value of the expiration time
  const expirationTime = parseAndValidateNumericPart(time);
  if (expirationTime === null) return expirationTime;

  // checking the non-digit characters of the expiration time
  return parseAndValidateAlphanumericPart(time);
}

/** Parses the expiration time and returns just the non-digit characters. */
function parseAndValidateAlphanumericPart(time: string): string | null {
  const timeString = keepNonDigitCharacters(time);
  return (timeString in JoseJwtExpirationTime) ? time : null;
}

/** Parses the expiration time and returns just the numeric characters. */
function parseAndValidateNumericPart(time: string): number | null {
  const expirationTime = parseInt(time);
  if (isNaN(expirationTime)) {
    return null;
  }
  return expirationTime;
}

/** Parses the expiration time and returns just the non-digit characters. */
function keepNonDigitCharacters(time: string): string {
  return time.replace(/\d/g, "");
}

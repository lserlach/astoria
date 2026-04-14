const MAX_DIGITS = 11;

/** Digits only, capped for Russian mobile / city numbers. */
export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, MAX_DIGITS);
}

/**
 * Russian-style display: 8 (800) 000 - 00 - 00 (11 digits max while typing).
 */
export function formatRuPhoneMask(value: string): string {
  const digits = getPhoneDigits(value);
  const len = digits.length;
  if (len === 0) return "";

  let out = digits[0]!;

  if (len === 1) return out;

  out += " (" + digits.slice(1, Math.min(4, len));
  if (len < 4) return out;

  out += ") " + digits.slice(4, Math.min(7, len));
  if (len < 7) return out;

  out += " - " + digits.slice(7, Math.min(9, len));
  if (len < 9) return out;

  out += " - " + digits.slice(9, Math.min(11, len));
  return out;
}

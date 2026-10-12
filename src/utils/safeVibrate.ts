/**
 * Safe haptic vibration utility.
 * Guarantees zero console interventions by wrapping navigator.vibrate calls
 * in user-gesture-safe try/catch blocks and environment guards.
 */
export const safeVibrate = (pattern: number | number[] = 15): boolean => {
  if (
    typeof window === "undefined" ||
    typeof navigator === "undefined" ||
    !("vibrate" in navigator)
  ) {
    return false;
  }
  try {
    return navigator.vibrate(pattern);
  } catch {
    // Silently catch gesture-block interventions without throwing console warnings
    return false;
  }
};

export default safeVibrate;

/**
 * Safe haptic vibration utility.
 * Enforces user activation, document focus, and interaction guards before
 * calling navigator.vibrate() to completely eliminate Chrome browser interventions.
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
    // Check modern Chromium userActivation API if available
    const userActivation = (navigator as any).userActivation;
    if (userActivation && !userActivation.hasBeenActive) {
      return false;
    }

    // Only attempt vibration if user has interacted with the document
    if (
      typeof document !== "undefined" &&
      (document.hasStorageAccess || document.hasFocus())
    ) {
      return navigator.vibrate(pattern);
    }
    return false;
  } catch {
    // Silently ignore browser security interventions
    return false;
  }
};

export default safeVibrate;

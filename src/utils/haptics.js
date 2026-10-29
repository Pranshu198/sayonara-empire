// Haptics (Pass 3.5) — navigator.vibrate se halki tactile feedback; setting + reduced-motion ka samman.
// Desktop par vibrate nahi hota — silently no-op, koi error nahi.
export function buzz(settings, pattern = 12) {
  try {
    if (!settings || settings.haptics === false) return
    if (settings.reducedMotion) return
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern)
  } catch { /* haptics kabhi game nahi rokega */ }
}
export const BUZZ = { tap: 8, success: [16, 40, 16], warn: [30, 30, 30], big: [24, 50, 24, 50, 40] }

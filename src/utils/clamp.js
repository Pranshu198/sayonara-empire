export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const clamp01 = (v) => clamp(v, 0, 1)

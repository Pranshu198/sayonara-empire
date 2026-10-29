// ============ PASS 3.6 — VISUAL EVOLUTION MODEL ============
// Har business level ke saath DIKHAI me badalta hai: 5 evolution tiers.
// Tier sirf sajawat nahi — har tier demand par +1% (kul max +4%) deta hai:
// badi dukaan par bheed khud aati hai. Balance docs/BALANCE.md me darj hai,
// 4-strategy 150-din sim se verify kiya gaya hai (koi nayi dominant strategy nahi).
export const MAX_LV = 50 // Pass 3.6: purani 10-level cap hati — Samrajya (Lv 35+) tak ka safar ab asal hai
export const EVO_DEMAND_PER_TIER = 0.01
export const EVO_TIERS = [
  { min: 1, max: 4, key: 'evoT1' },   // Shuruaat
  { min: 5, max: 9, key: 'evoT2' },   // Jamti Dukaan
  { min: 10, max: 19, key: 'evoT3' }, // Brand
  { min: 20, max: 34, key: 'evoT4' }, // Sheher ka Seth
  { min: 35, max: Infinity, key: 'evoT5' }, // Samrajya
]
export function tierOf(lv) {
  const v = Math.max(1, (lv | 0) || 1)
  for (let i = 0; i < EVO_TIERS.length; i++) if (v <= EVO_TIERS[i].max) return i
  return EVO_TIERS.length - 1
}
export function tierKeyOf(lv) { return EVO_TIERS[tierOf(lv)].key }
export function nextTierAt(lv) {
  const t = tierOf(lv)
  return t >= EVO_TIERS.length - 1 ? null : EVO_TIERS[t + 1].min
}
// 0..1 — is tier ke andar kitna safar tay hua (next evolution progress bar ke liye)
export function evoProgress(lv) {
  const t = tierOf(lv)
  if (t >= EVO_TIERS.length - 1) return 1
  const cur = EVO_TIERS[t], nxt = EVO_TIERS[t + 1]
  return Math.min(1, Math.max(0, (Math.max(1, lv | 0) - cur.min) / (nxt.min - cur.min)))
}
// Engine perk: har tier par demand x(1 + 1%) — Lv 35+ par kul +4%
export function evoDemandF(lv) { return 1 + EVO_DEMAND_PER_TIER * tierOf(lv) }

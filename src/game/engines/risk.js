// RISK ENGINE — wastage, shikayat aur jokhim ka hisaab (quality jitni kam, jokhim utna zyada)
// Insurance ka seedha roop yahi hai: zyada jokhim = zyada barbaadi; Premium/Branded = suraksha
export const WASTAGE_BY_QUALITY = { Local: 0.05, Economy: 0.035, Premium: 0.015, Branded: 0.01 }
export function wastageRateFor(contract) { return contract ? (WASTAGE_BY_QUALITY[contract.quality] ?? 0.02) : 0.02 }
export function complaintChance(contract) { return contract ? (contract.complaintRisk || 0.02) * 0.25 : 0 }
// Jokhim report — Managers panel me dikhane ke liye
export function riskLevel(contract) {
  if (!contract) return 'Madhyam (koi contract nahi)'
  const w = wastageRateFor(contract)
  return w >= 0.05 ? 'Unch — sasta maal, zyada barbaadi' : w >= 0.03 ? 'Madhyam' : 'Kam — quality suraksha'
}

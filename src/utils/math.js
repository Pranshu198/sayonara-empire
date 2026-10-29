// Chhote math helpers jo engines baar-baar use karte hain
export function compound(principal, annualRate, days) {
  return principal * Math.pow(1 + annualRate, days / 365)
}
export function dailyRate(annualRate) { return annualRate / 365 }
export function emiFor(principal, annualRate, months) {
  const r = annualRate / 12
  if (r === 0) return Math.round(principal / months)
  const emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)
  return Math.round(emi)
}
export function growthSeries(start, rate, n) {
  const out = []; let v = start
  for (let i = 0; i < n; i++) { out.push(Math.round(v)); v *= 1 + rate }
  return out
}

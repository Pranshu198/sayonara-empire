// PROCUREMENT / SUPPLY ENGINE — supplier rate ka chalna aur contract ka COGS asar
// Supplier index bazaar ki mehengai dikhata hai; contract ka cogsMult har kharid par lagta hai
import { effectiveUnitPrice, QUALITY_SCORE } from '../procurement/index.js'
export function supplierDrift(s, rnd, volF, infF) {
  return Math.max(0.88, Math.min(1.18, s.supplier + rnd(-0.015, 0.015) * volF + 0.002 * infF))
}
export function contractCogsMult(contract) {
  if (!contract) return 1
  return Math.max(0.7, Math.min(1.5, contract.unitPrice / Math.max(1, contract.basePrice)))
}
// Manager/panel ke liye seller chunav: cheapest = kul jokhim-sahit sasta, quality = sabse achhi quality
export function chooseSeller(item, pref) {
  if (!item || !item.sellers.length) return null
  const scored = item.sellers.map((sl) => ({ sl, eff: effectiveUnitPrice(sl, 100) * (1 + sl.complaintRisk), q: QUALITY_SCORE[sl.quality] || 2, rel: sl.reliability }))
  if (pref === 'quality') return scored.sort((a, b) => b.q - a.q || b.rel - a.rel)[0].sl
  if (pref === 'reliable') return scored.sort((a, b) => b.rel - a.rel || a.eff - b.eff)[0].sl
  return scored.sort((a, b) => a.eff - b.eff)[0].sl
}
// Restock order ki keemat: miss% x (roz ki bikri x COGS hissa) x seller asar (item base ke muqable) x slab chhoot
export function orderCost(d, missPct, seller, itemBase) {
  const base = d.rev * d.cogs * (missPct / 100)
  if (!seller) return Math.round(base * 0.9) + 10
  const mult = Math.max(0.7, Math.min(1.5, seller.unitPrice / Math.max(1, itemBase || seller.unitPrice)))
  const slabQty = missPct * 10
  const off = (seller.slabs || []).reduce((a, s2) => (slabQty >= s2.qty ? Math.max(a, s2.off) : a), 0)
  return Math.round(base * mult * (1 - off)) + 10
}

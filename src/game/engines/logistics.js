// IMPORT / LOGISTICS ENGINE — videshi maal ka landed cost, currency ka hilna, port par der
// Landed cost = base x FX + shipping (8%) + customs duty (category/desh ke hisaab se)
// FX deterministic hai: desh ke naam + din se banta hai, taaki panel aur engine ek hi daam dekhein
export function fxOf(country, day) {
  let h = 0; for (const c of country) h = (h * 31 + c.charCodeAt(0)) % 997
  const wave = Math.sin(h + day / 9) * 0.5 + Math.sin(h * 2 + day / 23) * 0.5
  return +(1 + wave * 0.09).toFixed(3) // ±9% tak hil sakta hai
}
// Pass 3.5 BALANCE FIX: catalogue basePrice asal duniya ki per-unit keemat hai, par game ka stock
// ek abstract 0-100 meter hai — bina scale ke import har haal me ghata tha (sim: control ₹9.8L NW vs import ₹1.15L).
// ECON_SCALE game-economy ka conversion hai: import ab premium restock jaisa kharcha karega
// (aas-paas 3-4x aam restock, badle me full stock + 14 din 'Imported' demand tag). docs/BALANCE.md dekho.
export const IMPORT_ECON_SCALE = 0.05
export function landedCost(listing, qty, day) {
  const fx = fxOf(listing.country, day)
  const base = listing.basePrice * fx * qty * IMPORT_ECON_SCALE
  const shipping = base * 0.08
  const duty = (base + shipping) * (listing.dutyPct || 0)
  const bulk = qty >= (listing.containerMinQty || 1000)
  const discount = bulk ? base * (listing.containerDiscount || 0.22) : 0
  return { fx, base: Math.round(base), shipping: Math.round(shipping), duty: Math.round(duty), discount: Math.round(discount), total: Math.round(base + shipping + duty - discount), bulk }
}
export function arrivalDayFor(listing, day, rnd) {
  const delayed = rnd() < (listing.delayRisk || 0)
  return { arriveDay: day + listing.shipDays + (delayed ? Math.ceil(listing.shipDays * 0.5) : 0), delayed }
}

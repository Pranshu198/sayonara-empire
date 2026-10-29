// IMPORT / LOGISTICS ENGINE — videshi maal ka landed cost, currency ka hilna, port par der
// Landed cost = base x FX + shipping (8%) + customs duty (category/desh ke hisaab se)
// FX deterministic hai: desh ke naam + din se banta hai, taaki panel aur engine ek hi daam dekhein
export function fxOf(country, day) {
  let h = 0; for (const c of country) h = (h * 31 + c.charCodeAt(0)) % 997
  const wave = Math.sin(h + day / 9) * 0.5 + Math.sin(h * 2 + day / 23) * 0.5
  return +(1 + wave * 0.09).toFixed(3) // ±9% tak hil sakta hai
}
export function landedCost(listing, qty, day) {
  const fx = fxOf(listing.country, day)
  const base = listing.basePrice * fx * qty
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

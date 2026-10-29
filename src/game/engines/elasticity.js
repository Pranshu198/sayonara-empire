// PRICE ELASTICITY ENGINE — daam badhane par mang kitni giregi, aur quality ke hisaab se daam ki chhat (ceiling)
// Sasta maal = price ceiling kam; Branded maal = graahak zyada daam sah leta hai
export function priceElasticity(price) { return Math.max(0.35, 1 - (price - 1) * 1.15) }
export const PRICE_CEILING = { Local: 1.1, Economy: 1.25, Premium: 1.45, Branded: 1.6 }
export function priceCeilingFor(contract) { return contract ? (PRICE_CEILING[contract.quality] || 1.3) : 1.5 }
// Ceiling se upar daam = mang par sakht asar (graahak shikayat karta hai)
export function ceilingPenalty(price, contract) {
  const ceil = priceCeilingFor(contract)
  return price > ceil ? Math.max(0.5, 1 - (price - ceil) * 1.4) : 1
}

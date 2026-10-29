// CUSTOMER / REPUTATION ENGINE — rating ka ghumna, shikayat ka asar
// Zyada daam = rating par dabav (customer strictness setting se juda); achhi quality = rating sambhalta hai
export function ratingDrift(o, s, rnd) {
  const strict = (s.settings && s.settings.custStrict) || 1
  let d = rnd(-0.02, 0.025) - (o.price > 1.25 ? 0.02 * strict : -0.01)
  return Math.max(3, Math.min(5, o.rating + d))
}
// Saste-kharab maal ki shikayat: rating ko jhatka
export function complaintHit(o) { o.rating = Math.max(3, o.rating - 0.06) }

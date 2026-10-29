// LABOUR / HR ENGINE — staff ki laagat aur tyohar par chhutti ka asar
// Fixed daily cost = staff wages + sheher ke hisaab se rent + bijli/upkeep + depreciation ansh
export function fixedDailyCost(d, o, city) {
  const rentMult = city ? city.rent : 1
  return o.staff * d.wage + d.rent * rentMult + d.util + d.cost * 0.0003
}
// Bade tyohar par kuch staff chhutti par — bikri par halka asar, par team khush (rating bacha rehta hai)
export function staffLeaveFactor(onLeave) { return onLeave ? 0.94 : 1 }
export function staffCapacity(o, d) { return Math.min(1.15, Math.max(0.6, o.staff / Math.max(1, d.staff))) }

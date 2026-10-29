// DEMAND ENGINE — graahako ki mang ka hisaab
// Input: business def, owned state, din ka event, phase | Output: saare demand factors (gunaank)
// Bikri = Base x PhaseWeight x Level x Price x Elasticity x Rating x Marketing x Event x Stock x Location x Festival x Season
export function phaseDemand(d, o, s, phaseW) {
  const elasticity = Math.max(0.35, 1 - (o.price - 1) * 1.15) // Price Elasticity engine se juda
  const ratingF = 0.8 + (o.rating - 3) * 0.12
  const mktF = o.mktDays > 0 ? 1.3 : 1
  const eventF = s.eventEff === 'boom' && (d.cat === 'Food' || d.cat === 'Retail') ? 1.3
    : s.eventEff === 'salary' && d.cat === 'Retail' ? 1.2
    : s.eventEff === 'rain' ? 0.9
    : s.eventEff === 'match' && phaseW === 2 ? 1.25 : 1
  const stockF = o.stock <= 0 ? 0.45 : o.stock < 20 ? 0.8 : 1
  return { elasticity, ratingF, mktF, eventF, stockF }
}
export function seasonBoostFor(day) { return [1, 1.05, 0.95, 1.15][Math.floor(day / 90) % 4] }

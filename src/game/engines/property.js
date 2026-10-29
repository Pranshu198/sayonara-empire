// PROPERTY ENGINE — kiraya aur keemat badhna
export function dailyRent(s, PROPERTIES) {
  let rent = 0
  for (const pid of s.props) { const p = PROPERTIES.find((x) => x.id === pid); if (p) rent += (p.rent || 0) / 30 }
  return rent
}
export function propValue(p, day) { return Math.round(p.cost * Math.pow(1.06, day / 365)) }

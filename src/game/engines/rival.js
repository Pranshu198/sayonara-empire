// RIVAL AI ENGINE — pratidwandi apni raftaar se badhte hain, aggression setting unki tezai badalti hai
export function growRivals(s, rnd) {
  const aggF = (s.settings && s.settings.compAggro) || 1
  s.rivals.forEach((r) => { r.nw *= 1 + r.g * rnd(0.4, 1.6) * aggF })
}
export function topRival(s) { return [...s.rivals].sort((a, b) => b.nw - a.nw)[0] }

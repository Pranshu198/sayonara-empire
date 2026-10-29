// RIVAL AI ENGINE — pratidwandi apni raftaar se badhte hain, aggression setting unki tezai badalti hai.
// Pass 3.5: rivals ab khiladi par REACT karte hain — tum aage ho to woh tez daudte hain (chase),
// tum bahut peeche ho to unki raftaar thodi dheemi (race jeevant rahe, ek-tarfa na ho).
export function growRivals(s, rnd) {
  const aggF = (s.settings && s.settings.compAggro) || 1
  const playerNw = s._playerNw || 0
  s.rivals.forEach((r) => {
    let react = 1
    if (playerNw > 0) {
      if (playerNw > r.nw) react = 1.45 // khiladi aage — rival gusse me tez
      else if (playerNw < r.nw * 0.25) react = 0.8 // khiladi bahut peeche — rival thoda dheela
    }
    r.nw *= 1 + r.g * rnd(0.4, 1.6) * aggF * react
    if (!Number.isFinite(r.nw) || r.nw <= 0) r.nw = 100000
  })
}
export function topRival(s) { return [...s.rivals].sort((a, b) => b.nw - a.nw)[0] }

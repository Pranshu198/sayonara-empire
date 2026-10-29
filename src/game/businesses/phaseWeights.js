// Din ke 4 hisso (Morning/Afternoon/Evening/Night) me har category ki demand ka hissa
// Chai subah-shaam, restaurant raat — real life ki rhythm yahi se aati hai
export const PHASES = ['🌅 Morning', '☀️ Afternoon', '🌆 Evening', '🌙 Night']
export const PHASE_KEYS = ['morning', 'afternoon', 'evening', 'night']
export const PHASE_W = {
  Food: [0.30, 0.25, 0.32, 0.13], Retail: [0.18, 0.34, 0.36, 0.12], Service: [0.22, 0.32, 0.34, 0.12],
  Edu: [0.28, 0.30, 0.36, 0.06], Health: [0.30, 0.30, 0.26, 0.14], Tech: [0.24, 0.34, 0.28, 0.14],
  Industry: [0.34, 0.38, 0.20, 0.08], Energy: [0.26, 0.28, 0.30, 0.16],
}
export function bestPhaseOf(cat) {
  const wts = PHASE_W[cat]; let bi = 0
  wts.forEach((x, i) => { if (x > wts[bi]) bi = i })
  return bi
}

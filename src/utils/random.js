// Random helpers — ek jagah taaki balance tuning aasan ho
export const rnd = (a, b) => a + Math.random() * (b - a)
export const rndInt = (a, b) => Math.floor(rnd(a, b + 1))
export const chance = (p) => Math.random() < p
export function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
export function pickWeighted(items, weightOf) {
  const total = items.reduce((a, x) => a + weightOf(x), 0)
  let r = Math.random() * total
  for (const x of items) { r -= weightOf(x); if (r <= 0) return x }
  return items[items.length - 1]
}
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
export function sample(arr, n) { return shuffle(arr).slice(0, n) }

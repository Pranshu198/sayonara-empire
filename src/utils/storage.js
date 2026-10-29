// localStorage ka safe wrapper — kabhi crash nahi karta
export function loadJSON(key, fallback = null) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback }
}
export function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage full/blocked — game chalta rahega */ }
}
export function loadFlag(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : v === '1' } catch { return fallback }
}
export function saveFlag(key, on) { try { localStorage.setItem(key, on ? '1' : '0') } catch {} }
export function removeKey(key) { try { localStorage.removeItem(key) } catch {} }
export function encodeSave(obj) { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))) }
export function decodeSave(code) { return JSON.parse(decodeURIComponent(escape(atob(code.trim())))) }

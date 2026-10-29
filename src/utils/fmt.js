// Indian money formatting: ₹, K, L, Cr — har jagah yahi use hota hai
export function fmt(n) {
  n = Math.round(n || 0)
  const neg = n < 0; n = Math.abs(n)
  let s
  if (n >= 1e7) s = '₹' + (n / 1e7).toFixed(2) + ' Cr'
  else if (n >= 1e5) s = '₹' + (n / 1e5).toFixed(2) + ' L'
  else if (n >= 1e3) s = '₹' + (n / 1e3).toFixed(1) + ' K'
  else s = '₹' + n
  return neg ? '-' + s : s
}
export function fmtPlain(n) {
  return Math.round(n || 0).toLocaleString('en-IN')
}
export function fmtPct(x, digits = 1) {
  return (x >= 0 ? '+' : '') + (x * 100).toFixed(digits) + '%'
}

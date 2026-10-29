// MARKET ENGINE — shares/commodities ka roz ka chalna, sentiment ka asar, dividend
export function walkMarket(s, rnd) {
  const mVol = (s.settings && s.settings.marketVol) || 1
  const walk = (arr, vol) => arr.forEach((st) => { const ch = rnd(-vol, vol) * mVol + s.sentiment * 0.004; st.price = Math.max(1, st.price * (1 + ch)); st.hist = [...st.hist.slice(-29), Math.round(st.price)] })
  walk(s.stocks, 0.03); walk(s.commodities, 0.018)
  const btc = s.commodities.find((c) => c.sym === 'BTC'); if (btc) btc.price *= 1 + rnd(-0.02, 0.02)
}
export function dividendCalc(s) {
  let div = 0
  for (const [sym, q] of Object.entries(s.holdings)) { const st = s.stocks.find((x) => x.sym === sym); if (st) div += st.price * q * 0.015 }
  return Math.round(div)
}

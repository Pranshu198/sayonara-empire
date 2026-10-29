import { useEffect, useMemo, useState } from 'react'
import { Section } from './ui.jsx'
import { fmt, bizDef } from '../game/engine.js'
import { CITIES, cityOf } from '../game/atlas/cityIndex.js'
import { activeFestivals, upcomingFestivals, festivalsByMonth, MONTH_NAMES, monthOfDay } from '../game/festivals/index.js'

// World Atlas — duniya bhar ke sheher: profile, vistaar, apne business, tyohar calendar
// Bhaari geography data (har rajya/desh ki alag file) lazy chunks se aata hai — pehli load tez rehti hai
const atlasFiles = import.meta.glob('../game/atlas/india/*.js')
const worldFiles = import.meta.glob('../game/atlas/world/*.js')

export function AtlasPanel({ s, nw, upd, say }) {
  const [geo, setGeo] = useState(null)
  const [q, setQ] = useState('')
  const [empireOnly, setEmpireOnly] = useState(false)
  useEffect(() => {
    let dead = false
    ;(async () => {
      const states = [], countries = []
      for (const [p, fn] of Object.entries(atlasFiles)) { const m = await fn(); if (m.STATE) states.push(m.STATE) }
      for (const [p, fn] of Object.entries(worldFiles)) { const m = await fn(); if (m.COUNTRIES) countries.push(...m.COUNTRIES) }
      if (!dead) setGeo({ states, countries })
    })()
    return () => { dead = true }
  }, [])
  const unlocked = s.unlockedCities || ['india_delhi']
  const myCities = useMemo(() => unlocked.map((id) => cityOf(id)), [unlocked])
  const today = activeFestivals(s.day, myCities[0] || null)
  const upcoming = useMemo(() => upcomingFestivals(s.day, myCities, 30), [s.day, myCities])
  const bizByCity = useMemo(() => {
    const map = {}
    for (const [id, o] of Object.entries(s.biz)) { const cid = o.loc || 'india_delhi'; (map[cid] = map[cid] || []).push({ id, o, d: bizDef(id) }) }
    return map
  }, [s.biz])
  const unlockCity = (c) => {
    if (nw < c.unlock) return say(`🔒 Pehle Net Worth ${fmt(c.unlock)} chahiye`)
    if (s.cash + s.bank < c.cost) return say('❌ Vistaar ke paise kam hai')
    upd((n) => {
      const fromCash = Math.min(n.cash, c.cost); n.cash -= fromCash; n.bank -= (c.cost - fromCash)
      n.unlockedCities = [...(n.unlockedCities || ['india_delhi']), c.id]
      n.story = [`Day ${n.day}: 🌍 ${c.name} (${c.country}) me vistaar! Empire ab ${n.unlockedCities.length} shehro me`, ...n.story].slice(0, 20)
      n.news = [{ day: n.day, text: `📰 Sheher Times: Sayonara Empire ne ${c.name} me pair jamaye — sthaniya vyapari satark!` }, ...n.news].slice(0, 12)
      n.xp += 50
    })
    say(`🌍 ${c.name} unlock ho gaya! Ab waha business khol sakte ho.`, true)
  }
  const cityRow = (c) => {
    const isOpen = unlocked.includes(c.id)
    const mine = bizByCity[c.id] || []
    const profit = mine.reduce((a, x) => a + (x.o.profitTotal || 0), 0)
    const festHere = activeFestivals(s.day, c)
    return (
      <div className="biz-card" key={c.id}>
        <div className="row" style={{ border: 'none', padding: 0 }}><b>{isOpen ? '🟢' : '⚪'} {c.name}</b><span className="muted">{c.state ? c.state + ', ' : ''}{c.country} {c.cur !== '₹' ? '• ' + c.cur : ''}</span></div>
        <div className="muted">Tier {c.tier} • Rent index {c.rent}x • Demand {c.dem}x • Strong: {Object.entries(c.boost || {}).map(([k, v]) => `${k} ${v}x`).join(', ') || 'sab santulit'}</div>
        <div className="muted">🎉 Bada tyohar: {c.fest} (Day {c.festDay}/varsh) {festHere.length ? '• AAJ sakriya: ' + festHere.map((f) => f.name).join(', ') : ''}</div>
        {isOpen ? <>
          <div className="row"><span>Tumhare business</span><b>{mine.length ? mine.map((x) => x.d.icon + ' ' + x.d.name).join(', ') : 'abhi koi nahi — Business tab se kholo'}</b></div>
          <div className="row"><span>Is sheher se kul munafa</span><b className={profit >= 0 ? 'pos' : 'neg'}>{fmt(profit)}</b></div>
        </> : nw >= c.unlock
          ? <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => unlockCity(c)}>🌍 Vistaar karo — {fmt(c.cost)}</button>
          : <div className="muted" style={{ marginTop: 6 }}>🔒 Vistaar shart: Net Worth {fmt(c.unlock)} • Keemat {fmt(c.cost)}</div>}
      </div>
    )
  }
  const matchQ = (c) => !q || (c.name + ' ' + c.state + ' ' + c.country).toLowerCase().includes(q.toLowerCase())
  const visible = CITIES.filter((c) => matchQ(c) && (!empireOnly || unlocked.includes(c.id)))
  const byCountry = useMemo(() => { const m = {}; for (const c of visible) (m[c.country] = m[c.country] || []).push(c); return m }, [visible])
  const curMonth = monthOfDay(s.day)
  return (
    <>
      <Section id="atlas" title="🌍 World Atlas — Duniya ka Map" right={`${unlocked.length} sheher / ${[...new Set(myCities.map((c) => c.country))].length} desh`}>
        <div className="atlas-hero">
          <div className="atlas-globe">🌐</div>
          <div>
            <b>Sayonara Empire — World Atlas</b>
            <div className="muted">Ghar: Uttam Nagar, Delhi. Har sheher ka apna rent, demand aur tyohar — business wahi kholo jaha mahaul tumhare saath ho. {geo ? `${geo.states.length} rajya + ${geo.countries.length} desh load hue` : 'Geography load ho rahi hai…'}</div>
          </div>
        </div>
        {today.length > 0 && <div className="news-item">🎊 Aaj ghar (Delhi) me sakriya: {today.map((f) => `${f.name} (${f.theme})`).join(' • ')}</div>}
        {upcoming.length > 0 && <div className="news-item">⏳ Aane wale 30 din: {upcoming.slice(0, 4).map((u) => `${u.f.name} — ${u.inDays} din baad (${u.cities.join(', ')})`).join(' • ')}</div>}
        <div style={{ display: 'flex', gap: 8, margin: '10px 0' }}>
          <input style={{ flex: 1 }} placeholder="🔎 Sheher / rajya / desh khojo…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className={'chip' + (empireOnly ? ' on' : '')} onClick={() => setEmpireOnly(!empireOnly)}>⭐ Your Empire</button>
        </div>
        {Object.entries(byCountry).sort((a, b) => a[0].localeCompare(b[0])).map(([country, cs]) => (
          <Section key={country} id={'atlas_' + country} title={`🏳️ ${country}`} right={`${cs.filter((c) => unlocked.includes(c.id)).length}/${cs.length} khula`} defaultOpen={country === 'India'}>
            {cs.map(cityRow)}
          </Section>
        ))}
        {geo && <div className="muted">📖 Rajya/Desh profiles: {geo.states.slice(0, 3).map((x) => x.name).join(', ')}… kul {geo.states.length} rajya aur {geo.countries.length} desh ki poori jaankari upar ke shehro me chhupi hai — kisi sheher ka tyohar, jalvayu aur demand upar dikh raha hai.</div>}
      </Section>
      <Section id="festcal" title="🎉 Festival Calendar — Duniya ke Tyohar" right={`Mahina ${curMonth}`} defaultOpen={false}>
        <p className="muted">Tyohar = us sheher ki matching dukaanon ki demand seedha upar. 30 din pehle se dikhta hai — stock, daam aur marketing pehle taiyaar rakho. Staff kuch bade tyoharon par chhutti bhi leta hai.</p>
        {MONTH_NAMES.map((mn, i) => { const list = festivalsByMonth(i + 1, empireOnly ? myCities : null); if (!list.length) return null; return (
          <Section key={mn} id={'fest_' + mn} title={`🗓️ ${mn}`} right={`${list.length} tyohar`} defaultOpen={i + 1 === curMonth}>
            {list.slice(0, 40).map((f) => { const active = activeFestivals(s.day, myCities[0] || null).some((x) => x.id === f.id); const up = upcoming.find((u) => u.f.id === f.id); return (
              <div className="row" key={f.id}><div><b>{f.name}</b> <span className="muted">{f.region} • {f.theme}</span><div className="muted">Demand: {Object.entries(f.cats || {}).map(([k, v]) => `${k} ${v}x`).join(', ')} • Khaas: {(f.special || []).join(', ')}{f.staffLeave ? ' • Staff chhutti asar' : ''}</div></div>{active ? <b className="pos">AAJ!</b> : up ? <b className="gold">{up.inDays} din</b> : <span className="muted">Day {f.start}</span>}</div>) })}
          </Section>) })}
      </Section>
    </>
  )
}

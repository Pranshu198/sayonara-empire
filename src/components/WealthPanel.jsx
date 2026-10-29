import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section } from './ui.jsx'
import { fmt } from '../game/engine.js'
import { INVEST_CLASSES, investById } from '../game/content/invest/index.js'
import { dailyPicks, collectibleById } from '../game/content/collectibles/index.js'
import { dealFlow, startupById } from '../game/content/startups/index.js'
import { nowShowing, movieById } from '../game/content/movies/index.js'
import { dailyOpportunities } from '../game/content/opportunities/index.js'
import { LIFESTYLE, CHARITY, CITY_PROJECTS, lifestyleById } from '../game/content/lifestyle/index.js'
import { investPrice, collectiblePrice, wealthValue, happinessOf, legacyScore, legacyTitle } from '../game/wealthEngine.js'

// Wealth tab — paisa rakhne ki kabhi na khatm hone wali jagahen + kharch ke izzatdaar raaste
export function WealthPanel({ s, nw, upd, say }) {
  const [capsuleAmt, setCapsuleAmt] = useState(10000)
  const [predAmt, setPredAmt] = useState(5000)
  const opps = useMemo(() => dailyOpportunities(s.day), [s.day])
  const picks = useMemo(() => dailyPicks(6), [s.day])
  const deals = useMemo(() => dealFlow(5), [s.day])
  const films = useMemo(() => nowShowing(4), [s.day])
  const legacy = legacyScore(s, nw)

  const buyInvest = (item) => {
    if (s.cash < item.price) return say('❌ Cash kam hai')
    upd((n) => { n.cash -= investPrice(n, item); n.invest[item.id] = (n.invest[item.id] || 0) + 1; n.investPrices[item.id] = investPrice(n, item); n.xp += 5 })
    say(`💎 ${item.name} kharida!`, true)
  }
  const sellInvest = (item) => {
    if (!(s.invest[item.id] > 0)) return
    upd((n) => { n.cash += investPrice(n, item); n.invest[item.id] -= 1; if (n.invest[item.id] <= 0) delete n.invest[item.id] })
    say(`💸 ${item.name} becha: ${fmt(investPrice(s, item))}`)
  }
  const buyCollectible = (c) => {
    const price = collectiblePrice(s, c)
    if (s.cash < price) return say('❌ Cash kam hai')
    if ((s.collectibles || []).includes(c.id)) return say('⚠️ Ye pehle se tumhare sangrah me hai')
    upd((n) => { n.cash -= price; n.collectibles = [...(n.collectibles || []), c.id]; n.collectPrices[c.id] = price; n.xp += 8; n.story = [`Day ${n.day}: Collectible liya — ${c.name}`, ...n.story].slice(0, 30) })
    say(`🖼️ Sangrah me juda: ${c.name}`, true)
  }
  const sellCollectible = (id) => {
    const c = collectibleById(id); const price = collectiblePrice(s, c)
    upd((n) => { n.cash += price; n.collectibles = n.collectibles.filter((x) => x !== id) })
    say(`💸 ${c.name} becha: ${fmt(price)}`)
  }
  const investStartup = (st) => {
    if (s.cash < st.ask) return say('❌ Cash kam hai')
    upd((n) => { n.cash -= st.ask; n.startups[st.id] = { amt: st.ask, since: n.day }; n.xp += 6 })
    say(`🚀 ${st.name} me angel investment! Exit ya doob — kismat ka khel.`, true)
  }
  const investMovie = (mv) => {
    const share = Math.round(mv.budget * 0.1)
    if (s.cash < share) return say(`❌ Producer share ke liye ${fmt(share)} chahiye`)
    upd((n) => { n.cash -= share; n.movies[mv.id] = { amt: share, releaseDay: n.day + mv.days }; n.xp += 6 })
    say(`🎬 '${mv.title}' ke producer ban gaye! Release Day ${s.day + mv.days} ko.`, true)
  }
  const takeMystery = () => {
    const m = opps.mystery
    if (s.oppDay === s.day) return say('⏳ Aaj ka mystery deal ho gaya — kal naya dealer aayega')
    if (s.cash < m.price) return say('❌ Cash kam hai')
    const win = Math.random() < m.winChance
    upd((n) => {
      n.cash -= m.price; n.oppDay = n.day
      if (win) { const g = Math.round(m.price * m.winMult); n.cash += g; n.story = [`Day ${n.day}: Mystery deal jeeta — ${m.goods} asli nikla!`, ...n.story].slice(0, 30) }
      else n.story = [`Day ${n.day}: Mystery deal me dhokha — ${m.goods} nakli nikla`, ...n.story].slice(0, 30)
    })
    say(win ? `🎉 Asli nikla! Jeet ka paisa cash me aaya` : '😖 Dhokha! Maal nakli nikla — paisa gaya', win)
  }
  const startTreasure = () => {
    const t = opps.treasure
    if (s.cash < t.cost) return say('❌ Cash kam hai')
    if ((s.treasuresActive || []).length > 0) return say('⏳ Ek talaash pehle se chal rahi hai')
    upd((n) => { n.cash -= t.cost; n.treasuresActive = [{ place: t.place, cost: t.cost, findChance: t.findChance, prizeMult: t.prizeMult, doneDay: n.day + t.days }] })
    say(`⛏️ Talaash shuru: ${t.place} — ${t.days} din me nateeja`)
  }
  const placePrediction = () => {
    const p = opps.prediction
    if (s.cash < predAmt) return say('❌ Cash kam hai')
    upd((n) => { n.cash -= predAmt; n.predictions = [...(n.predictions || []), { kind: p.kind, amt: predAmt, payout: p.payout, dueDay: n.day + p.days, baseSupplier: n.supplier }] })
    say(`🔮 Andaza lag gaya ${fmt(predAmt)} par — ${p.days} din me faisla`)
  }
  const lockCapsule = (years) => {
    if (s.cash < capsuleAmt) return say('❌ Cash kam hai')
    const days = years * 365; const bonus = years === 1 ? 0.25 : years === 3 ? 1.0 : 2.2
    upd((n) => { n.cash -= capsuleAmt; n.capsules = [...(n.capsules || []), { amt: capsuleAmt, unlockDay: n.day + days, bonus }] })
    say(`⏳ Capsule band! ${fmt(capsuleAmt)} Day ${s.day + days} ko +${Math.round(bonus * 100)}% bonus ke saath khulega`)
  }
  const buyLifestyle = (it) => {
    if (s.cash < it.price) return say('❌ Cash kam hai')
    upd((n) => { n.cash -= it.price; n.lifestyle = [...(n.lifestyle || []), it.id]; n.xp += 10; n.news = [{ day: n.day, text: `📰 Sheher Times: Sayonara Empire ne ${it.name} liya — sheher me shaan badhi!` }, ...n.news].slice(0, 12); n.story = [`Day ${n.day}: ${it.name} kharida — khushi +${it.happy}`, ...n.story].slice(0, 30) })
    say(`✨ ${it.name} tumhara! Khushi badhi`, true)
  }
  const doCharity = (c) => {
    if (s.cash < c.amt) return say('❌ Cash kam hai')
    upd((n) => { n.cash -= c.amt; n.charity = (n.charity || 0) + c.amt; n.rep = Math.min(100, (n.rep || 50) + Math.min(5, c.rep)); n.news = [{ day: n.day, text: `📰 Sheher Times: ${fmt(c.amt)} ka daan — ${c.cause}. Sheher ne salaam kiya!` }, ...n.news].slice(0, 12); n.story = [`Day ${n.day}: Daan diya — ${c.cause} (${fmt(c.amt)})`, ...n.story].slice(0, 30) })
    say(`🙏 Daan ho gaya — saakh aur Legacy dono badhe`, true)
  }
  const fundProject = (p) => {
    if (s.cash < p.cost) return say('❌ Cash kam hai')
    if ((s.cityProjects || []).includes(p.id)) return say('⚠️ Ye project pehle se funded hai')
    upd((n) => { n.cash -= p.cost; n.cityProjects = [...(n.cityProjects || []), p.id]; n.seasonBoost = Math.min(1.4, n.seasonBoost + p.districtBoost * 0.05); n.rep = Math.min(100, (n.rep || 50) + Math.min(8, p.rep)); n.news = [{ day: n.day, text: `📰 Sheher Times: ${p.name} par Sayonara Empire ka naam — poora sheher khush!` }, ...n.news].slice(0, 12) })
    say(`🏗️ Project funded! District ko boost, tumhe izzat`, true)
  }

  return (
    <>
      <Section id="legacy" title="👑 Legacy & Izzat" right={legacyTitle(legacy)}>
        <div className="row"><span>Legacy Score</span><b className="gold">{legacy}</b></div>
        <div className="bar"><i style={{ width: Math.min(100, legacy / 220 * 100) + '%' }} /></div>
        <div className="row"><span>Khushi (Happiness)</span><b>{happinessOf(s)}/100</b></div>
        <div className="row"><span>Saakh (Reputation)</span><b>{Math.round(s.rep || 50)}/100</b></div>
        <div className="row"><span>Kul Daan</span><b className="pos">{fmt(s.charity || 0)}</b></div>
        <div className="row"><span>Wealth Assets ki Keemat</span><b className="gold">{fmt(wealthValue(s))}</b></div>
        <p className="muted">Legacy sirf paise se nahi banta — daan, city projects, lifestyle aur peedhiyan sab judte hain. Agla title: {legacyTitle(legacy + 30)} ki taraf.</p>
      </Section>

      <Section id="invest" title="💎 Endless Assets — Zameen se Space tak" defaultOpen>
        <p className="muted">Har class ke tukde kharido — keemat roz ghumti hai, kuch se mahina-kiraya jaisi aamdani bhi aati hai. Hamesha kuch na kuch kharidne ko bachega.</p>
        {INVEST_CLASSES.map((cls) => (
          <div key={cls.id} style={{ marginBottom: 10 }}>
            <b className="small">{cls.name}</b>
            {cls.items.slice(0, 4).map((item) => {
              const qty = (s.invest || {})[item.id] || 0; const price = investPrice(s, item)
              return (
                <div className="row" key={item.id}>
                  <div><div className="small">{item.name}</div><div className="muted">Badhat ~{Math.round(item.growth * 100)}%/yr{item.income ? ` • Aamdani ~${Math.round(item.income * 100)}%/yr` : ''} • Paas: {qty}</div></div>
                  <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><b>{fmt(price)}</b>
                    <button className="btn small green" onClick={() => buyInvest(item)}>Buy</button>
                    {qty > 0 && <button className="btn small red" onClick={() => sellInvest(item)}>Sell</button>}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </Section>

      <Section id="collect" title="🖼️ Collectibles Bazaar (Aaj ke Picks)" defaultOpen={false}>
        {picks.map((c) => (
          <div className="row" key={c.id}>
            <div><b>{c.kind}: {c.name}</b><div className="muted">{c.maker} • {c.year} • {c.story}</div></div>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><b>{fmt(collectiblePrice(s, c))}</b><button className="btn small green" onClick={() => buyCollectible(c)}>Buy</button></span>
          </div>
        ))}
        <b className="small" style={{ display: 'block', marginTop: 10 }}>Tumhara Sangrah</b>
        {(s.collectibles || []).length === 0 && <p className="muted">Abhi khali hai — pehla collectible lo, keemat samay ke saath ghumegi.</p>}
        {(s.collectibles || []).map((id) => { const c = collectibleById(id); if (!c) return null; return (
          <div className="row" key={id}><span>{c.kind}: {c.name}</span><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><b>{fmt(collectiblePrice(s, c))}</b><button className="btn small red" onClick={() => sellCollectible(id)}>Sell</button></span></div>) })}
      </Section>

      <Section id="startups" title="🚀 Startup Deal Flow (Angel Bano)" defaultOpen={false}>
        {deals.map((st) => (
          <div className="biz-card" key={st.id}>
            <div className="row" style={{ border: 'none', padding: 0 }}><b>{st.name}</b><b>{fmt(st.ask)}</b></div>
            <div className="muted">{st.sector} • {st.stage} • {st.founder} • Risk: {st.risk} • Upside: ~{st.upside}x • Doobne ka chance: {Math.round(st.failChance * 100)}%</div>
            <div className="small">{st.pitch}</div>
            {(s.startups || {})[st.id]
              ? <div className="pos small" style={{ marginTop: 6 }}>✔ Laga hua hai — exit/fail ka intezaar</div>
              : <button className="btn small" style={{ marginTop: 8 }} onClick={() => investStartup(st)}>💸 Angel Lago {fmt(st.ask)}</button>}
          </div>
        ))}
        <b className="small">Portfolio</b>
        {Object.keys(s.startups || {}).length === 0 && <p className="muted">Koi startup nahi abhi.</p>}
        {Object.entries(s.startups || {}).map(([id, pos]) => { const st = startupById(id); return st && <div className="row" key={id}><span>{st.name}</span><b>{fmt(pos.amt)} • Day {pos.since} se</b></div> })}
      </Section>

      <Section id="movies" title="🎬 Movie Producer Bano" defaultOpen={false}>
        {films.map((mv) => (
          <div className="biz-card" key={mv.id}>
            <div className="row" style={{ border: 'none', padding: 0 }}><b>'{mv.title}'</b><b>Budget {fmt(mv.budget)}</b></div>
            <div className="muted">{mv.genre} • {mv.star} • Producer share (10%): {fmt(Math.round(mv.budget * 0.1))} • Hit chance ~{Math.round(mv.hitChance * 100)}% • Hit par ~{mv.mult}x</div>
            <div className="small">{mv.note}</div>
            {(s.movies || {})[mv.id]
              ? <div className="pos small" style={{ marginTop: 6 }}>✔ Producer ho — release Day {(s.movies[mv.id]).releaseDay}</div>
              : <button className="btn small" style={{ marginTop: 8 }} onClick={() => investMovie(mv)}>🎬 Producer Bano</button>}
          </div>
        ))}
      </Section>

      <Section id="opps" title="🎲 Aaj ke Mauke — Mystery, Khazana, Andaza" defaultOpen={false}>
        <div className="biz-card">
          <b>🕵️ Mystery Deal — {opps.mystery.dealer}</b>
          <div className="small">{opps.mystery.story}</div>
          <div className="muted">Keemat {fmt(opps.mystery.price)} • Asli nikla to ~{opps.mystery.winMult}x • {opps.mystery.risk}</div>
          <button className="btn small" style={{ marginTop: 8 }} disabled={s.oppDay === s.day} onClick={takeMystery}>{s.oppDay === s.day ? 'Aaj ka deal ho gaya' : '🤝 Deal Karo'}</button>
        </div>
        <div className="biz-card">
          <b>⛏️ Khazane ki Talaash — {opps.treasure.place}</b>
          <div className="small">{opps.treasure.rumor}</div>
          <div className="muted">Kharch {fmt(opps.treasure.cost)} • {opps.treasure.days} din • Mila to ~{opps.treasure.prizeMult}x</div>
          <button className="btn small" style={{ marginTop: 8 }} onClick={startTreasure}>🗺️ Talaash Shuru Karo</button>
          {(s.treasuresActive || []).map((t, i) => <div className="muted" key={i}>⏳ {t.place} — Day {t.doneDay} ko nateeja</div>)}
        </div>
        <div className="biz-card">
          <b>🔮 Prediction Bazaar</b>
          <div className="small">{opps.prediction.q}</div>
          <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
            {[1000, 5000, 25000].map((a) => <button key={a} className={'chip' + (predAmt === a ? ' on' : '')} onClick={() => setPredAmt(a)}>{fmt(a)}</button>)}
            <button className="btn small green" onClick={placePrediction}>Andaza Lago</button>
          </div>
          {(s.predictions || []).map((p, i) => <div className="muted" key={i}>⏳ {fmt(p.amt)} laga — Day {p.dueDay} ko faisla (jeet par {p.payout}x)</div>)}
        </div>
        <div className="biz-card">
          <b>⏳ Time Capsule — Sabr wala Nivesh</b>
          <div className="muted">Paisa band karo: 1 saal +25%, 3 saal +100%, 5 saal +220% bonus. Beech me haath nahi lagega.</div>
          <div style={{ display: 'flex', gap: 7, marginTop: 8, flexWrap: 'wrap' }}>
            {[10000, 50000, 200000].map((a) => <button key={a} className={'chip' + (capsuleAmt === a ? ' on' : '')} onClick={() => setCapsuleAmt(a)}>{fmt(a)}</button>)}
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
            <button className="btn small ghost" onClick={() => lockCapsule(1)}>1 Saal Band</button>
            <button className="btn small ghost" onClick={() => lockCapsule(3)}>3 Saal Band</button>
            <button className="btn small ghost" onClick={() => lockCapsule(5)}>5 Saal Band</button>
          </div>
          {(s.capsules || []).map((c, i) => <div className="muted" key={i}>🔒 {fmt(c.amt)} — Day {c.unlockDay} ko khulega (+{Math.round(c.bonus * 100)}%)</div>)}
        </div>
      </Section>

      <Section id="lifestyle" title="✨ Luxury Ladder — Shaan ka Kharch" defaultOpen={false}>
        <p className="muted">Kamaai sirf ginne ke liye nahi — jeene ke liye hai. Har seedhi par khushi aur shaan badhti hai.</p>
        {LIFESTYLE.filter((it) => !(s.lifestyle || []).includes(it.id)).slice(0, 8).map((it) => (
          <div className="row" key={it.id}>
            <div><b>{it.name}</b><div className="muted">{it.kind} • Khushi +{it.happy} • Saakh +{it.rep}</div></div>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><b>{fmt(it.price)}</b><button className="btn small green" onClick={() => buyLifestyle(it)}>Buy</button></span>
          </div>
        ))}
        {(s.lifestyle || []).length > 0 && <div className="muted" style={{ marginTop: 8 }}>Tumhare paas: {(s.lifestyle || []).map((id) => lifestyleById(id)?.name).filter(Boolean).join(' • ')}</div>}
      </Section>

      <Section id="charity" title="🙏 Daan & City Projects — Izzat ka Kharch" defaultOpen={false}>
        <b className="small">Daan-Punya (Legacy + Saakh)</b>
        {CHARITY.slice(0, 6).map((c) => (
          <div className="row" key={c.id}><span>{c.cause}</span><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><b>{fmt(c.amt)}</b><button className="btn small green" onClick={() => doCharity(c)}>Daan Do</button></span></div>
        ))}
        <b className="small" style={{ display: 'block', marginTop: 10 }}>City Projects — Tumhare Naam ki Patti</b>
        {CITY_PROJECTS.slice(0, 6).map((p) => (
          <div className="row" key={p.id}>
            <div><b>{p.name}</b><div className="muted">{p.note}</div></div>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><b>{fmt(p.cost)}</b><button className="btn small green" disabled={(s.cityProjects || []).includes(p.id)} onClick={() => fundProject(p)}>{(s.cityProjects || []).includes(p.id) ? '✔' : 'Fund'}</button></span>
          </div>
        ))}
      </Section>
    </>
  )
}

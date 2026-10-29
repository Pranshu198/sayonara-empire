// ============ PASS 3.5 — HOME COMMAND CENTRE ============
// Hero (net worth + sparkline + aaj ka munafa), Alerts/Next-Best-Action, Guided First Run, Away summary.
// Saare naye labels t(key) se — 19 bhashaon ke packs me keys maujood hain.
import { useMemo } from 'react'
import { AnimatedNumber } from './ui.jsx'
import { TrendChip } from './cards.jsx'
import { Icon } from './icons/index.jsx'
import { bizDef, missionProgress } from '../game/engine.js'
import { activeFestivals, upcomingFestivals } from '../game/festivals/index.js'
import { cityOf, HOME_CITY } from '../game/atlas/cityIndex.js'
import { statsText } from '../game/settings.js'
import { stripEmoji } from '../utils/text.js'

function Sparkline({ hist, nw }) {
  const pts = (hist && hist.length > 1 ? hist : [nw, nw])
  const min = Math.min(...pts), max = Math.max(...pts), span = Math.max(1, max - min)
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * 100, 26 - ((v - min) / span) * 22 - 2])
  const line = xy.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ')
  const area = `0,28 ${line} 100,28`
  return (
    <svg className="hero-spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a855f7" stopOpacity=".45" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0" /></linearGradient></defs>
      <polygon points={area} fill="url(#heroFill)" />
      <polyline points={line} fill="none" stroke="#f5c542" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function HomePanel({ s, nw, fmtN, tx, go, upd, say, act }) {
  const entries = Object.entries(s.biz || {})
  const tut = s.tut || {}
  const todayProfit = Math.round((s.dayRevenue || 0) - (s.dayCosts || 0))
  const hist = s.nwHist || [nw]
  const nwDelta = hist.length > 1 && hist[0] > 0 ? ((nw - hist[0]) / hist[0]) * 100 : 0

  const fest = useMemo(() => {
    const home = cityOf(HOME_CITY)
    const active = activeFestivals(s.day, home)
    if (active.length) return { active: true, name: active[0].name }
    const cities = (s.unlockedCities || ['india_delhi']).map((c) => cityOf(c)).filter(Boolean)
    const up = upcomingFestivals(s.day, cities, 30)
    return up.length ? { active: false, name: up[0].f.name, inDays: up[0].inDays } : null
  }, [s.day, s.unlockedCities])

  const why = useMemo(() => {
    const bd = s.lastBreakdown
    if (!bd || !s.lastDayReport) return null
    const tr = statsText(s.settings)
    const labels = { cogs: tr.cogs, wages: tr.wages, rent: tr.rent, util: tr.util, wastage: tr.wastage, interest: tr.interest }
    const top = Object.entries(bd).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0]
    if (!top || !top[1]) return null
    return `${tx('topCost')}: ${labels[top[0]] || top[0]} ${fmtN(top[1])}`
  }, [s.lastBreakdown, s.lastDayReport, s.settings, tx, fmtN])

  const alerts = useMemo(() => {
    const out = []
    const low = entries.filter(([, o]) => (o.stock ?? 100) < 25).sort((a, b) => a[1].stock - b[1].stock)
    if (low.length) { const [k, o] = low[0]; const d = bizDef(k); out.push({ id: 'stock', icon: 'warn', cls: 'red', title: `${d ? d.name : k} — ${tx('lowStock')} ${Math.round(o.stock)}%`, label: tx('restockNow'), fn: () => act.restockKey(k) }) }
    const claimable = (s.missions || []).filter((m) => missionProgress(s, m) >= m.target && !s.missionsDone.includes(m.id + '_' + s.day))
    if (claimable.length) out.push({ id: 'mission', icon: 'gift', cls: 'violet', title: tx('claimReady'), sub: stripEmoji(claimable[0].text || ''), label: tx('claimNow'), fn: () => act.claimMission(claimable[0]) })
    if (s.lastDaily !== s.day) out.push({ id: 'daily', icon: 'gift', cls: '', title: tx('dailyReady'), label: tx('claimNow'), fn: () => act.claimDaily() })
    if (s.loan && s.loan.amount > 0) out.push({ id: 'emi', icon: 'bank', cls: '', title: tx('emiAlert'), sub: fmtN(s.loan.emi) + ' / EMI', label: tx('go'), fn: () => go('bank') })
    if (s.cash >= 60000 && s.bank < 5000) out.push({ id: 'idle', icon: 'cash', cls: 'violet', title: tx('idleCash'), sub: tx('depositTip'), label: tx('bankLbl'), fn: () => act.depositIdle() })
    return out
  }, [s, entries, tx, fmtN, act, go])

  const steps = [
    { done: !!tut.buy || entries.length > 0, label: tx('tut1'), tab: 'biz' },
    { done: !!tut.price || entries.some(([, o]) => o.price !== 1), label: tx('tut2'), tab: 'hq' },
    { done: !!tut.restock, label: tx('tut3'), tab: 'hq' },
    { done: !!tut.day || !!s.lastDayReport, label: tx('tut4'), tab: 'home' },
    { done: !!tut.report, label: tx('tut5'), tab: 'home' },
  ]
  const doneCount = steps.filter((x) => x.done).length
  const nowIdx = steps.findIndex((x) => !x.done)
  const showTut = !tut.done && !tut.skipped

  return (
    <>
      {s.awayReport && (
        <div className="card away-card">
          <div className="row" style={{ border: 'none', paddingTop: 0 }}>
            <b><Icon name="clock" size={16} /> {tx('awayTitle')}</b>
            <span className="gold">~{s.awayReport.hours}h</span>
          </div>
          <div className="row"><span>{tx('awayEarned')}</span><b className="pos">{fmtN(s.awayReport.gain)}</b></div>
          <button className="btn small" style={{ marginTop: 8 }} onClick={() => upd((n) => { n.awayReport = null })}>{tx('dismiss')}</button>
        </div>
      )}

      <div className="hero-card">
        <div className="hero-lbl">{tx('netWorth')}</div>
        <div className="hero-nw"><AnimatedNumber value={nw} format={fmtN} /></div>
        <TrendChip dir={nwDelta > 0.05 ? 'up' : nwDelta < -0.05 ? 'down' : 'flat'}>{(nwDelta >= 0 ? '+' : '') + nwDelta.toFixed(1)}%</TrendChip>
        <Sparkline hist={hist} nw={nw} />
        <div className="hero-grid">
          <div className="hero-stat"><div className="l">{tx('heroToday')}</div><div className={'v ' + (todayProfit >= 0 ? 'pos' : 'neg')}>{fmtN(todayProfit)}</div></div>
          <div className="hero-stat"><div className="l">{tx('cash')}</div><div className="v">{fmtN(s.cash)}</div></div>
          <div className="hero-stat"><div className="l">{tx('receivables')}</div><div className="v">{fmtN(s.receivables)}</div></div>
        </div>
        {fest && <div className="hero-fest"><Icon name="calendar" size={15} />{fest.active ? <span><b>{tx('todayFest')}:</b> {fest.name} — {tx('festBoost')}</span> : <span><b>{tx('nextFest')}:</b> {fest.name} · {fest.inDays} {tx('daysToGo')}</span>}</div>}
        {why && <div className="hero-why"><Icon name="trend" size={13} /> {tx('whyTitle')} {why}{s.lastDayReport ? ` · ${tx('heroYesterday')}: ${fmtN(s.lastDayReport.profit)}` : ''}</div>}
      </div>

      <div className="card section">
        <div className="sec-head" style={{ cursor: 'default' }}>
          <span className="sec-title"><Icon name="target" size={17} /> {tx('alertsTitle')}</span>
          {alerts.length > 0 && <span className="next-tag">{tx('nextAction')}</span>}
        </div>
        <div className="sec-body">
          {alerts.length === 0 && <div className="alert-row"><span className="alert-ic" style={{ background: '#06280f', borderColor: '#14532d', color: 'var(--green)' }}><Icon name="check" size={17} /></span><div className="alert-tx">{tx('noAlerts')}</div></div>}
          {alerts.slice(0, 4).map((a) => (
            <div className="alert-row" key={a.id}>
              <span className={'alert-ic ' + a.cls}><Icon name={a.icon} size={17} /></span>
              <div className="alert-tx"><div>{a.title}</div>{a.sub && <div className="sub">{a.sub}</div>}</div>
              <button className="btn small" onClick={a.fn}>{a.label}</button>
            </div>
          ))}
        </div>
      </div>

      {showTut && (
        <div className="card section">
          <div className="sec-head" style={{ cursor: 'default' }}>
            <span className="sec-title"><Icon name="spark" size={17} /> {tx('tutTitle')}</span>
            <button className="chip" onClick={() => upd((n) => { n.tut = { ...(n.tut || {}), skipped: 1 } })}>{tx('tutSkip')}</button>
          </div>
          <div className="sec-body">
            <div className="tut-prog"><i style={{ width: (doneCount / steps.length) * 100 + '%' }} /></div>
            {steps.map((st, i) => (
              <div className={'tut-step' + (st.done ? ' done' : i === nowIdx ? ' now' : '')} key={i}>
                <span className="tut-dot">{st.done ? <Icon name="check" size={13} /> : <span style={{ fontSize: 11, fontWeight: 800 }}>{i + 1}</span>}</span>
                <div className="tt">{st.label}</div>
                {!st.done && i === nowIdx && st.tab !== 'home' && <button className="btn small ghost" onClick={() => go(st.tab)}>{tx('go')}</button>}
              </div>
            ))}
            {doneCount === steps.length && <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={() => { upd((n) => { n.tut = { ...(n.tut || {}), done: 1 } }); say(tx('tutFinish'), true) }}>{tx('tutFinish')}</button>}
          </div>
        </div>
      )}
    </>
  )
}

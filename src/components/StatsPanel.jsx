import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Section, AnimatedNumber } from './ui.jsx'
import { fmt, netWorth, bizDef } from '../game/engine.js'
import { legacyScore, legacyTitle, wealthValue } from '../game/wealthEngine.js'
import { cityOf, cityNameOf } from '../game/atlas/cityIndex.js'
import { statsText } from '../game/settings.js'

// Stats / Analytics command-center — saare number engine ke asal P&L se bante hain.
// Rates = pichla poora din + aaj ka run-rate (average-andaz, UI par saaf likha hai).
const fmtRate = (n) => { const a = Math.abs(n); if (a > 0 && a < 10) return (n < 0 ? '-₹' : '₹') + a.toFixed(2); if (a >= 10 && a < 100) return (n < 0 ? '-₹' : '₹') + a.toFixed(1); return fmt(n) }
const fmtInt = (n) => '≈ ' + Math.round(n || 0).toLocaleString('en-IN')

export function StatsPanel({ s }) {
  const tr = statsText(s.settings)
  const nw = useMemo(() => netWorth(s), [s])
  const [tick, setTick] = useState(0)
  const [wfSel, setWfSel] = useState(null)
  useEffect(() => { const iv = setInterval(() => setTick((t) => t + 1), 1000); return () => clearInterval(iv) }, [])

  const life = s.life || { rev: 0, costs: 0, tax: 0, wages: 0, customers: 0, items: 0, phases: 0, bestDayProfit: null, worstDayProfit: null, bestDay: 0, worstDay: 0, biggestDayCost: 0, streak: 0, longestStreak: 0, milestones: {}, lifeStartDay: s.day }
  // ---------- Rates (honest estimate: last full day + aaj ka projected din, average) ----------
  const last = s.lastDayReport
  const phasesDone = s.phase
  const projRev = phasesDone > 0 ? (s.dayRevenue / phasesDone) * 4 : 0
  const projCost = phasesDone > 0 ? (s.dayCosts / phasesDone) * 4 : 0
  const revDay = last ? (phasesDone > 0 ? (last.revenue + projRev) / 2 : last.revenue) : projRev
  const costDay = last ? (phasesDone > 0 ? (last.costs + projCost) / 2 : last.costs) : projCost
  const netDay = revDay - costDay
  const auto = s.mode === 'auto'
  const secPerDay = Math.max(5, (s.dayLen || 60) / Math.max(1, s.speed || 1))
  const rate = (perDay) => (auto ? perDay / secPerDay : perDay / 4)
  const unit = auto ? tr.perSec : tr.perPhase
  const incR = rate(revDay), burnR = rate(costDay), netR = rate(netDay)
  const sessionNet = auto ? netR * tick : 0

  // ---------- Burn breakdown (aakhri poora din; aaj ka partial bhi mila kar) ----------
  const bd = useMemo(() => {
    const base = { cogs: 0, wages: 0, rent: 0, util: 0, wastage: 0, interest: 0 }
    if (s.lastBreakdown) for (const k of Object.keys(base)) base[k] += s.lastBreakdown[k] || 0
    if (s.bd) for (const k of ['cogs', 'wages', 'rent', 'util', 'wastage']) base[k] += (s.bd[k] || 0)
    return base
  }, [s.lastBreakdown, s.bd])
  const bdTotal = Math.max(1, bd.cogs + bd.wages + bd.rent + bd.util + bd.wastage + bd.interest)
  const bdRows = [[tr.cogs, bd.cogs, '#e879f9'], [tr.wages, bd.wages, '#f5c542'], [tr.rent, bd.rent, '#60a5fa'], [tr.util, bd.util, '#34d399'], [tr.wastage, bd.wastage, '#f87171'], [tr.interest, bd.interest, '#a78bfa']]

  // ---------- Empire snapshot ----------
  const entries = Object.entries(s.biz || {})
  const uniqTypes = new Set(entries.map(([k]) => k)).size
  const cities = new Set(entries.map(([, o]) => o.loc || 'india_delhi'))
  const countries = new Set([...cities].map((c) => { try { return cityOf(c).country } catch { return 'India' } }))
  const totStaff = entries.reduce((a, [, o]) => a + (o.staff || 0), 0)
  const totManagers = Object.keys(s.managers || {}).length
  const portfolio = Object.entries(s.holdings || {}).reduce((a, [sym, q]) => { const st = [...(s.stocks || []), ...(s.commodities || [])].find((x) => x.sym === sym); return a + (st ? st.price * q : 0) }, 0)
  const assetsCount = Object.keys(s.invest || {}).length + (s.collectibles || []).length + Object.keys(s.startups || {}).length + Object.keys(s.movies || {}).length + (s.capsules || []).length
  const invested = entries.reduce((a, [k, o]) => { const d = bizDef(k); return a + (d ? d.cost * (1 + 0.55 * Math.max(0, o.lv - 1)) : 0) }, 0) + (s.props || []).reduce((a, pid) => a, 0)
  const margin = life.rev > 0 ? ((life.rev - life.costs) / life.rev) * 100 : 0
  const roi = invested > 0 && life.rev > 0 ? ((life.rev - life.costs) / invested) * 100 : 0
  const staffRatio = revDay > 0 ? Math.min(999, ((bd.wages / bdTotal) * costDay) / revDay * 100) : 0
  const health = netDay > 0 && s.cash >= 0 ? tr.healthy : netDay >= 0 ? tr.tight : tr.danger
  const healthCls = health === tr.healthy ? 'pos' : health === tr.tight ? 'gold' : 'neg'

  // Category / city munafa hissa
  const catShare = useMemo(() => {
    const m = {}
    for (const [k, o] of entries) { const d = bizDef(k); if (d) m[d.cat] = (m[d.cat] || 0) + Math.max(0, o.profitTotal || 0) }
    const tot = Object.values(m).reduce((a, b) => a + b, 0)
    return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([c, v]) => [c, v, tot > 0 ? (v / tot) * 100 : 0])
  }, [s.biz])
  const cityShare = useMemo(() => {
    const m = {}
    for (const [, o] of entries) { const n = cityNameOf(o.loc || 'india_delhi'); m[n] = (m[n] || 0) + Math.max(0, o.profitTotal || 0) }
    const tot = Math.max(1, Object.values(m).reduce((a, b) => a + b, 0))
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c, v]) => [c, v, (v / tot) * 100])
  }, [s.biz])
  const donutSegs = useMemo(() => {
    const cols = ['#f5c542', '#e879f9', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fbbf24', '#38bdf8']
    let acc = 0
    return catShare.map(([c, v, p], i) => { const seg = { c, p, col: cols[i % cols.length], off: acc }; acc += p; return seg }).filter((x) => x.p > 0.5)
  }, [catShare])

  // NW chart
  const hist = s.nwHist && s.nwHist.length > 1 ? s.nwHist : [nw, nw]
  const hMin = Math.min(...hist), hMax = Math.max(...hist), hRange = Math.max(1, hMax - hMin)
  const pts = hist.map((v, i) => `${(i / (hist.length - 1)) * 320},${84 - ((v - hMin) / hRange) * 74}`).join(' ')

  // Records
  const bestBiz = entries.reduce((best, [k, o]) => (!best || (o.profitTotal || 0) > (best[1].profitTotal || 0) ? [k, o] : best), null)
  const rank = [...(s.rivals || []).map((r) => r.nw), nw].sort((a, b) => b - a).indexOf(nw) + 1
  const legacy = legacyScore(s, nw)
  const MS = [['nw1L', '₹1 L'], ['nw10L', '₹10 L'], ['nw1Cr', '₹1 Cr'], ['nw10Cr', '₹10 Cr'], ['nw100Cr', '₹100 Cr']]

  const RateCard = ({ label, val, cls }) => (
    <div className="rate-card">
      <div className="muted">{label}</div>
      <div className={'rate-val ' + (cls || '')}><AnimatedNumber value={val} format={fmtRate} /><span className="rate-unit">{unit}</span></div>
    </div>
  )
  const Row = ({ l, v, cls }) => <div className="row"><span>{l}</span><b className={cls || ''}>{v}</b></div>

  return (
    <>
      <Section id="stats_rates" title={tr.rates} right={<span className="live-dot" aria-label="live" />}>
        <div className="stats-grid">
          <RateCard label={tr.income} val={incR} cls="pos" />
          <RateCard label={tr.burn} val={burnR} cls="neg" />
          <RateCard label={tr.net} val={netR} cls={netR >= 0 ? 'pos' : 'neg'} />
        </div>
        <Row l={`${tr.income} ${tr.perMin} (andaz)`} v={auto ? fmtRate(incR * 60) : fmtRate(revDay)} />
        <Row l={`${tr.income} ${tr.perHour} (andaz)`} v={auto ? fmtRate(incR * 3600) : fmtRate(revDay * 6)} />
        <Row l={`${tr.burn} ${tr.perMin} (andaz)`} v={auto ? fmtRate(burnR * 60) : fmtRate(costDay)} />
        {auto && <Row l={tr.sessionEst} v={fmt(sessionNet)} cls={sessionNet >= 0 ? 'pos' : 'neg'} />}
        <p className="muted">{tr.estNote}</p>
        <b className="small" style={{ display: 'block', marginTop: 8 }}>{tr.burnBreak}</b>
        {bdRows.map(([l, v, col]) => (
          <div className="bar-row" key={l}>
            <span className="bar-lbl">{l}</span>
            <div className="bar-track"><motion.i initial={{ width: 0 }} animate={{ width: Math.max(1.5, (v / bdTotal) * 100) + '%' }} transition={{ duration: 0.7, ease: 'easeOut' }} style={{ background: col }} /></div>
            <b>{Math.round((v / bdTotal) * 100)}%</b>
          </div>
        ))}
      </Section>

      <Section id="stats_waterfall" title={tr.waterfall} defaultOpen={false}>
        {(() => {
          if (!s.lastDayReport || !s.lastBreakdown) return <p className="muted">{tr.wfEmpty}</p>
          const rev = s.lastDayReport.revenue || 0
          const parts = [[tr.cogs, s.lastBreakdown.cogs || 0, '#e879f9'], [tr.wages, s.lastBreakdown.wages || 0, '#f5c542'], [tr.rent, s.lastBreakdown.rent || 0, '#60a5fa'], [tr.util, s.lastBreakdown.util || 0, '#34d399'], [tr.wastage, s.lastBreakdown.wastage || 0, '#f87171'], [tr.interest, s.lastBreakdown.interest || 0, '#a78bfa']].filter((p) => p[1] > 0)
          let cum = rev
          const steps = [{ label: tr.wfRevenue, val: rev, from: 0, to: rev, col: '#f5c542', total: true }]
          for (const [l, v, col] of parts) { steps.push({ label: l, val: -v, from: cum - v, to: cum, col }); cum -= v }
          steps.push({ label: tr.wfProfit, val: cum, from: 0, to: cum, col: cum >= 0 ? '#2ee06f' : '#ff5252', total: true })
          const max = Math.max(rev, 1)
          return <>
            {steps.map((st, i) => (
              <button className="wf-row" key={i} onClick={() => setWfSel(st)} aria-label={`${st.label} ${fmt(st.val)}`}>
                <span className="wf-lbl">{st.label}</span>
                <span className="wf-track"><i style={{ left: (Math.max(0, st.from) / max) * 100 + '%', width: Math.max(1.5, (Math.abs(st.to - st.from) / max) * 100) + '%', background: st.col }} /></span>
                <b className={st.total ? (st.val >= 0 ? 'pos' : 'neg') : 'neg'}>{fmt(st.val)}</b>
              </button>
            ))}
            {wfSel && <p className="small" style={{ marginTop: 6 }}><b>{wfSel.label}:</b> {fmt(wfSel.val)}{wfSel.total ? '' : ` (${((Math.abs(wfSel.val) / Math.max(1, rev)) * 100).toFixed(1)}% of revenue)`}</p>}
            <p className="muted">{tr.wfNote}</p>
          </>
        })()}
      </Section>

      <Section id="stats_life" title={tr.lifetime} defaultOpen={false}>
        <Row l={tr.lIncome} v={<AnimatedNumber value={life.rev} format={fmt} />} cls="pos" />
        <Row l={tr.lCosts} v={<AnimatedNumber value={life.costs} format={fmt} />} cls="neg" />
        <Row l={tr.lProfit} v={fmt(life.rev - life.costs)} cls={life.rev - life.costs >= 0 ? 'pos' : 'neg'} />
        <Row l={tr.lTax} v={fmt(life.tax)} />
        <Row l={tr.lWages} v={fmt(life.wages)} />
        <Row l={tr.lCustomers} v={fmtInt(life.customers)} />
        <Row l={tr.lItems} v={fmtInt(life.items)} />
        <Row l={tr.lDays} v={String(Math.max(0, s.day - 1))} />
        <Row l={tr.lPhases} v={String(Math.round(life.phases))} />
        <Row l={tr.biggestCost} v={fmt(life.biggestDayCost)} cls="neg" />
        {(life.lifeStartDay || 1) > 1 && <p className="muted">{tr.lifeNote.replace('{day}', tr.dayWord + ' ' + life.lifeStartDay)}</p>}
      </Section>

      <Section id="stats_empire" title={tr.empire} defaultOpen={false}>
        <Row l={tr.totBiz} v={String(entries.length)} />
        <Row l={tr.uniqBiz} v={String(uniqTypes)} />
        <Row l={tr.cities} v={String(cities.size)} />
        <Row l={tr.countries} v={String(countries.size)} />
        <Row l={tr.totStaff} v={String(totStaff)} />
        <Row l={tr.totManagers} v={String(totManagers)} />
        <Row l={tr.props} v={String((s.props || []).length)} />
        <Row l={tr.assets} v={String(assetsCount) + ' • ' + fmt(wealthValue(s))} />
        <Row l={tr.portfolio} v={fmt(portfolio)} />
        <Row l={tr.staffRatio} v={staffRatio.toFixed(1) + '%'} />
        <Row l={tr.margin} v={margin.toFixed(1) + '%'} cls={margin >= 0 ? 'pos' : 'neg'} />
        <Row l={tr.roi} v={roi.toFixed(1) + '%'} cls={roi >= 0 ? 'pos' : 'neg'} />
        <Row l={tr.health} v={health} cls={healthCls} />
        <b className="small" style={{ display: 'block', marginTop: 10 }}>{tr.nwChart}</b>
        <div className="chart-box">
          <svg viewBox="0 0 320 92" className="nw-svg" preserveAspectRatio="none">
            <motion.polyline points={pts} fill="none" stroke="url(#statsg)" strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
            <defs><linearGradient id="statsg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#a855f7" /><stop offset="55%" stopColor="#e879f9" /><stop offset="100%" stopColor="#f5c542" /></linearGradient></defs>
          </svg>
          <div className="row" style={{ border: 'none', padding: 0 }}><span className="muted">{fmt(hMin)}</span><b className="gold">{fmt(hMax)}</b></div>
        </div>
        {donutSegs.length > 0 && <>
          <b className="small" style={{ display: 'block', marginTop: 10 }}>{tr.shareCat}</b>
          <div className="donut-wrap">
            <svg viewBox="0 0 80 80" className="donut-svg">
              {donutSegs.map((seg) => (
                <circle key={seg.c} cx="40" cy="40" r="31" fill="none" stroke={seg.col} strokeWidth="11"
                  strokeDasharray={`${(seg.p / 100) * 194.8} 194.8`} strokeDashoffset={-(seg.off / 100) * 194.8} transform="rotate(-90 40 40)" />
              ))}
            </svg>
            <div className="donut-legend">
              {donutSegs.map((seg) => <div className="row" key={seg.c} style={{ border: 'none', padding: '2px 0' }}><span><i className="dot" style={{ background: seg.col }} />{seg.c}</span><b>{seg.p.toFixed(1)}%</b></div>)}
            </div>
          </div>
        </>}
        <b className="small" style={{ display: 'block', marginTop: 10 }}>{tr.shareCity}</b>
        {cityShare.map(([c, v, p]) => (
          <div className="bar-row" key={c}>
            <span className="bar-lbl">{c}</span>
            <div className="bar-track"><motion.i initial={{ width: 0 }} animate={{ width: Math.max(1.5, p) + '%' }} transition={{ duration: 0.7 }} style={{ background: '#f5c542' }} /></div>
            <b>{p.toFixed(1)}%</b>
          </div>
        ))}
      </Section>

      <Section id="stats_records" title={tr.records} defaultOpen={false}>
        <Row l={tr.bestDay} v={life.bestDayProfit === null ? '—' : `${fmt(life.bestDayProfit)} (${tr.dayWord} ${life.bestDay})`} cls="pos" />
        <Row l={tr.worstDay} v={life.worstDayProfit === null ? '—' : `${fmt(life.worstDayProfit)} (${tr.dayWord} ${life.worstDay})`} cls="neg" />
        {bestBiz && <Row l="Best Business (kul munafa)" v={`${bizDef(bestBiz[0]) ? bizDef(bestBiz[0]).name : bestBiz[0]} • ${cityNameOf(bestBiz[1].loc || 'india_delhi')} • ${fmt(bestBiz[1].profitTotal)}`} cls="gold" />}
        <Row l={tr.streak} v={String(life.streak || 0)} />
        <Row l={tr.longestStreak} v={String(life.longestStreak || 0)} />
        <Row l={tr.rank} v={`#${rank} / ${(s.rivals || []).length + 1}`} />
        <Row l={tr.legacy} v={`${Math.round(legacy)} • ${legacyTitle(legacy)}`} cls="gold" />
        <b className="small" style={{ display: 'block', marginTop: 10 }}>{tr.ms}</b>
        {MS.map(([k, label]) => (
          <Row key={k} l={label} v={life.milestones && life.milestones[k] ? `${tr.dayWord} ${life.milestones[k]}` : tr.notYet} cls={life.milestones && life.milestones[k] ? 'pos' : ''} />
        ))}
      </Section>
    </>
  )
}

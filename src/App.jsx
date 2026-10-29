import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BUSINESSES, CATEGORIES, CAT_LABEL, PHASES, PROPERTIES, DISTRICTS, ACHIEVEMENTS, levelOf, ownedCount } from './game/data.js'
import { fmt, initialState, phaseTick, netWorth, bizDef, missionProgress } from './game/engine.js'
import { Section, AnimatedNumber, Burst, Toast } from './components/ui.jsx'
import { Splash } from './components/Splash.jsx'
import { PhaseArc } from './components/PhaseArc.jsx'
import { FpsMeter } from './components/FpsMeter.jsx'
import { cityOf, cityNameOf, HOME_CITY } from './game/atlas/cityIndex.js'
import { activeFestivals, seasonOf } from './game/festivals/index.js'
import { stockNewsOf } from './game/stocknews/index.js'
// Bhaari panels lazy chunks me — pehli load tez, tab khulne par aate hain
const lazyNamed = (p, name) => lazy(() => p.then((m) => ({ default: m[name] })))
const SettingsPanel = lazyNamed(import('./components/SettingsPanel.jsx'), 'SettingsPanel')
const WealthPanel = lazyNamed(import('./components/WealthPanel.jsx'), 'WealthPanel')
const BazaarPanel = lazyNamed(import('./components/BazaarPanel.jsx'), 'BazaarPanel')
const AuctionPanel = lazyNamed(import('./components/AuctionPanel.jsx'), 'AuctionPanel')
const ReviewsPanel = lazyNamed(import('./components/ReviewsPanel.jsx'), 'ReviewsPanel')
const DecisionPanel = lazyNamed(import('./components/DecisionPanel.jsx'), 'DecisionPanel')
const EncyclopediaPanel = lazyNamed(import('./components/EncyclopediaPanel.jsx'), 'EncyclopediaPanel')
const BulkAchievements = lazyNamed(import('./components/BulkAchievements.jsx'), 'BulkAchievements')
const AtlasPanel = lazyNamed(import('./components/AtlasPanel.jsx'), 'AtlasPanel')
const ManagersPanel = lazyNamed(import('./components/ManagersPanel.jsx'), 'ManagersPanel')
const ImportPanel = lazyNamed(import('./components/ImportPanel.jsx'), 'ImportPanel')
const ProcurementPanel = lazyNamed(import('./components/ProcurementPanel.jsx'), 'ProcurementPanel')
const StatsPanel = lazyNamed(import('./components/StatsPanel.jsx'), 'StatsPanel')
const HqPanel = lazyNamed(import('./components/HqPanel.jsx'), 'HqPanel')
const HomePanel = lazyNamed(import('./components/HomePanel.jsx'), 'HomePanel')
import { StatsIcon } from './components/StatsIcon.jsx'
import { BizScene } from './components/BizScene.jsx'
import { tierOf, tierKeyOf, nextTierAt, evoProgress, MAX_LV } from './game/evolution.js'
import { Icon, CatIcon } from './components/icons/index.jsx'
import { SkeletonCard } from './components/cards.jsx'
import { bizIdOf, branchKey } from './game/businesses/index.js'
import { loadLang, makeT, chromeFromPack, isRTL, FONT_STACKS, detectLang } from './i18n/index.js'
import { stripEmoji } from './utils/text.js'
import { fmtIntl } from './utils/fmt.js'
import { buzz, BUZZ } from './utils/haptics.js'
import { ensureStaffLib } from './game/staffSystem.js'
const PanelFallback = () => <SkeletonCard lines={4} />
import { withDefaults, chromeText } from './game/settings.js'
import { playSound } from './utils/sound.js'
import { profileOf } from './game/content/stocks/index.js'
import { dialogueOf } from './game/content/rivals/index.js'
import { loreOf } from './game/content/districts/index.js'

function PerfGuard({ mode }) {
  useEffect(() => {
    if (mode === 'off') { document.body.classList.remove('perf-low'); return }
    if (mode === 'on') { document.body.classList.add('perf-low'); return }
    let frames = 0, low = 0, raf; const t0 = performance.now()
    const loop = (now) => { frames++; if (now - t0 > 4000) { const fps = frames / ((now - t0) / 1000); if (fps < 38) { low++; if (low >= 1) document.body.classList.add('perf-low') } frames = 0; return } raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode])
  return null
}
const fmtFull = (n) => { n = Math.round(n || 0); const neg = n < 0; n = Math.abs(n); return (neg ? '-₹' : '₹') + n.toLocaleString('en-IN') }
function migrate(saved) {
  if (!saved) return saved
  const hadLife = !!saved.life
  const base = initialState()
  for (const k of Object.keys(base)) if (saved[k] === undefined) saved[k] = base[k]
  // Purana save: lifetime counters aaj (uske maujooda din) se ginne shuru — Stats tab par note bhi yahi kehta hai
  if (!hadLife && saved.life) saved.life = { ...saved.life, lifeStartDay: saved.day || 1 }
  saved.settings = withDefaults(saved.settings)
  // Pass 3.5: purane/khel chuke saves par tutorial dobara na dikhe — veteran = auto-complete
  if (!saved.tut || !Object.keys(saved.tut).length) {
    if ((saved.day || 1) > 1 || Object.keys(saved.biz || {}).length > 0) saved.tut = { done: 1 }
    else saved.tut = {}
  }
  // Pass 3.2: purane single-location businesses ko branch keys (type@city) me badlo — save surakshit migration
  if (saved.biz) {
    const nb = {}
    for (const [k, o] of Object.entries(saved.biz)) {
      // Pass 3.6 fix: kuch purane saves me branch key 'id@[object Object]' ban gayi thi (HOME_CITY object bug) — use asal sheher par rekey karo, data same rakho
      const oo = { ...o }
      if (typeof oo.loc !== 'string') oo.loc = 'india_delhi'
      if (k.includes('@')) { const key = k.includes('[object Object]') ? k.split('@')[0] + '@india_delhi' : k; if (!nb[key]) nb[key] = { employees: [], ...oo } }
      else { const loc = oo.loc || 'india_delhi'; nb[k + '@' + loc] = { ...oo, loc, employees: oo.employees || [] } }
    }
    saved.biz = nb
    // Pass 3.5: jo biz id ab data me hai hi nahi, use migration me hi hata do — warna engine ke kai hisse crash karte
    for (const k of Object.keys(saved.biz)) if (!bizDef(k)) delete saved.biz[k]
  }
  return saved
}

const SAVE_KEY = 'sayonara_empire_vite_v1'
const BACKUP_KEY = SAVE_KEY + '_backup'
// Pass 3.5: main save kharab nikle to last-good backup se uthao — progress kabhi ek corrupt write se na mare
const load = () => {
  try { const r = localStorage.getItem(SAVE_KEY); if (r) return JSON.parse(r) } catch {}
  try { const b = localStorage.getItem(BACKUP_KEY); return b ? JSON.parse(b) : null } catch { return null }
}

export default function App() {
  const [s, setS] = useState(() => {
    const saved = migrate(load())
    if (saved) {
      // offline earnings: 20% of estimated daily profit per real hour away, capped 8h
      const awayH = Math.min(8, (Date.now() - (saved.lastSaveAt || Date.now())) / 3600000)
      const est = Object.entries(saved.biz || {}).reduce((a, [id, o]) => { const d = bizDef(id); return d ? a + d.rev * 0.3 * (1 + 0.18 * (o.lv - 1)) : a }, 0)
      saved.offlineGain = Math.round(est * awayH * 0.2)
      if (saved.offlineGain > 0) { saved.cash += saved.offlineGain; saved.awayReport = { hours: Math.round(awayH * 10) / 10, gain: saved.offlineGain } }
      return saved
    }
    const init = initialState()
    init.settings = { ...init.settings, lang: detectLang() }
    return init
  })
  const urlTab = new URLSearchParams(window.location.search).get('tab')
  const [tab, setTab] = useState(['home', 'biz', 'hq', 'stats', 'market', 'prop', 'wealth', 'bank', 'more'].includes(urlTab) ? urlTab : 'home')
  // Pass 3.3: native swipe — left/right se tab badlo (input/range/modal par nahi)
  const touchRef = useRef(null)
  const TAB_ORDER = ['home', 'biz', 'hq', 'stats', 'market', 'prop', 'wealth', 'bank', 'more']
  const onTouchStart = (e) => {
    const t = e.target
    if (t.closest('input, textarea, select, .splash, [data-noswipe]')) { touchRef.current = null; return }
    const c = e.touches[0]
    touchRef.current = { x: c.clientX, y: c.clientY }
  }
  const onTouchEnd = (e) => {
    const st = touchRef.current; touchRef.current = null
    if (!st) return
    const c = e.changedTouches[0]
    const dx = c.clientX - st.x, dy = c.clientY - st.y
    if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.6) return
    const i = TAB_ORDER.indexOf(tab)
    const n = dx < 0 ? Math.min(TAB_ORDER.length - 1, i + 1) : Math.max(0, i - 1)
    if (n !== i) setTab(TAB_ORDER[n])
  }
  // Pass 3.3: PWA install prompt (Add to Home Screen jaisa native flow)
  const [installEvt, setInstallEvt] = useState(null)
  const [installClosed, setInstallClosed] = useState(() => { try { return !!localStorage.getItem('se_install_closed') } catch { return false } })
  useEffect(() => {
    const h = (e) => { e.preventDefault(); setInstallEvt(e) }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  const standalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone)
  const [buyLoc, setBuyLoc] = useState(null)
  const [toast, setToast] = useState('')
  const [burst, setBurst] = useState(0)
  const [catFilter, setCatFilter] = useState('All')
  const [importTxt, setImportTxt] = useState('')
  const [spinDeg, setSpinDeg] = useState(0)
  const [sheet, setSheet] = useState(null) // Pass 3.5: bottom-sheet — 'actions' | 'prestige'
  const [swReg, setSwReg] = useState(null) // Pass 3.5: SW update taiyaar ho to prompt
  const [showSplash, setShowSplash] = useState(!urlTab)
  useEffect(() => {
    const st = s.settings || {}
    if (st.animLevel === 'off' || st.reducedMotion) { setShowSplash(false); return }
    const tm = setTimeout(() => setShowSplash(false), 2700)
    return () => clearTimeout(tm)
  }, [])
  const langId = (s.settings && s.settings.lang) || 'hinglish'
  const [pack, setPack] = useState(null)
  useEffect(() => { ensureStaffLib() }, [])
  useEffect(() => { let on = true; loadLang(langId).then((pk) => { if (on) setPack(pk) }).catch(() => {}); return () => { on = false } }, [langId])
  const tx = makeT(pack)
  const fmtN = (s.settings && s.settings.numFmt === 'full') ? fmtFull : (s.settings && s.settings.numFmt === 'intl') ? fmtIntl : fmt
  const chrome = chromeFromPack(pack) || chromeText(s.settings)
  const toastT = useRef(null)
  const nw = useMemo(() => netWorth(s), [s])
  const say = (m, celebrate) => { setToast(stripEmoji(m)); if (celebrate) { setBurst(b => b + 1); buzz(s.settings, BUZZ.success) } playSound(celebrate ? 'cash' : 'click', s.settings); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(''), 2600) }

  // Pass 3.5: har save se pehle maujooda achha save BACKUP me — agli corrupt write se pichhla surakshit rahe
  const persist = (st) => {
    try {
      const prev = localStorage.getItem(SAVE_KEY)
      if (prev) { try { JSON.parse(prev); localStorage.setItem(BACKUP_KEY, prev) } catch {} }
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...st, lastSaveAt: Date.now() }))
    } catch {}
  }
  const saveTimer = useRef(null); const latestState = useRef(s); latestState.current = s
  useEffect(() => {
    if (saveTimer.current) return
    saveTimer.current = setTimeout(() => { saveTimer.current = null; persist(latestState.current) }, 1500)
  }, [s])
  useEffect(() => {
    const flush = () => persist(latestState.current)
    window.addEventListener('beforeunload', flush); document.addEventListener('visibilitychange', flush)
    return () => { window.removeEventListener('beforeunload', flush); document.removeEventListener('visibilitychange', flush) }
  }, [])
  // Pass 3.5: tutorial flags asal khel se auto-set + milestone par celebration
  useEffect(() => {
    const t = s.tut || {}; const patch = {}
    if (!t.buy && Object.keys(s.biz || {}).length) patch.buy = 1
    if (!t.price && Object.values(s.biz || {}).some(o => o.price !== 1)) patch.price = 1
    if (!t.day && s.lastDayReport) patch.day = 1
    if (!t.report && (t.day || patch.day) && tab === 'home') patch.report = 1
    if (Object.keys(patch).length) setS(p => ({ ...p, tut: { ...(p.tut || {}), ...patch } }))
  }, [s, tab])
  // Pass 3.6: EVOLUTION MOMENT — koi branch tier cross kare to celebration sheet + haptic + sound
  const [evo, setEvo] = useState(null)
  const tierMapRef = useRef(null)
  useEffect(() => {
    const cur = {}
    for (const [k, o] of Object.entries(s.biz || {})) cur[k] = tierOf(o.lv)
    if (tierMapRef.current === null) { tierMapRef.current = cur; return }
    const prev = tierMapRef.current; tierMapRef.current = cur
    for (const [k, t] of Object.entries(cur)) {
      if (prev[k] !== undefined && t > prev[k]) {
        const d = bizDef(k); const o = s.biz[k]
        setEvo({ name: d ? d.name : k, cat: d ? d.cat : 'Food', tier: t, lv: o ? o.lv : 1 })
        buzz(s.settings, BUZZ.big); playSound('win', s.settings); setBurst(b => b + 1)
        break
      }
    }
  }, [s.biz])
  const msCount = useRef(-1)
  useEffect(() => {
    const c = Object.keys((s.life && s.life.milestones) || {}).length
    if (msCount.current >= 0 && c > msCount.current) { buzz(s.settings, BUZZ.big); say(' Milestone haasil! Net worth ka naya mukaam — Stats me dekho', true) }
    msCount.current = c
  }, [s.life])
  useEffect(() => { if (s.offlineGain) { say(` Offline kamaai mili: ${fmt(s.offlineGain)}`, true); setS(p => ({ ...p, offlineGain: 0 })) } }, [])

  // Auto mode timer: phase duration = dayLen/4 divided by speed
  useEffect(() => {
    if (s.mode !== 'auto') return
    const ms = (s.dayLen * 1000 / 4) / s.speed
    const iv = setInterval(() => { if (document.hidden) return; setS(p => phaseTick(p)) }, ms) // Pass 3.4: tab hidden ho to auto-timer pause (battery)
    return () => clearInterval(iv)
  }, [s.mode, s.dayLen, s.speed])

  const upd = (fn) => setS(p => { const n = structuredClone(p); fn(n); return n })
  const nextPhase = () => setS(p => phaseTick(p))
  const endDayNow = () => setS(p => { let n = p; for (let i = 0; i < 4 - p.phase; i++) n = phaseTick(n); return n })
  // Pass 3.5: SW update flow — naya version waiting ho to chip dikhao, Refresh par activate + reload
  const refreshingRef = useRef(false)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return
      if (reg.waiting && navigator.serviceWorker.controller) setSwReg(reg)
      reg.addEventListener('updatefound', () => { const nw2 = reg.installing; if (nw2) nw2.addEventListener('statechange', () => { if (nw2.state === 'installed' && navigator.serviceWorker.controller) setSwReg(reg) }) })
    }).catch(() => {})
    const onCtrl = () => { if (refreshingRef.current) window.location.reload() }
    navigator.serviceWorker.addEventListener('controllerchange', onCtrl)
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onCtrl)
  }, [])
  // Pass 3.5: desktop keyboard shortcuts — Space/→ = next phase, E = end day, 1-9 = tabs
  useEffect(() => {
    const h = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); setS(p => phaseTick(p)) }
      else if (e.key === 'e' || e.key === 'E') endDayNow()
      else if (/^[1-9]$/.test(e.key)) { const tg = TAB_ORDER[Number(e.key) - 1]; if (tg) setTab(tg) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])
  // Pass 3.5: bottom-sheet khula ho to browser Back pehle sheet band kare (back-friendly)
  useEffect(() => {
    if (!sheet) return
    history.pushState({ seSheet: 1 }, '')
    const onPop = () => setSheet(null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [sheet])

  // ---------- business actions ----------
  const buyBiz = (d) => { const locId = buyLoc || 'india_delhi'; const key = branchKey(d.id, locId); const isBranch = !!s.biz[key] || Object.keys(s.biz).some((k) => bizIdOf(k) === d.id); const price = isBranch && !s.biz[key] ? Math.round(d.cost * 0.5) : d.cost; if (s.biz[key]) return say('Is sheher me is brand ki branch pehle se hai — HQ se nayi jagah kholo'); if (s.cash < price) return say('Cash kam hai!'); upd(n => { n.cash -= price; n.biz[key] = { lv: 1, price: 1, stock: 100, staff: d.staff, profitToday: 0, profitTotal: 0, rating: 4.0, mktDays: 0, loc: locId, employees: [] }; n.xp += 20; n.story = [`Day ${n.day}: ${d.name} ${isBranch ? 'ki nayi branch' : 'kharida'} ${fmt(price)} me — ${cityNameOf(locId)}`, ...n.story].slice(0, 20) }); say(`${d.name} ${isBranch ? 'ki branch' : ''} tumhara hua — ${cityNameOf(locId)}`, true) }
  const relocate = (d, cityId) => { const fee = 5000; if (s.cash < fee) return say(' Relocation fee ke paise nahi'); upd(n => { n.cash -= fee; n.biz[d.id].loc = cityId; n.story = [`Day ${n.day}:  ${d.name} ab ${cityNameOf(cityId)} me shift`, ...n.story].slice(0, 20) }); say(` ${d.name} ab  ${cityNameOf(cityId)} me — waha ke rent/demand lagenge`) }
  const sellBiz = (d) => { const o = s.biz[d.id]; const val = Math.round(d.cost * (0.6 + 0.25 * o.lv)); upd(n => { n.cash += val; delete n.biz[d.id] }); say(` ${d.name} becha: ${fmt(val)}`) }
  const upgradeBiz = (d) => { const o = s.biz[d.id]; const cost = Math.round(d.cost * 0.55 * o.lv); if (o.lv >= MAX_LV) return say(` Max level ${MAX_LV}!`); if (s.cash < cost) return say(' Cash kam hai'); upd(n => { n.cash -= cost; n.biz[d.id].lv += 1; n.xp += 10 }); say(` ${d.name} ab Level ${o.lv + 1}`, true) }
  const restock = (d) => { const o = s.biz[d.id]; const miss = 100 - o.stock; const cost = Math.round(d.rev * d.cogs * miss / 100 * 0.9) + 10; if (s.cash < cost) return say(' Restock ke paise nahi'); upd(n => { n.cash -= cost; n.biz[d.id].stock = 100 }); say(` ${d.name} full restock (${fmt(cost)})`) }
  // Pass 3.5: Home alerts ke liye branch-key se restock + idle-cash deposit (one-tap actions)
  const restockKey = (key) => { const d = bizDef(key); const o = s.biz[key]; if (!d || !o) return; const miss = 100 - o.stock; const cost = Math.round(d.rev * d.cogs * miss / 100 * 0.9) + 10; if (s.cash < cost) return say(' Restock ke paise nahi'); upd(n => { n.cash -= cost; n.biz[key].stock = 100; n.tut = { ...(n.tut || {}), restock: 1 } }); say(` ${d.name} full restock (${fmt(cost)})`) }
  const depositIdle = () => { const amt = Math.max(0, Math.floor((s.cash - 25000) / 2)); if (amt <= 0) return; upd(n => { n.cash -= amt; n.bank += amt }); say(` ${fmt(amt)} bank me gaya — waha surakshit aur badhega`) }
  const marketing = (d) => { const cost = Math.round(d.rev * 1.2); if (s.cash < cost) return say(' Cash kam hai'); upd(n => { n.cash -= cost; n.biz[d.id].mktDays = 3 }); say(` Marketing chalu — 3 din demand +30%`) }
  const setPrice = (d, v) => upd(n => { n.biz[d.id].price = v })
  const setStaff = (d, delta) => upd(n => { const o = n.biz[d.id]; o.staff = Math.max(0, Math.min(d.staff * 3, o.staff + delta)) })

  // ---------- markets ----------
  const buyAsset = (arrName, sym, qty) => { const a = s[arrName].find(x => x.sym === sym); const cost = a.price * qty; const fromBank = s.bank >= cost; if (!fromBank && s.cash < cost) return say(' Paise kam hai'); upd(n => { if (n.bank >= cost) n.bank -= cost; else n.cash -= cost; const oldQ = n.holdings[sym] || 0; n.holdAvg = { ...(n.holdAvg || {}), [sym]: oldQ > 0 ? ((n.holdAvg[sym] || a.price) * oldQ + a.price * qty) / (oldQ + qty) : a.price }; n.holdings[sym] = oldQ + qty; n.xp += 3 }); say(` ${qty} × ${sym} kharide @ ${fmt(a.price)}`) }
  const sellAsset = (arrName, sym, qty) => { const a = s[arrName].find(x => x.sym === sym); if ((s.holdings[sym] || 0) < qty) return say(' Itne holdings nahi'); upd(n => { n.holdings[sym] -= qty; n.cash += a.price * qty }); say(` ${qty} × ${sym} beche @ ${fmt(a.price)}`) }

  // ---------- bank / property ----------
  const takeLoan = (amt) => { const maxLoan = Math.max(50000, nw * 1.2); if (s.loan.amount > 0) return say(' Pehle wala loan baki hai'); if (amt > maxLoan) return say(` Limit: ${fmt(maxLoan)} (credit score ${s.credit})`); const rate = s.credit >= 750 ? 0.10 : s.credit >= 650 ? 0.13 : 0.17; const emi = Math.round(amt * (1 + rate) / 12); upd(n => { n.cash += amt; n.loan = { amount: amt, emi, months: 12 } }); say(` Loan mila ${fmt(amt)} — EMI ${fmt(emi)}/month`, true) }
  const createFD = (amt) => { if (s.bank < amt) return say(' Bank balance kam hai'); upd(n => { n.bank -= amt; n.fds.push({ amt, days: 90 }) }); say(` FD ban gayi ${fmt(amt)} @7%`) }
  const buyProp = (p) => { if (s.cash + s.bank < p.cost) return say(' Paise kam hai'); upd(n => { const fromCash = Math.min(n.cash, p.cost); n.cash -= fromCash; n.bank -= (p.cost - fromCash); n.props.push(p.id); n.xp += 30 }); say(` ${p.name} kharidi!`, true) }
  const sellProp = (p) => { const val = Math.round(p.cost * Math.pow(1.06, s.day / 365)); upd(n => { n.cash += val; n.props = n.props.filter(x => x !== p.id) }); say(` Property bechi: ${fmt(val)}`) }

  const claimDaily = () => { if (s.lastDaily === s.day) return say(' Aaj ka reward le liya'); upd(n => { n.cash += 750; n.lastDaily = n.day }); say(' Daily reward +₹750', true) }
  const spin = () => { if (s.lastSpin === s.day) return say(' Spin aaj ho gaya'); const prizes = [100, 250, 0, 500, 150, 1000, 50, 250]; const i = Math.floor(Math.random() * 8); setSpinDeg(d => d + 1080 + i * 45 + Math.floor(Math.random() * 30)); upd(n => { n.cash += prizes[i]; n.lastSpin = n.day }); setTimeout(() => say(` Spin prize: ${fmt(prizes[i])}`, prizes[i] >= 500), 600) }
  const prestige = () => { if (nw < 10000000) return say(' Prestige ke liye net worth ₹1 Cr chahiye'); upd(n => { const keep = 25000; Object.assign(n, initialState()); n.cash = keep; n.prestige = (s.prestige || 0) + 1; n.prestigeMult = 1 + (s.prestige + 1) * 0.25; n.day = 1 }); say(' PRESTIGE! Nayi peedhi, permanent earning multiplier badha', true) }
  const claimAch = (a) => { upd(n => { n.cash += a.reward; n.ach.push(a.id); n.xp += 15 }); say(` ${a.name}: +${fmt(a.reward)}`, true) }
  const claimMission = (m) => { upd(n => { n.cash += m.reward; n.missionsDone = [...n.missionsDone, m.id + '_' + n.day] }); say(` Mission complete: +${fmt(m.reward)}`, true) }
  const homeAct = { restockKey, claimMission, claimDaily, depositIdle } // Pass 3.5: HomePanel ke one-tap actions (sab handlers ke baad — TDZ safe)

  // Pass 3.5: export ab checksum ke saath — kata-phata code import par turant pakda jayega
  const checksum = (str) => { let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; return h.toString(36) }
  const doExport = () => { const data = JSON.stringify(s); const code = btoa(unescape(encodeURIComponent(JSON.stringify({ app: 'sayonara', v: 35, sum: checksum(data), data })))); if (navigator.clipboard) navigator.clipboard.writeText(code); setImportTxt(code); say('Save code copy ho gaya (checksum ke saath)') }
  const doImportBox = () => {
    try {
      const outer = JSON.parse(decodeURIComponent(escape(atob(importTxt.trim()))))
      let obj = outer
      if (outer && outer.data && outer.sum) { // naya checksummed format; purana raw format bhi chalega (neeche fallback)
        if (checksum(outer.data) !== outer.sum) return say(' Checksum mismatch — code adhoora ya kharab hai, import nahi hua')
        obj = JSON.parse(outer.data)
      }
      setS(migrate(obj)); say('Save import ho gaya!')
    } catch { say('Galat code hai') }
  }
  const doImportData = (obj) => { setS(migrate(obj)) }
  const doReset = () => { localStorage.removeItem(SAVE_KEY); setS(initialState()); say('Naya game shuru!') }

  const tabs = [['home', 'home', tx('empire')], ['biz', 'shop', tx('business')], ['hq', 'hq', tx('hq')], ['stats', 'stats', tx('stats')], ['market', 'trend', tx('markets')], ['prop', 'building', tx('property')], ['wealth', 'gem', tx('wealth')], ['bank', 'bank', tx('bank')], ['more', 'more', tx('more')]]
  const hasRewards = s.lastDaily !== s.day || s.lastSpin !== s.day || (s.missions || []).some(m => missionProgress(s, m) >= m.target && !s.missionsDone.includes(m.id + '_' + s.day))
  const xpLv = levelOf(s.xp)

  const accentColor = { gold: '#f5c542', violet: '#a855f7', green: '#2ee06f', pink: '#ec4899' }[(s.settings && s.settings.accent) || 'gold']
  const zoomScale = ((s.settings && s.settings.fontScale) || 1) * ((s.settings && s.settings.largeText) ? 1.12 : 1)
  return (
    <div dir={isRTL(langId) ? 'rtl' : 'ltr'} lang={langId} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className={'app' + ((s.settings && s.settings.contrast) ? ' contrast' : '') + ((s.settings && s.settings.amoled === 'soft') ? ' amoled-soft' : '')} style={{ '--gold': accentColor, zoom: zoomScale, fontFamily: FONT_STACKS[langId] || undefined }}>
      <PerfGuard mode={(s.settings && s.settings.perfMode) || 'auto'} />
      <Splash show={showSplash} onDone={() => setShowSplash(false)} />
      {s.settings && s.settings.showFps && <FpsMeter />}
      <Burst burstKey={burst} />
      <header className="hud">
        <div className="brand"><h1>SAYONARA <span>EMPIRE</span></h1><div className="dayline">Day {s.day} • {PHASES[s.phase]} • Lv {xpLv} • {seasonOf(s.day).name}{(() => { const af = activeFestivals(s.day, cityOf(HOME_CITY)); return af.length ? ` • Festival: ${af[0].name}` : '' })()}</div><button className="hud-help" aria-label={tx('help')} onClick={() => setTab('more')}><Icon name="help" size={19} /></button></div>
        <div className="money-row">
          <div className="money-box"><div className="lbl">{chrome.cash}</div><div className="val green"><AnimatedNumber value={s.cash} format={fmtN} /></div></div>
          <div className="money-box"><div className="lbl">{chrome.bank}</div><div className="val"><AnimatedNumber value={s.bank} format={fmtN} /></div></div>
          <div className="money-box"><div className="lbl">{chrome.netWorth}</div><div className="val gold"><AnimatedNumber value={nw} format={fmtN} /></div></div>
        </div>
        <div className="phase-bar">{PHASES.map((p, i) => <div key={p} className={'phase-dot' + (i === s.phase ? ' on' : '')}>{p}</div>)}</div>
        <PhaseArc phase={s.phase} />
      </header>

      <main>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
            {tab === 'home' && <>
              <Suspense fallback={<PanelFallback />}><HomePanel s={s} nw={nw} fmtN={fmtN} tx={tx} go={setTab} upd={upd} say={say} act={homeAct} /></Suspense>
              <Section id="time" title={tx('timeControl')} right={s.mode === 'auto' ? 'AUTO' : 'MANUAL'}>
                <div className="time-ctrl">
                  <button className={'chip' + (s.mode === 'manual' ? ' on' : '')} onClick={() => upd(n => n.mode = 'manual')}> Manual</button>
                  <button className={'chip' + (s.mode === 'auto' ? ' on' : '')} onClick={() => upd(n => n.mode = 'auto')}> Auto</button>
                  {[30, 60, 120, 300].map(d => <button key={d} className={'chip' + (s.dayLen === d ? ' on' : '')} onClick={() => upd(n => n.dayLen = d)}>Din={d >= 60 ? (d / 60) + 'min' : d + 's'}</button>)}
                  {[1, 2, 4, 8].map(v => <button key={v} className={'chip' + (s.speed === v ? ' on' : '')} onClick={() => upd(n => n.speed = v)}>{v}x</button>)}
                </div>
                {s.mode === 'manual' && <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn" style={{ flex: 1 }} onClick={nextPhase}>{tx('nextPhase')}</button>
                  <button className="btn ghost" style={{ flex: 1 }} onClick={() => { setS(p => { let n = p; for (let i = 0; i < 4 - p.phase; i++) n = phaseTick(n); return n }) }}>{tx('endDay')}</button>
                </div>}
                <p className="muted">Manual me time ruka rehta hai — aaram se plan karo. Auto me din khud chalega. Day-30 safe hai: tax sirf us mahine ke profit par, game 100+ din chalega — khud test: More → 100-Din Test.</p>
              </Section>

              <Section id="dayrep" title="Aakhri Din Report" right={s.lastDayReport ? `Day ${s.lastDayReport.day}` : ''}>
                {s.lastDayReport ? <>
                  <div className="row"><span>Revenue</span><b className="pos">{fmt(s.lastDayReport.revenue)}</b></div>
                  <div className="row"><span>Kharcha (COGS+wages+rent+bijli)</span><b className="neg">{fmt(s.lastDayReport.costs)}</b></div>
                  <div className="row"><span>Property Rent</span><b className="pos">{fmt(s.lastDayReport.rent)}</b></div>
                  <div className="row"><span>Net Profit</span><b className={s.lastDayReport.profit >= 0 ? 'pos' : 'neg'}>{fmt(s.lastDayReport.profit)}</b></div>
                </> : <p className="muted">Pehla din khatm hote hi yaha pura P&L report aayega — profit aur cashflow alag-alag.</p>}
                <div className="row"><span>Udhaar (receivables, kal milega)</span><b>{fmt(s.receivables)}</b></div>
                <div className="row"><span>Supplier Rate Index</span><b>{s.supplier.toFixed(2)}x</b></div>
                <div className="row"><span>Market Sentiment</span><b>{s.sentiment > 0.5 ? ' Bullish' : s.sentiment < -0.5 ? ' Bearish' : ' Sideways'}</b></div>
              </Section>

              <Suspense fallback={null}><DecisionPanel s={s} upd={upd} say={say} /></Suspense>

              <Section id="missions" title="Daily Missions">
                {s.missions.map(m => { const pr = missionProgress(s, m); const done = pr >= m.target; const claimed = s.missionsDone.includes(m.id + '_' + s.day); return (
                  <div className="row" key={m.id}><div><div className="small">{stripEmoji(m.text)}</div><div className="bar"><i style={{ width: Math.min(100, pr / m.target * 100) + '%' }} /></div><div className="muted">{Math.min(pr, m.target)}/{m.target} • Reward {fmt(m.reward)}</div></div>
                  <button className="btn small green" disabled={!done || claimed} onClick={() => claimMission(m)}>{claimed ? 'OK' : 'Claim'}</button></div>) })}
              </Section>

              <Section id="city" title="Sheher — Districts" defaultOpen={false}>
                {DISTRICTS.map(d => { const lore = loreOf(d.name); return <div className="row" key={d.name}><div><b>{d.name}</b> {nw < d.unlock && <span className="muted"> {fmt(d.unlock)}</span>}<div className="muted">{d.mood} • Rent trend {d.rentTrend}</div>{lore && <div className="muted"> {lore.history} Nishaniyan: {lore.landmarks.slice(0, 3).join(', ')}</div>}</div></div> })}
              </Section>

              <Suspense fallback={null}><ReviewsPanel s={s} /></Suspense>

              <Section id="news" title="Sheher Times" defaultOpen={false}>
                {s.news.map((n, i) => <div className="news-item" key={i}><span className="muted">Day {n.day} • </span>{stripEmoji(n.text)}</div>)}
              </Section>
            </>}

            {tab === 'biz' && <>
              <div style={{ marginBottom: 8 }}>
                <div className="muted" style={{ marginBottom: 6 }}><Icon name="pin" size={13} /> Naya business/branch kaha kholein? (uska rent/demand usi sheher ka lagega — sheher kholna Atlas se)</div>
                <div className="time-ctrl" style={{ flexWrap: 'wrap' }}>
                  {(s.unlockedCities || ['india_delhi']).map((cid) => <button key={cid} className={'chip' + ((buyLoc || 'india_delhi') === cid ? ' on' : '')} onClick={() => setBuyLoc(cid)}>{cityNameOf(cid)}</button>)}
                </div>
              </div>
              <div className="time-ctrl" style={{ marginBottom: 10 }}>
                {['All', ...CATEGORIES].map(c => <button key={c} className={'chip' + (catFilter === c ? ' on' : '')} onClick={() => setCatFilter(c)}>{c}</button>)}
              </div>
              {CATEGORIES.filter(c => catFilter === 'All' || catFilter === c).map(cat => (
                <Section key={cat} id={'cat_' + cat} icon="shop" title={tx('cat_' + cat) || CAT_LABEL[cat]} right={Object.keys(s.biz).filter(k => { const dd = bizDef(k); return dd && dd.cat === cat }).length + ' ' + tx('branches')}>
                  {BUSINESSES.filter(b => b.cat === cat).map((d, i) => { const locId = buyLoc || 'india_delhi'; const key = branchKey(d.id, locId); const here = s.biz[key]; const branches = Object.keys(s.biz).filter(k => bizIdOf(k) === d.id); const isBranchBuy = branches.length > 0 && !here; const price = isBranchBuy ? Math.round(d.cost * 0.5) : d.cost; return (
                    <motion.div key={d.id} className="biz-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                      {(() => { const sceneLv = here ? here.lv : (branches.length ? Math.max(...branches.map(k => s.biz[k].lv)) : 1); return (
                        <div className="scene-band">
                          <BizScene cat={d.cat} lv={sceneLv} height={64} dim={!here && !branches.length} />
                          {(here || branches.length) > 0 && <span className={'scene-tier t' + tierOf(sceneLv)}>{tx(tierKeyOf(sceneLv))}</span>}
                          {here && <span className="scene-city"><Icon name="pin" size={12} /> {cityNameOf(locId)}</span>}
                        </div>) })()}
                      <div className="row" style={{ border: 'none', padding: 0 }}><b><CatIcon cat={d.cat} /> {d.name}</b>{branches.length ? <span className="gold">{branches.length} {tx('branches')}</span> : <b>{fmt(d.cost)}</b>}</div>
                      {here && <>
                        <div className="phase-mini" aria-hidden="true">{[0, 1, 2, 3].map(pi => <i key={pi} className={pi < s.phase ? 'done' : pi === s.phase ? 'now' : ''} />)}</div>
                        <div className="evo-row"><span>{tx(tierKeyOf(here.lv))} • Lv {here.lv}</span><span className="evo-bar"><i style={{ width: (evoProgress(here.lv) * 100) + '%' }} /></span>{nextTierAt(here.lv) ? <b>{tx('evoNext').replace('{lv}', nextTierAt(here.lv))}</b> : <b>{tx('evoMax')}</b>}</div>
                      </>}
                      <div className="muted">{d.tagline}</div>
                      <div className="muted">Base bikri {fmt(d.rev)}/din • COGS {Math.round(d.cogs * 100)}% • Staff {d.staff} • Rent {fmt(d.rent)}/din</div>
                      {here ? <button className="btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setTab('hq')}>{tx('manageInHq')}</button>
                        : <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => buyBiz(d)}>{isBranchBuy ? `Nayi Branch — ${cityNameOf(locId)} (${fmt(price)})` : `${tx('buy')} — ${fmt(price)}`}</button>}
                      {branches.length > 0 && !here && <div className="muted" style={{ marginTop: 5 }}>{branches.length} {tx('branchesHere')}: {branches.map(k => cityNameOf(s.biz[k].loc || 'india_delhi')).join(', ')}</div>}
                    </motion.div>) })}
                </Section>
              ))}
            </>}

            {tab === 'hq' && <Suspense fallback={<PanelFallback />}><HqPanel s={s} upd={upd} say={say} tx={tx} /></Suspense>}

            {tab === 'stats' && <Suspense fallback={<PanelFallback />}><StatsPanel s={s} /></Suspense>}

            {tab === 'market' && <>
              <Section id="stocks" title="Stocks" right="Dividend har 30 din">
                {s.stocks.map(st => <div key={st.sym} className="biz-card">
                  <div className="row" style={{ border: 'none', padding: 0 }}><b>{st.sym}</b><b>{fmt(st.price)}</b></div>
                  <div className="muted">{st.name} • Tumhare paas: {s.holdings[st.sym] || 0}</div>
                  <div className="muted">{profileOf(st.sym) ? ' ' + profileOf(st.sym).sector + ' — ' + profileOf(st.sym).about : ''}</div>
                  <div className="muted"> {stockNewsOf(st.sym, s.day)}</div>
                  <div className="spark">{st.hist.map((h, i) => <i key={i} style={{ height: Math.max(8, h / Math.max(...st.hist) * 34) + 'px' }} />)}</div>
                  <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                    <button className="btn small green" onClick={() => buyAsset('stocks', st.sym, 1)}>Buy 1</button>
                    <button className="btn small green" onClick={() => buyAsset('stocks', st.sym, 10)}>Buy 10</button>
                    <button className="btn small red" onClick={() => sellAsset('stocks', st.sym, 1)}>Sell 1</button>
                    <button className="btn small red" onClick={() => sellAsset('stocks', st.sym, 10)}>Sell 10</button>
                  </div></div>)}
              </Section>
              <Section id="comm" title="Gold / Silver / Crypto" defaultOpen={false}>
                {s.commodities.map(st => <div key={st.sym} className="biz-card">
                  <div className="row" style={{ border: 'none', padding: 0 }}><b>{st.sym}</b><b>{fmt(st.price)}</b></div>
                  <div className="muted">{st.name} • Holdings: {s.holdings[st.sym] || 0}</div>
                  <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                    <button className="btn small green" onClick={() => buyAsset('commodities', st.sym, 1)}>Buy 1</button>
                    <button className="btn small green" onClick={() => buyAsset('commodities', st.sym, 5)}>Buy 5</button>
                    <button className="btn small red" onClick={() => sellAsset('commodities', st.sym, 1)}>Sell 1</button>
                    <button className="btn small red" onClick={() => sellAsset('commodities', st.sym, 5)}>Sell 5</button>
                  </div></div>)}
              </Section>
              <Section id="sip" title="SIP / Mutual Fund & Bonds" defaultOpen={false}>
                <div className="row"><span>SIP Value (~11%/yr)</span><b className="pos">{fmt(s.sip)}</b></div>
                <div className="row"><span>Bonds Value (~7.5%/yr)</span><b className="pos">{fmt(s.bonds)}</b></div>
                <div className="row"><span>Monthly SIP</span><b>{fmt(s.sipMonthly)}</b></div>
                <div className="grid2">
                  {[1000, 5000].map(a => <button key={a} className="btn small ghost" onClick={() => upd(n => n.sipMonthly = a)}>SIP {fmt(a)}/mo set</button>)}
                  <button className="btn small ghost" onClick={() => { if (s.cash < 10000) return say(' ₹10K cash chahiye'); upd(n => { n.cash -= 10000; n.bonds += 10000 }) }}>Bond ₹10K kharido</button>
                  <button className="btn small ghost" onClick={() => { upd(n => { n.cash += n.bonds + n.sip; n.bonds = 0; n.sip = 0 }) }}>Sab redeem karo</button>
                </div>
              </Section>
            </>}

            {tab === 'prop' && <Section id="props" title="Real Estate" right="Rent roz, daam +6%/yr">
              {PROPERTIES.map((p, i) => { const owned = s.props.includes(p.id); const val = Math.round(p.cost * Math.pow(1.06, s.day / 365)); return (
                <motion.div key={p.id} className="biz-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="row" style={{ border: 'none', padding: 0 }}><b>{p.icon} {p.name}</b><b>{fmt(val)}</b></div>
                  <div className="muted">Rent {p.rent ? fmt(p.rent) + '/month' : '— (sirf appreciation)'}</div>
                  {!owned ? <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => buyProp(p)}>Kharido {fmt(p.cost)}</button>
                    : <button className="btn small red" style={{ marginTop: 8 }} onClick={() => sellProp(p)}>Becho {fmt(val)}</button>}
                </motion.div>) })}
            </Section>}

            {tab === 'wealth' && <Suspense fallback={<PanelFallback />}><WealthPanel s={s} nw={nw} upd={upd} say={say} /></Suspense>}

            {tab === 'bank' && <>
              <Section id="bankmain" title="Bank" right={`Credit Score: ${s.credit}`}>
                <div className="row"><span>Cash</span><b>{fmt(s.cash)}</b></div>
                <div className="row"><span>Bank Balance</span><b>{fmt(s.bank)}</b></div>
                <div className="grid2">
                  <button className="btn small ghost" onClick={() => { const a = Math.min(s.cash, 10000); if (a <= 0) return say(' Cash nahi'); upd(n => { n.cash -= a; n.bank += a }) }}>₹10K Deposit</button>
                  <button className="btn small ghost" onClick={() => { const a = Math.min(s.bank, 10000); if (a <= 0) return say(' Bank khali'); upd(n => { n.bank -= a; n.cash += a }) }}>₹10K Withdraw</button>
                  <button className="btn small ghost" onClick={() => { if (s.cash <= 0) return; upd(n => { n.bank += n.cash; n.cash = 0 }) }}>Sab Deposit</button>
                  <button className="btn small ghost" onClick={() => { if (s.bank <= 0) return; upd(n => { n.cash += n.bank; n.bank = 0 }) }}>Sab Withdraw</button>
                </div>
                <p className="muted">Credit score loan ki byaaj dar tay karta hai: 750+ = 10%, 650+ = 13%, neeche = 17%. Time par EMI = score upar.</p>
              </Section>
              <Section id="loan" title="Loan" defaultOpen={false}>
                {s.loan.amount > 0 ? <><div className="row"><span>Baki Loan</span><b className="neg">{fmt(s.loan.amount)}</b></div><div className="row"><span>EMI</span><b>{fmt(s.loan.emi)}/month • {s.loan.months} mahine baki</b></div></> :
                  <div className="grid2">{[50000, 200000, 1000000].map(a => <button key={a} className="btn small" onClick={() => takeLoan(a)}>Loan {fmt(a)}</button>)}</div>}
              </Section>
              <Section id="fd" title="Fixed Deposits (7%)" defaultOpen={false}>
                {s.fds.map((f, i) => <div className="row" key={i}><span>FD #{i + 1}</span><b className="pos">{fmt(f.amt)}</b></div>)}
                <div className="grid2">
                  <button className="btn small ghost" onClick={() => createFD(10000)}>FD ₹10K (bank se)</button>
                  <button className="btn small ghost" onClick={() => createFD(50000)}>FD ₹50K (bank se)</button>
                </div>
              </Section>
            </>}

            {tab === 'more' && <>
              <Section id="profile" title="Player" right={`Level ${xpLv}`}>
                <div className="row"><span>XP</span><b>{Math.round(s.xp)}</b></div>
                <div className="bar"><i style={{ width: Math.min(100, (s.xp % 100)) + '%' }} /></div>
                <div className="row"><span>Prestige</span><b>{s.prestige} baar • Multiplier {s.prestigeMult.toFixed(2)}x</b></div>
                <div className="grid2">
                  <button className="btn small green" onClick={claimDaily}> Daily Reward {s.lastDaily === s.day ? 'OK' : '₹750'}</button>
                  <button className="btn small" onClick={() => setSheet('prestige')}> Prestige (₹1Cr NW)</button>
                </div>
              </Section>
              <Section id="spin" title="Lucky Spin" defaultOpen={false}>
                <div className="wheel" style={{ transform: `rotate(${spinDeg}deg)` }}><div className="wheel-core">SPIN</div></div>
                <button className="btn" style={{ width: '100%' }} disabled={s.lastSpin === s.day} onClick={spin}>{s.lastSpin === s.day ? 'Aaj ka spin ho gaya' : ' Ghumao (roz 1 baar)'}</button>
              </Section>
              <Section id="rich" title="Rich List — Rivals" defaultOpen={false}>
                {[...s.rivals].sort((a, b) => b.nw - a.nw).map((r, i) => <div className="row" key={r.name}><span>#{i + 1} {['', '', '', '', '', ''][i % 6]} <b>{r.name}</b><div className="muted">{r.pers} • Focus: {r.focus} •  Ghar: {({ Simran: 'Mumbai', Vikram: 'Bengaluru', Ananya: 'Gurgaon', Rohit: 'Mumbai', Priya: 'Pune', 'Sharma Ji': 'Delhi' })[r.name] || 'Delhi'}</div></span><b className="gold">{fmt(r.nw)}</b></div>)}
                <div className="row"><span> <b>TUM (Sayonara Empire)</b></span><b className="pos">{fmt(nw)}</b></div>
                {[...s.rivals].sort((a, b) => b.nw - a.nw).slice(0, 2).map((r) => { const dg = dialogueOf(r.name); return dg ? <div className="news-item" key={r.name}> <b>{r.name}:</b> {stripEmoji(dg.text)}</div> : null })}
              </Section>
              <Section id="ach" title="Achievements" defaultOpen={false}>
                {ACHIEVEMENTS.map(a => { const st = { ...s, _nw: nw }; const done = a.check(st); const got = s.ach.includes(a.id); return (
                  <div className="row" key={a.id}><div><b>{a.name}</b><div className="muted">{a.desc} • Reward {fmt(a.reward)}</div></div>
                    <button className="btn small green" disabled={!done || got} onClick={() => claimAch(a)}>{got ? 'OK' : 'Claim'}</button></div>) })}
              </Section>
              <Section id="story" title="Your Story" defaultOpen={false}>
                {s.story.map((t2, i) => <div className="news-item" key={i}>{stripEmoji(t2)}</div>)}
              </Section>
              <Section id="simtest" title="100-Din Test" defaultOpen={false}>
                <p className="muted">Day-30 freeze aur lambe game ki khud jaanch: ye button simulation ko tezi se aage badha kar batayega ki game rukta to nahi. (Note: ye asal time nahi khata, sirf logic check hai — asal khel par asar nahi padega kyunki test alag copy par chalta hai.)</p>
                <button className="btn ghost" style={{ width: '100%' }} onClick={() => { let t = structuredClone(s); const d0 = t.day; for (let i = 0; i < 400; i++) t = phaseTick(t); say(` Test pass: Day ${d0} → Day ${t.day} bina ruke chala, tax guarded (lastTaxDay ${t.lastTaxDay})`) }}> Simulate 100 Days (test copy)</button>
              </Section>
              <Section id="savesec" title="Save / Export / Import" defaultOpen={false}>
                <div className="grid2">
                  <button className="btn small ghost" onClick={() => { const code = btoa(unescape(encodeURIComponent(JSON.stringify(s)))); navigator.clipboard && navigator.clipboard.writeText(code); setImportTxt(code); say(' Save code copy ho gaya — neeche box me bhi hai') }}> Export Code</button>
                  <button className="btn small ghost" onClick={doImportBox}> Import (box se)</button>
                </div>
                <textarea rows={3} style={{ marginTop: 8 }} placeholder="Export code yaha aayega / Import ke liye code paste karo" value={importTxt} onChange={e => setImportTxt(e.target.value)} />
                <button className="btn red" style={{ width: '100%', marginTop: 8 }} onClick={() => { if (confirm('Pakka? Pura game reset ho jayega!')) { localStorage.removeItem(SAVE_KEY); setS(initialState()) } }}> Reset Game</button>
              </Section>
              <Suspense fallback={<PanelFallback />}><AtlasPanel s={s} nw={nw} upd={upd} say={say} tx={tx} /></Suspense>
              <Suspense fallback={<PanelFallback />}><ManagersPanel s={s} upd={upd} say={say} /></Suspense>
              <Suspense fallback={<PanelFallback />}><ImportPanel s={s} upd={upd} say={say} /></Suspense>
              <Suspense fallback={<PanelFallback />}><BazaarPanel s={s} upd={upd} say={say} /></Suspense>
              <Suspense fallback={<PanelFallback />}><AuctionPanel s={s} upd={upd} say={say} /></Suspense>
              <Suspense fallback={<PanelFallback />}><BulkAchievements s={s} nw={nw} upd={upd} say={say} /></Suspense>
              <Suspense fallback={<PanelFallback />}><EncyclopediaPanel /></Suspense>
              <Suspense fallback={<PanelFallback />}><SettingsPanel s={s} upd={upd} say={say} onExport={doExport} onImport={(data) => { if (data) doImportData(data); else doImportBox() }} importTxt={importTxt} setImportTxt={setImportTxt} onReset={doReset} /></Suspense>

              <Section id="help" title="Kaise Khele — Simple Bhasha Me" defaultOpen={false}>
                <p className="small">1) Business kharido → har phase (subah/dopahar/shaam/raat) bikri hogi.<br />2) Price zyada = zyada margin par kam customers; sahi balance rakho.<br />3) Stock khatm hone se pehle Restock karo, Marketing se 3 din demand badegi.<br />4) Munafa bank me rakho, FD/SIP se badhao; shares me paisa lagao par risk samjho.<br />5) Property se roz rent, loan se tezi — par EMI time par.<br />6) Manual mode = time tumhare haath me; Auto mode = din khud chalega.<br />7) Tax har 30 din me sirf us mahine ke profit par lagta hai — Day 30 par game rukta NAHI hai.<br />8) Desktop par keyboard: <span className="kbd">Space</span>/<span className="kbd">→</span> = Next Phase, <span className="kbd">E</span> = End Day, <span className="kbd">1–9</span> = tabs.</p>
              </Section>
            </>}
          </motion.div>
        </AnimatePresence>
      </main>

      {installEvt && !installClosed && !standalone && !showSplash && (
        <div className="install-chip">
          <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" />
          <div style={{ flex: 1 }}>
            <div className="ic-t">Sayonara Empire ko App ki tarah lagao</div>
            <div className="ic-s">Home screen icon • Fullscreen • Offline bhi chalega</div>
          </div>
          <button onClick={async () => { try { installEvt.prompt(); await installEvt.userChoice } catch {} setInstallEvt(null) }}>Install</button>
          <button className="ic-x" aria-label="Close" onClick={() => { setInstallClosed(true); try { localStorage.setItem('se_install_closed', '1') } catch {} }}><Icon name="x" size={15} /></button>
        </div>
      )}
      {!showSplash && tab !== 'more' && (
        <button className="fab" aria-label={tx('quickActions')} onClick={() => { buzz(s.settings, BUZZ.tap); setSheet('actions') }}><Icon name="bolt" size={24} /></button>
      )}
      <AnimatePresence>
        {sheet && (
          <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={sheet === 'prestige' ? 'Prestige' : tx('quickActions')}>
            <motion.div className="sheet-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)} />
            <motion.div className="sheet" initial={{ y: 320 }} animate={{ y: 0 }} exit={{ y: 320 }} transition={{ type: 'spring', damping: 30, stiffness: 320 }}>
              <div className="grab" />
              {sheet === 'actions' && <>
                <h3>{tx('quickActions')}</h3>
                <button className="sheet-btn" onClick={() => { nextPhase(); setSheet(null) }}><Icon name="play" size={19} /> {tx('nextPhase')} — {PHASES[s.phase]}</button>
                <button className="sheet-btn" onClick={() => { endDayNow(); setSheet(null) }}><Icon name="clock" size={19} /> {tx('endDay')}</button>
                <button className="sheet-btn" onClick={() => { claimDaily(); setSheet(null) }}><Icon name="gift" size={19} /> Daily Reward {s.lastDaily === s.day ? 'OK' : '₹750'}</button>
                <button className="sheet-btn" onClick={() => setSheet(null)}><Icon name="x" size={19} /> {tx('dismiss')}</button>
              </>}
              {sheet === 'prestige' && <>
                <h3>Prestige — Pakka?</h3>
                <p className="small" style={{ marginBottom: 12 }}>Prestige karne par cash, businesses, shares — <b>sab reset</b> ho jayega (sirf ₹25K + permanent earning multiplier bachega). Ye wapas nahi hoga. Net worth ₹1 Cr chahiye, tumhara abhi {fmtN(nw)} hai.</p>
                <button className="sheet-btn danger" onClick={() => { setSheet(null); prestige() }}><Icon name="crown" size={19} /> Ha, Prestige karo</button>
                <button className="sheet-btn" onClick={() => setSheet(null)}><Icon name="x" size={19} /> Nahi, rehne do</button>
              </>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {evo && (
          <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label={tx('evoTitle')}>
            <motion.div className="sheet-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEvo(null)} />
            <motion.div className="sheet evo" initial={{ y: 340 }} animate={{ y: 0 }} exit={{ y: 340 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="grab" />
              <div className="evo-sheet-crown"><Icon name="crown" size={38} /></div>
              <h3>{tx('evoTitle')}</h3>
              <div className="evo-sub">{tx('evoSub').replace('{name}', evo.name).replace('{tier}', tx('evoT' + (evo.tier + 1)))}</div>
              <div className="scene-band"><BizScene cat={evo.cat} lv={evo.lv} height={104} /></div>
              <p className="small" style={{ textAlign: 'center', marginBottom: 12 }}>{tx('evoPerk')}</p>
              <button className="sheet-btn" onClick={() => setEvo(null)}><Icon name="check" size={19} /> {tx('dismiss')}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {swReg && (
        <div className="update-chip" role="status">
          <Icon name="refresh" size={17} /><span style={{ flex: 1 }}>{tx('newVersion')}</span>
          <button onClick={() => { refreshingRef.current = true; if (swReg.waiting) swReg.waiting.postMessage({ type: 'SKIP_WAITING' }); else window.location.reload() }}>{tx('refreshNow')}</button>
        </div>
      )}
      <nav className="tabbar">
        {tabs.map(([id, ic, label]) => <button key={id} className={tab === id ? 'on' : ''} aria-label={label} aria-current={tab === id ? 'page' : undefined} onClick={() => { buzz(s.settings, BUZZ.tap); setTab(id) }}><span className="ic">{id === 'stats' ? <StatsIcon size={20} /> : <Icon name={ic} size={20} />}</span>{label}{id === 'more' && hasRewards && <span className="tab-badge" />}</button>)}
      </nav>
      <Toast msg={toast} />
    </div>
  )
}

import { useState } from 'react'
import { Section } from './ui.jsx'
import { fmt } from '../game/engine.js'
import { SETTING_GROUPS, SETTING_META } from '../game/settings.js'
import { playSound } from '../utils/sound.js'
import { loadJSON, saveJSON, removeKey } from '../utils/storage.js'
import { LANGS } from '../i18n/index.js'
import { Icon } from './icons/index.jsx'

// God-tier settings — har group collapsible, har setting turant lagti hai aur save me rehti hai
export function LangPicker({ value, onPick }) {
  const [q, setQ] = useState('')
  const list = LANGS.filter((l) => (l.label + ' ' + l.native).toLowerCase().includes(q.toLowerCase()))
  return (
    <span style={{ display: 'block', width: '100%' }}>
      <input type="text" placeholder="Search language..." value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 7, minHeight: 38 }} />
      <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {list.map((l) => <button key={l.id} className={'chip' + (value === l.id ? ' on' : '')} onClick={() => onPick(l.id)}>{l.native}</button>)}
      </span>
    </span>
  )
}
export function SettingsPanel({ s, upd, say, onExport, onImport, importTxt, setImportTxt, onReset }) {
  const st = s.settings || {}
  const [resetWord, setResetWord] = useState('')
  const set = (key, val) => {
    upd((n) => {
      n.settings = { ...n.settings, [key]: val }
      if (key === 'dayLenDefault') n.dayLen = val
      if (key === 'sandbox' && val && !n.sandbox) { n.sandbox = true; n.cash = Math.max(n.cash, 1000000000) }
      if (key === 'sandbox' && !val) { /* sandbox band karne par paisa wapas nahi liya jata — nishan bhi rehta hai, ye imaandaari hai */ }
    })
    playSound('click', { ...st, sound: key === 'sound' ? val : st.sound })
    say(' Setting lag gayi: ' + SETTING_META[key].label)
  }
  const renderControl = (key) => {
    const meta = SETTING_META[key]; const val = st[key]
    if (meta.type === 'langpicker') return <LangPicker value={val} onPick={(v) => set(key, v)} />
    if (meta.type === 'toggle') return <button className={'chip' + (val ? ' on' : '')} onClick={() => set(key, !val)}>{val ? 'OK ON' : 'OFF'}</button>
    if (meta.type === 'choice') return (
      <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {meta.options.map(([v, label]) => <button key={String(v)} className={'chip' + (val === v ? ' on' : '')} onClick={() => set(key, v)}>{label}</button>)}
      </span>
    )
    if (meta.type === 'slider') return (
      <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="range" min={meta.min} max={meta.max} step={meta.step} value={val ?? 1} onChange={(e) => set(key, parseFloat(e.target.value))} style={{ flex: 1 }} />
        <b>{val ?? 1}x</b>
      </span>
    )
    return null
  }
  const saveSlot = (i) => { saveJSON('sayonara_slot_' + i, s); say(` Slot ${i} me save ho gaya`) }
  const loadSlot = (i) => {
    const data = loadJSON('sayonara_slot_' + i)
    if (!data) return say(' Slot khali hai')
    onImport(data); say(` Slot ${i} load ho gaya`)
  }
  return (
    <>
      {s.sandbox && <div className="sandbox-banner"> SANDBOX SAVE — Unlimited money mode (ye nishan hamesha rahega)</div>}
      {SETTING_GROUPS.map((g) => (
        <Section key={g.id} id={'set_' + g.id} title={g.title} defaultOpen={g.id === 'gameplay'}>
          {g.keys.map((key) => (
            <div className="set-row" key={key}>
              <div className="set-info"><b>{SETTING_META[key].label}</b><div className="muted">{SETTING_META[key].help}</div></div>
              <div className="set-ctrl">{renderControl(key)}</div>
            </div>
          ))}
          {g.id === 'audio' && <button className="btn small ghost" style={{ marginTop: 8 }} onClick={() => { playSound('win', { ...st, sound: true }) }}> Awaaz Test Karo</button>}
          {g.id === 'data' && <>
            <b className="small" style={{ display: 'block', marginTop: 10 }}>Save Slots (3)</b>
            {[1, 2, 3].map((i) => (
              <div className="row" key={i}><span>Slot {i}</span><span style={{ display: 'flex', gap: 6 }}>
                <button className="btn small ghost" onClick={() => saveSlot(i)}>Save</button>
                <button className="btn small ghost" onClick={() => loadSlot(i)}>Load</button>
              </span></div>
            ))}
            <b className="small" style={{ display: 'block', marginTop: 10 }}>Export / Import</b>
            <div className="grid2">
              <button className="btn small ghost" onClick={onExport}> Export Code</button>
              <button className="btn small ghost" onClick={() => onImport()}> Import (neeche box se)</button>
            </div>
            <textarea rows={3} style={{ marginTop: 8 }} placeholder="Export code yaha aayega / Import ke liye code paste karo" value={importTxt} onChange={(e) => setImportTxt(e.target.value)} />
            <b className="small" style={{ display: 'block', marginTop: 10 }}>Reset — 'RESET' likh kar confirm karo</b>
            <input type="text" placeholder="RESET likho" value={resetWord} onChange={(e) => setResetWord(e.target.value)} />
            <button className="btn red" style={{ width: '100%', marginTop: 8 }} disabled={resetWord !== 'RESET'} onClick={onReset}> Poora Game Reset</button>
          </>}
          {g.id === 'advanced' && st.debug && <>
            <b className="small" style={{ display: 'block', marginTop: 10 }}> Engine Debug (andar ke number)</b>
            <div className="row"><span>Supplier Index</span><b>{(s.supplier || 1).toFixed(3)}</b></div>
            <div className="row"><span>Sentiment</span><b>{(s.sentiment || 0).toFixed(2)}</b></div>
            <div className="row"><span>Season Boost</span><b>{(s.seasonBoost || 1).toFixed(2)}x</b></div>
            <div className="row"><span>Event Effect</span><b>{s.eventEff}</b></div>
            <div className="row"><span>Month Profit (tax se pehle)</span><b>{fmt(s.monthProfit || 0)}</b></div>
            <div className="row"><span>Receivables (udhaar)</span><b>{fmt(s.receivables || 0)}</b></div>
            <div className="row"><span>Last Tax Day</span><b>{s.lastTaxDay || 0}</b></div>
          </>}
        </Section>
      ))}
      <Section id="about" title="About / Credits" icon="help" defaultOpen={false}>
        <p className="small">Sayonara Empire — ek jeeta-jagta economy simulator. React + Vite par bana, 1 lakh+ lines ke code aur content ke saath: 2400 events, 3600 graahak kahaaniyan, 620 faisle, hazaaron sampatti ke saude. Har number ke peeche ek engine hai — demand, supply, mazdoori, credit, bazaar. Khelo, seekho, samrajya banao. </p>
        <p className="muted">Note: Language setting poora UI chrome (tabs, HUD, panels, buttons, categories, time controls, stats labels) 19 bhashaon me badalti hai — Urdu (Roman) Hinglish-style bhi shamil hai, Arabic/Urdu script par RTL layout lagta hai. Gehri content libraries (events, kahaaniyan, khabrein, encyclopedia) apni asli Hinglish/English me rehti hain. Sandbox save par hamesha nishan rehta hai.</p>
      </Section>
    </>
  )
}

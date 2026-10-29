import { useEffect, useRef, useState } from 'react'
import { useAnimatedSpring } from '../hooks/useAnimatedSpring.js'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from './icons/index.jsx'
import { SkeletonCard } from './cards.jsx'
export { SkeletonCard }

export function Section({ id, title, icon, right, children, defaultOpen = true }) {
  const key = 'se_collapse_' + id
  const [open, setOpen] = useState(() => { try { const v = localStorage.getItem(key); return v === null ? defaultOpen : v === '1' } catch { return defaultOpen } })
  useEffect(() => { try { localStorage.setItem(key, open ? '1' : '0') } catch {} }, [open])
  return (
    <div className="card section">
      <button className="sec-head" onClick={() => setOpen(!open)}>
        <span className="sec-title">{icon && <Icon name={icon} size={17} />} {title}</span>
        <span className="sec-right">{right}<motion.span animate={{ rotate: open ? 180 : 0 }} className="chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 9.5l7 7 7-7"/></svg></motion.span></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
            <div className="sec-body">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AnimatedNumber({ value, format }) {
  const text = useAnimatedSpring(value, format)
  return <motion.span>{text}</motion.span>
}

export function Burst({ burstKey }) {
  const [parts, setParts] = useState([])
  useEffect(() => {
    if (!burstKey) return
    const lowPerf = typeof document !== 'undefined' && document.body && document.body.classList.contains('perf-low')
    const ps = Array.from({ length: lowPerf ? 7 : 16 }, (_, i) => ({ id: burstKey + '-' + i, x: (Math.random() - 0.5) * 240, y: -Math.random() * 180 - 30, r: Math.random() * 260, e: ['coin', 'spark', 'cash', 'star'][i % 4] }))
    setParts(ps)
    const t = setTimeout(() => setParts([]), 1100)
    return () => clearTimeout(t)
  }, [burstKey])
  return (
    <div className="burst-layer">
      {parts.map(p => (
        <motion.span key={p.id} className="burst-p" initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }} animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.r, scale: 0.6 }} transition={{ duration: 1, ease: 'easeOut' }}><Icon name={p.e} size={20} /></motion.span>
      ))}
    </div>
  )
}

export function Toast({ msg }) {
  return (
    <AnimatePresence>
      {msg && <motion.div className="toast" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}><Icon name="spark" size={16} /><span>{msg}</span></motion.div>}
    </AnimatePresence>
  )
}

import { motion } from 'framer-motion'
import { PHASES } from '../game/data.js'
import { Icon } from './icons/index.jsx'
// Din ka arc: suraj/chaand safar karta hai, behti hui progress line ke saath (reference ki flowing-line bhasha)
export function PhaseArc({ phase }) {
  const pct = (phase + 0.5) / 4
  const isNight = phase === 3
  return (
    <div className="phase-arc">
      <svg viewBox="0 0 340 44" className="arc-svg" preserveAspectRatio="none">
        <path d="M6 40 Q 170 -18 334 40" fill="none" stroke="#1f1f1f" strokeWidth="2.5" />
        <motion.path d="M6 40 Q 170 -18 334 40" fill="none" stroke="url(#arcg)" strokeWidth="2.5" strokeLinecap="round"
          initial={false} animate={{ pathLength: pct }} transition={{ duration: 0.7, ease: 'easeInOut' }} />
        <defs>
          <linearGradient id="arcg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a855f7" /><stop offset="55%" stopColor="#e879f9" /><stop offset="100%" stopColor="#f5c542" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div className="arc-orb" animate={{ left: `calc(${pct * 100}% - 13px)`, top: `${30 - Math.sin(pct * Math.PI) * 24}px` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
        {isNight ? <Icon name="spark" size={19} /> : <Icon name="sun" size={19} />}
      </motion.div>
      <div className="arc-label">{PHASES[phase]}</div>
    </div>
  )
}

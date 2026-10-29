import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
// Reference-level motion graphics splash: kaale par gradient glow, akshar-dar-akshar title, ghumta tech-wheel, behti lines
const TITLE1 = 'SAYONARA'
const TITLE2 = 'EMPIRE'
export function Splash({ show, onDone }) {
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="splash" exit={{ opacity: 0, filter: 'blur(6px)' }} transition={{ duration: 0.5 }} onClick={onDone}>
          <svg className="splash-wheel" viewBox="0 0 200 200">
            <motion.circle cx="100" cy="100" r="86" fill="none" stroke="url(#g1)" strokeWidth="1.4" strokeDasharray="6 10"
              animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} style={{ originX: '100px', originY: '100px' }} />
            <motion.circle cx="100" cy="100" r="64" fill="none" stroke="url(#g1)" strokeWidth="1" strokeDasharray="40 18"
              animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} style={{ originX: '100px', originY: '100px' }} />
            <motion.circle cx="100" cy="100" r="44" fill="none" stroke="url(#g1)" strokeWidth="0.8" strokeDasharray="4 6"
              animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ originX: '100px', originY: '100px' }} />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" /><stop offset="55%" stopColor="#e879f9" /><stop offset="100%" stopColor="#f5c542" />
              </linearGradient>
            </defs>
          </svg>
          <svg className="splash-lines" viewBox="0 0 360 60" preserveAspectRatio="none">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.path key={i} d={`M0 ${12 + i * 9} C 90 ${2 + i * 12}, 270 ${50 - i * 6}, 360 ${28 + i * 3}`}
                fill="none" stroke={i % 2 ? '#e879f9' : '#a855f7'} strokeWidth="1" opacity="0.55"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.25 + i * 0.12, ease: 'easeInOut' }} />
            ))}
          </svg>
          <div className="splash-title">
            <div className="splash-line1">
              {TITLE1.split('').map((ch, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 26, rotateX: 80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.35 + i * 0.055, type: 'spring', stiffness: 320, damping: 22 }}>{ch}</motion.span>
              ))}
            </div>
            <div className="splash-line2">
              {TITLE2.split('').map((ch, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.95 + i * 0.07, type: 'spring', stiffness: 300, damping: 17 }}>{ch}</motion.span>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="splash-sub">
              ECONOMY • BUSINESS • SAMRAJYA
            </motion.p>
            <motion.div className="splash-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 2.1, ease: 'easeInOut' }} />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.9 }} className="splash-tap">Tap karke skip karo</motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

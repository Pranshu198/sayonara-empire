import { useEffect } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
// Paisa hamesha spring physics se count hota hai — motion-graphics feel
export function useAnimatedSpring(value, format) {
  const mv = useMotionValue(value)
  const spring = useSpring(mv, { stiffness: 120, damping: 22, mass: 0.6 })
  const text = useTransform(spring, (v) => format(v))
  useEffect(() => { mv.set(value) }, [value, mv])
  return text
}

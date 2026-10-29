import { useEffect } from 'react'
// Auto mode: phase duration = dayLen/4, speed se divide
export function useAutoTimer(state, tick) {
  useEffect(() => {
    if (state.mode !== 'auto') return undefined
    const ms = (state.dayLen * 1000 / 4) / state.speed
    const iv = setInterval(tick, ms)
    return () => clearInterval(iv)
  }, [state.mode, state.dayLen, state.speed, tick])
}

import { useEffect, useRef, useState } from 'react'
// Developer setting: live FPS counter
export function FpsMeter() {
  const [fps, setFps] = useState(0)
  const frames = useRef(0)
  useEffect(() => {
    let raf; let last = performance.now()
    const loop = (t) => {
      frames.current += 1
      if (t - last >= 500) { setFps(Math.round(frames.current * 1000 / (t - last))); frames.current = 0; last = t }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <div className="fps-meter">{fps} FPS</div>
}

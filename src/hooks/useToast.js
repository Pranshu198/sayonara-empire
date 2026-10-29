import { useCallback, useEffect, useRef, useState } from 'react'
// Toast + celebration burst ka combined hook (App level par ek hi jagah)
export function useToast() {
  const [toast, setToast] = useState('')
  const [burst, setBurst] = useState(0)
  const timer = useRef(null)
  const say = useCallback((msg, celebrate = false) => {
    setToast(msg)
    if (celebrate) setBurst((b) => b + 1)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 2600)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  return { toast, burst, say }
}

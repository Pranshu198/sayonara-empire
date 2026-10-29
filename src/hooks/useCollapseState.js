import { useEffect, useState } from 'react'
import { loadFlag, saveFlag } from '../utils/storage.js'
// Har collapsible section ki open/closed halat device par yaad rehti hai
export function useCollapseState(id, defaultOpen = true) {
  const key = 'se_collapse_' + id
  const [open, setOpen] = useState(() => loadFlag(key, defaultOpen))
  useEffect(() => { saveFlag(key, open) }, [key, open])
  return [open, setOpen]
}

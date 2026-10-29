import { useEffect } from 'react'
import { saveJSON } from '../utils/storage.js'
// Har state change par autosave (lastSaveAt ke saath — offline earnings ke liye)
export function useSaveGame(key, state) {
  useEffect(() => {
    saveJSON(key, { ...state, lastSaveAt: Date.now() })
  }, [key, state])
}

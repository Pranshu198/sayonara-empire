import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './cards.css'
import './app-shell.css'
import './pass35.css'
import App from './App.jsx'
// Pass 3 deep content: base pools pehli paint deti hain, gehre pools peeche-peeche stream hote hain
// Deep libraries pehli paint ke BAAD stream hoti hain (splash cover me) — initial bundle halka
const startDeep = () => { import('./game/deepLoader.js').catch(() => {}) }
if ('requestIdleCallback' in window) requestIdleCallback(startDeep, { timeout: 1200 }); else setTimeout(startDeep, 350) // Pass 3.4: deep stream idle par, pehli paint se takraye nahi

// Pass 3.3: Service worker — app-shell cache/offline, sirf production me
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

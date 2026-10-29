import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './cards.css'
import App from './App.jsx'
// Pass 3 deep content: base pools pehli paint deti hain, gehre pools peeche-peeche stream hote hain
// Deep libraries pehli paint ke BAAD stream hoti hain (splash cover me) — initial bundle halka
import('./game/deepLoader.js').catch(() => {})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

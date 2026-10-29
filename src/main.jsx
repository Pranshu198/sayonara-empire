import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Pass 3 deep content: base pools pehli paint deti hain, gehre pools peeche-peeche stream hote hain
import './game/deepLoader.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

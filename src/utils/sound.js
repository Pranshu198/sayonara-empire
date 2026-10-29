// WebAudio se banti chhoti awaazein — koi file nahi, koi download nahi
let ctx = null
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)() } catch { ctx = null } }
  return ctx
}
function beep(freq, dur, type, vol, when = 0) {
  const c = ac(); if (!c) return
  const o = c.createOscillator(); const g = c.createGain()
  o.type = type; o.frequency.value = freq
  const t = c.currentTime + when
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(c.destination)
  o.start(t); o.stop(t + dur + 0.02)
}
export function playSound(kind, settings) {
  if (!settings || !settings.sound) return
  const v = Math.max(0.01, (settings.volume || 0.5) * 0.15)
  try {
    if (kind === 'click') beep(660, 0.07, 'triangle', v)
    else if (kind === 'cash') { beep(880, 0.09, 'sine', v); beep(1320, 0.12, 'sine', v, 0.07) }
    else if (kind === 'win') { beep(523, 0.1, 'triangle', v); beep(659, 0.1, 'triangle', v, 0.09); beep(784, 0.16, 'triangle', v, 0.18) }
    else if (kind === 'error') beep(180, 0.15, 'sawtooth', v * 0.7)
    else if (kind === 'coin') { beep(988, 0.06, 'square', v * 0.6); beep(1319, 0.1, 'square', v * 0.6, 0.05) }
  } catch { /* awaaz na bane to game rukna nahi chahiye */ }
}

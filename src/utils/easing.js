// Motion design tokens — poori app me ek hi easing bhasha
export const EASE_OUT = [0.16, 1, 0.3, 1]
export const EASE_SPRING = { type: 'spring', stiffness: 260, damping: 26 }
export const EASE_BOUNCE = { type: 'spring', stiffness: 300, damping: 17 }
export const DUR = { fast: 0.18, mid: 0.32, slow: 0.6, splash: 0.9 }
export const stagger = (i, step = 0.05) => i * step

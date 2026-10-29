// UI me dikhne wale content strings se emoji hatane ka surakshit safaai — gehri content libraries
// apni asli files me rehti hain, par screen par sirf saaf text + khud ke SVG icons dikhte hain.
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu
export function stripEmoji(str) {
  if (typeof str !== 'string') return str
  return str.replace(EMOJI_RE, '').replace(/\s{2,}/g, ' ').trim()
}

// ============ i18n SYSTEM — 19 bhashayein, t(key) framework ============
// Sirf active bhasha ka pack load hota hai (dynamic import, lazy chunk); English + Hinglish base bundled hain taaki pehli paint bina deri ho.
// UI chrome (tabs/HUD/panels/buttons/settings/categories/time/stats labels) translate hoti hai;
// gehri content libraries (events/stories/news) apni asli bhasha me rehti hain — Settings/About me ye baat saaf likhi hai.
import en from './en.js'
import hinglish from './hinglish.js'

export const LANGS = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिंदी' },
  { id: 'hinglish', label: 'Hinglish (Roman Hindi)', native: 'Hinglish' },
  { id: 'ur-roman', label: 'Urdu (Roman)', native: 'Urdu Roman' },
  { id: 'ur', label: 'Urdu', native: 'اردو', rtl: true },
  { id: 'ar', label: 'Arabic', native: 'العربية', rtl: true },
  { id: 'fr', label: 'French', native: 'Français' },
  { id: 'ru', label: 'Russian', native: 'Русский' },
  { id: 'es', label: 'Spanish', native: 'Español' },
  { id: 'pt', label: 'Portuguese', native: 'Português' },
  { id: 'de', label: 'German', native: 'Deutsch' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'zh', label: 'Chinese (Simplified)', native: '中文' },
  { id: 'ja', label: 'Japanese', native: '日本語' },
  { id: 'ko', label: 'Korean', native: '한국어' },
]
export const langMeta = (id) => LANGS.find((l) => l.id === id) || LANGS[0]
export const isRTL = (id) => !!langMeta(id).rtl
export const FONT_STACKS = {
  hi: "'Noto Sans Devanagari','Segoe UI',system-ui,sans-serif", mr: "'Noto Sans Devanagari','Segoe UI',system-ui,sans-serif", pa: "'Noto Sans Gurmukhi','Segoe UI',system-ui,sans-serif",
  ur: "'Noto Nastaliq Urdu','Segoe UI',system-ui,serif", ar: "'Noto Naskh Arabic','Segoe UI',system-ui,sans-serif",
  bn: "'Noto Sans Bengali','Segoe UI',system-ui,sans-serif", ta: "'Noto Sans Tamil','Segoe UI',system-ui,sans-serif", te: "'Noto Sans Telugu','Segoe UI',system-ui,sans-serif",
  ru: "'Segoe UI',system-ui,sans-serif", zh: "'Noto Sans SC','Segoe UI',system-ui,sans-serif", ja: "'Noto Sans JP','Segoe UI',system-ui,sans-serif", ko: "'Noto Sans KR','Segoe UI',system-ui,sans-serif",
}
const LOADERS = {
  hi: () => import('./hi.js'), ur: () => import('./ur.js'), 'ur-roman': () => import('./urRoman.js'),
  fr: () => import('./fr.js'), ru: () => import('./ru.js'), es: () => import('./es.js'), ar: () => import('./ar.js'),
  bn: () => import('./bn.js'), pt: () => import('./pt.js'), de: () => import('./de.js'), zh: () => import('./zh.js'),
  ja: () => import('./ja.js'), ko: () => import('./ko.js'), ta: () => import('./ta.js'), te: () => import('./te.js'),
  mr: () => import('./mr.js'), pa: () => import('./pa.js'),
}
export const BASE_PACKS = { en, hinglish }
export async function loadLang(id) {
  if (BASE_PACKS[id]) return BASE_PACKS[id]
  if (id === 'hindi') id = 'hi'
  const loader = LOADERS[id]
  if (!loader) return en
  const m = await loader()
  return m.default || en
}
export function detectLang() {
  try {
    const nav = (navigator.language || 'en').toLowerCase()
    const map = { hi: 'hi', ur: 'ur-roman', fr: 'fr', ru: 'ru', es: 'es', ar: 'ar', bn: 'bn', pt: 'pt', de: 'de', zh: 'zh', ja: 'ja', ko: 'ko', ta: 'ta', te: 'te', mr: 'mr', pa: 'pa', en: 'en' }
    return map[nav.split('-')[0]] || 'en'
  } catch { return 'hinglish' }
}
// t(pack, key): pack -> english -> key
export function makeT(pack) {
  return (key) => (pack && pack[key]) || en[key] || key
}
// settings.js ke puraane 3-bhasha system ko unified pack se jodo (chrome)
export function chromeFromPack(pack) {
  if (!pack) return null
  return { cash: pack.cash, bank: pack.bankLbl, netWorth: pack.netWorth, empire: pack.empire, business: pack.business, markets: pack.markets, property: pack.property, bankTab: pack.bank, wealth: pack.wealth, more: pack.more, stats: pack.stats, hq: pack.hq }
}

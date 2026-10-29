// ============ GOD-TIER SETTINGS — har setting asal me kaam karti hai aur save me rehti hai ============
// Gameplay/Simulation wali settings engine padhta hai; Display/Audio/Data wali App/UI par lagti hain.
export const DEFAULT_SETTINGS = {
  // Gameplay
  difficulty: 'normal',      // easy | normal | hard — aamdani aur shuru ki sahuliyat
  dayLenDefault: 60,         // naye game/auto ke liye default din ki lambai (sec)
  startMode: 'manual',       // naya game kis mode me khule
  eventFreq: 1,              // 0..2 — events kitni baar aaye
  volatility: 1,             // 0.5..2 — economy ka utar-chadhav
  taxStrict: 1,              // 0..2 — tax ki sakhti (base 10% × ye)
  // Simulation
  inflation: 1,              // 0..2 — supplier/mahengaai ki raftaar
  compAggro: 1,              // 0..2 — rivals kitni tez badhte hain
  custStrict: 1,             // 0..2 — graahak rating me kitne sakht
  marketVol: 1,              // 0.5..2.5 — share bazaar ka utar-chadhav
  // Display / UI
  accent: 'gold',            // gold | violet | green | pink — poori app ka rang
  fontScale: 1,              // 0.9 | 1 | 1.15 — text ka size
  animLevel: 'full',         // full | reduced | off
  numFmt: 'short',           // short (₹1.2L) | full (₹1,20,000)
  amoled: 'pure',            // pure (#000) | soft (#050505 surfaces zyada)
  // Audio
  sound: false,
  volume: 0.5,               // 0..1
  // Data
  autosaveSec: 0,            // 0 = har badlav par (default vyavhaar)
  // Accessibility
  largeText: false,
  contrast: false,
  reducedMotion: false,
  // Advanced / Developer
  showFps: false,
  debug: false,              // engine ke andar ke number dikhao
  // Sandbox (alag section — save par nishan lagta hai)
  sandbox: false,
  // Language
  lang: 'hinglish',          // hinglish | hindi | english (main chrome + naye panels)
}

export const SETTING_GROUPS = [
  { id: 'gameplay', title: '🎮 Gameplay', keys: ['difficulty', 'dayLenDefault', 'startMode', 'eventFreq', 'volatility', 'taxStrict'] },
  { id: 'simulation', title: '🧪 Simulation', keys: ['inflation', 'compAggro', 'custStrict', 'marketVol'] },
  { id: 'display', title: '🎨 Display / UI', keys: ['accent', 'fontScale', 'animLevel', 'numFmt', 'amoled'] },
  { id: 'audio', title: '🔊 Audio', keys: ['sound', 'volume'] },
  { id: 'data', title: '💾 Data', keys: ['autosaveSec'] },
  { id: 'access', title: '♿ Accessibility', keys: ['largeText', 'contrast', 'reducedMotion'] },
  { id: 'advanced', title: '🛠️ Advanced / Developer', keys: ['showFps', 'debug'] },
  { id: 'sandbox', title: '🏖️ Cheats / Sandbox (save par nishan lagega)', keys: ['sandbox'] },
  { id: 'language', title: '🌐 Language', keys: ['lang'] },
]

export const SETTING_META = {
  difficulty: { label: 'Difficulty', type: 'choice', options: [['easy', '😊 Easy (aamdani +15%)'], ['normal', '😐 Normal'], ['hard', '🔥 Hard (aamdani −10%, asli chunauti)']], help: 'Aamdani ke factor ko badalta hai. Naya game shuru karne par asar sabse saaf dikhta hai, chalte game me bhi factor lagta hai.' },
  dayLenDefault: { label: 'Default Day Length', type: 'choice', options: [[30, '30 sec'], [60, '60 sec'], [120, '2 min'], [300, '5 min']], help: 'Auto mode me ek din kitni der chalega — yahi se turant lag jata hai.' },
  startMode: { label: 'Start Mode', type: 'choice', options: [['manual', '✋ Manual'], ['auto', '▶️ Auto']], help: 'Naya/reset game kis time mode me khulega.' },
  eventFreq: { label: 'Event Frequency', type: 'slider', min: 0, max: 2, step: 0.25, help: '0 = shaant sheher, 2 = roz hungama. Random events ki sambhavna badalta hai.' },
  volatility: { label: 'Economy Volatility', type: 'slider', min: 0.5, max: 2, step: 0.25, help: 'Supplier rate aur sentiment kitni tez ghumega.' },
  taxStrict: { label: 'Tax Strictness', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Mahine ke munafe par tax = 10% × ye number. 0 = koi tax nahi (par imaandaari ki baat alag hai).' },
  inflation: { label: 'Inflation Pressure', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Supplier rate upar ki taraf kitna kheenchega.' },
  compAggro: { label: 'Competitor Aggression', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Rivals kitni tez badhenge — 2 par ve tumhe peeche chhodne ki poori koshish karenge.' },
  custStrict: { label: 'Customer Strictness', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Grahak rating kitni sakhti se ghataenge. Zyada price par asar dugna.' },
  marketVol: { label: 'Market Volatility', type: 'slider', min: 0.5, max: 2.5, step: 0.25, help: 'Share/sone ke daam kitni tez uchlenge-girenge.' },
  accent: { label: 'Accent Colour', type: 'choice', options: [['gold', '🟡 Gold'], ['violet', '🟣 Violet (motion-graphics wala)'], ['green', '🟢 Green'], ['pink', '🩷 Pink']], help: 'Poori app ke highlight rang badal jata hai.' },
  fontScale: { label: 'Font Size', type: 'choice', options: [[0.9, 'Chhota'], [1, 'Aam'], [1.15, 'Bada']], help: 'Poori app ke akshar bade/chhote.' },
  animLevel: { label: 'Animations', type: 'choice', options: [['full', '✨ Full (motion graphics)'], ['reduced', 'Halki'], ['off', 'Band']], help: 'Splash, bursts aur bade animations ka star.' },
  numFmt: { label: 'Number Format', type: 'choice', options: [['short', '₹1.2 L (chhota)'], ['full', '₹1,20,000 (poora)']], help: 'Paisa kis roop me dikhe — HUD ke number turant badalte hain.' },
  amoled: { label: 'AMOLED Style', type: 'choice', options: [['pure', 'Pure Black (#000)'], ['soft', 'Soft Black (halki roshni)']], help: 'Pure = battery bachat zyada; Soft = cards thode zyada saaf.' },
  sound: { label: 'Sound Effects', type: 'toggle', help: 'Chhoti WebAudio awaazein — kamaai, click aur jeet par. Koi file nahi, browser khud banata hai.' },
  volume: { label: 'Volume', type: 'slider', min: 0, max: 1, step: 0.1, help: 'Sound ki awaz kitni tez.' },
  autosaveSec: { label: 'Auto-save Har (sec)', type: 'choice', options: [[0, 'Har badlav par'], [5, '5 sec'], [15, '15 sec'], [30, '30 sec']], help: 'Game waise har badlav par save hota hai; yaha chunne par utni der ke antar par save hoga.' },
  largeText: { label: 'Large Text Mode', type: 'toggle', help: 'Saare akshar ek size aur bade — padhna aasan.' },
  contrast: { label: 'High Contrast', type: 'toggle', help: 'Sarhadein aur rang aur gehre — kam roshni me saaf dikhega.' },
  reducedMotion: { label: 'Reduced Motion', type: 'toggle', help: 'Saare bade animations band — aankh aur battery dono ke liye shaant.' },
  showFps: { label: 'Show FPS', type: 'toggle', help: 'Screen ke kone me frames-per-second ka live number.' },
  debug: { label: 'Engine Debug Stats', type: 'toggle', help: 'More me engine ke andar ke number: demand factor, supplier drift, sentiment, season — jo khiladi ko aam taur par nahi dikhta.' },
  sandbox: { label: '🏖️ Unlimited Money (SANDBOX)', type: 'toggle', help: 'Saksham karte hi nakad ₹100 Cr ho jayegi aur save hamesha SANDBOX nishan ke saath rahega. Izzat ki race ke liye nahi, maza aur testing ke liye hai.' },
  lang: { label: 'UI Language', type: 'choice', options: [['hinglish', 'Hinglish (mix)'], ['hindi', 'हिंदी'], ['english', 'English']], help: 'Main hisse (tabs, paisa labels, naye panels) ki bhasha badalti hai. Kuch purani lambi vyakhya Hinglish me hi rehti hai.' },
}

export function difficultyFactor(settings) {
  if (!settings) return 1
  if (settings.difficulty === 'easy') return 1.15
  if (settings.difficulty === 'hard') return 0.9
  return 1
}
export function taxRateOf(settings) {
  return 0.10 * (settings ? settings.taxStrict : 1)
}
export function withDefaults(settings) {
  return { ...DEFAULT_SETTINGS, ...(settings || {}) }
}
// Main chrome ke shabdavali — lang setting yahi se badalti hai
export const CHROME_TEXT = {
  hinglish: { cash: 'Cash', bank: 'Bank', netWorth: 'Net Worth', empire: 'Empire', business: 'Business', markets: 'Markets', property: 'Property', bankTab: 'Bank', wealth: 'Wealth', more: 'More' },
  hindi: { cash: 'नकद', bank: 'बैंक', netWorth: 'कुल संपत्ति', empire: 'साम्राज्य', business: 'कारोबार', markets: 'बाज़ार', property: 'संपत्ति', bankTab: 'बैंक', wealth: 'निवेश', more: 'और' },
  english: { cash: 'Cash', bank: 'Bank', netWorth: 'Net Worth', empire: 'Empire', business: 'Business', markets: 'Markets', property: 'Property', bankTab: 'Bank', wealth: 'Wealth', more: 'More' },
}
export function chromeText(settings) {
  return CHROME_TEXT[(settings && settings.lang) || 'hinglish'] || CHROME_TEXT.hinglish
}

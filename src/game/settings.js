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
  lang: 'hinglish',          // i18n pack id (src/i18n) — 19 bhashayein
  perfMode: 'auto',          // auto | on | off — kamzor device par animation halka (design same)          // hinglish | hindi | english (main chrome + naye panels)
}

export const SETTING_GROUPS = [
  { id: 'gameplay', title: ' Gameplay', keys: ['difficulty', 'dayLenDefault', 'startMode', 'eventFreq', 'volatility', 'taxStrict'] },
  { id: 'simulation', title: ' Simulation', keys: ['inflation', 'compAggro', 'custStrict', 'marketVol'] },
  { id: 'display', title: ' Display / UI', keys: ['accent', 'fontScale', 'animLevel', 'numFmt', 'amoled'] },
  { id: 'audio', title: ' Audio', keys: ['sound', 'volume'] },
  { id: 'data', title: ' Data', keys: ['autosaveSec'] },
  { id: 'access', title: ' Accessibility', keys: ['largeText', 'contrast', 'reducedMotion'] },
  { id: 'advanced', title: ' Advanced / Developer', keys: ['showFps', 'debug', 'perfMode'] },
  { id: 'sandbox', title: ' Cheats / Sandbox (save par nishan lagega)', keys: ['sandbox'] },
  { id: 'language', title: ' Language', keys: ['lang'] },
]

export const SETTING_META = {
  difficulty: { label: 'Difficulty', type: 'choice', options: [['easy', ' Easy (aamdani +15%)'], ['normal', ' Normal'], ['hard', ' Hard (aamdani −10%, asli chunauti)']], help: 'Aamdani ke factor ko badalta hai. Naya game shuru karne par asar sabse saaf dikhta hai, chalte game me bhi factor lagta hai.' },
  dayLenDefault: { label: 'Default Day Length', type: 'choice', options: [[30, '30 sec'], [60, '60 sec'], [120, '2 min'], [300, '5 min']], help: 'Auto mode me ek din kitni der chalega — yahi se turant lag jata hai.' },
  startMode: { label: 'Start Mode', type: 'choice', options: [['manual', ' Manual'], ['auto', ' Auto']], help: 'Naya/reset game kis time mode me khulega.' },
  eventFreq: { label: 'Event Frequency', type: 'slider', min: 0, max: 2, step: 0.25, help: '0 = shaant sheher, 2 = roz hungama. Random events ki sambhavna badalta hai.' },
  volatility: { label: 'Economy Volatility', type: 'slider', min: 0.5, max: 2, step: 0.25, help: 'Supplier rate aur sentiment kitni tez ghumega.' },
  taxStrict: { label: 'Tax Strictness', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Mahine ke munafe par tax = 10% × ye number. 0 = koi tax nahi (par imaandaari ki baat alag hai).' },
  inflation: { label: 'Inflation Pressure', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Supplier rate upar ki taraf kitna kheenchega.' },
  compAggro: { label: 'Competitor Aggression', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Rivals kitni tez badhenge — 2 par ve tumhe peeche chhodne ki poori koshish karenge.' },
  custStrict: { label: 'Customer Strictness', type: 'slider', min: 0, max: 2, step: 0.25, help: 'Grahak rating kitni sakhti se ghataenge. Zyada price par asar dugna.' },
  marketVol: { label: 'Market Volatility', type: 'slider', min: 0.5, max: 2.5, step: 0.25, help: 'Share/sone ke daam kitni tez uchlenge-girenge.' },
  accent: { label: 'Accent Colour', type: 'choice', options: [['gold', ' Gold'], ['violet', ' Violet (motion-graphics wala)'], ['green', ' Green'], ['pink', ' Pink']], help: 'Poori app ke highlight rang badal jata hai.' },
  fontScale: { label: 'Font Size', type: 'choice', options: [[0.9, 'Chhota'], [1, 'Aam'], [1.15, 'Bada']], help: 'Poori app ke akshar bade/chhote.' },
  animLevel: { label: 'Animations', type: 'choice', options: [['full', ' Full (motion graphics)'], ['reduced', 'Halki'], ['off', 'Band']], help: 'Splash, bursts aur bade animations ka star.' },
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
  sandbox: { label: ' Unlimited Money (SANDBOX)', type: 'toggle', help: 'Saksham karte hi nakad ₹100 Cr ho jayegi aur save hamesha SANDBOX nishan ke saath rahega. Izzat ki race ke liye nahi, maza aur testing ke liye hai.' },
  lang: { label: 'UI Language', type: 'langpicker', help: 'Poora UI chrome (tabs, HUD, panels, buttons, settings, categories, time, stats labels) 19 bhashaon me. Gehri kahaaniyan/khabrein apni asli Hinglish/English me rehti hain.' },
  perfMode: { label: 'Performance Mode', type: 'choice', options: [['auto', 'Auto (FPS girne par halka)'], ['on', 'Hamesha On (halka)'], ['off', 'Off (poora animation)']], help: 'Kamzor device par particles/shadow kam ho jate hain — cards, rang aur design bilkul same rehte hain.' },
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
  hinglish: { cash: 'Cash', bank: 'Bank', netWorth: 'Net Worth', empire: 'Empire', business: 'Business', markets: 'Markets', property: 'Property', bankTab: 'Bank', wealth: 'Wealth', more: 'More', stats: 'Stats' },
  hindi: { cash: 'नकद', bank: 'बैंक', netWorth: 'कुल संपत्ति', empire: 'साम्राज्य', business: 'कारोबार', markets: 'बाज़ार', property: 'संपत्ति', bankTab: 'बैंक', wealth: 'निवेश', more: 'और', stats: 'आँकड़े' },
  english: { cash: 'Cash', bank: 'Bank', netWorth: 'Net Worth', empire: 'Empire', business: 'Business', markets: 'Markets', property: 'Property', bankTab: 'Bank', wealth: 'Wealth', more: 'More', stats: 'Stats' },
}
export function chromeText(settings) {
  return CHROME_TEXT[(settings && settings.lang) || 'hinglish'] || CHROME_TEXT.hinglish
}
// Stats tab ki shabdavali — wahi lang system, teeno integrated bhashao me
export const STATS_TEXT = {
  hinglish: { rates: 'Live Rates — Har Second ka Hisaab', perSec: '/sec', perMin: '/min', perHour: '/ghanta', perPhase: '/phase', income: 'Income', burn: 'Burn (kharcha)', net: 'Net (munafa)', estNote: 'Rates pichle poore din + aaj ke hisaab ka average-andaze hain — live andaz, vaada nahi.', sessionEst: 'Is session ki andazit net kamaai', burnBreak: 'Burn kaha ja raha hai', wages: 'Tankhwah (wages)', rent: 'Kiraya (rent)', cogs: 'Maal (COGS)', util: 'Bijli/upkeep', wastage: 'Wastage', interest: 'Byaaj/EMI hissa', lifetime: 'Lifetime — Kul Hisaab', lIncome: 'Lifetime Income', lCosts: 'Lifetime Kharcha', lProfit: 'Lifetime Munafa', lTax: 'Lifetime Tax diya', lWages: 'Lifetime Tankhwah di', lCustomers: 'Graahak aaye (andaz)', lItems: 'Cheezein biki (andaz)', lDays: 'Kul din khele', lPhases: 'Kul phases', bestDay: 'Sabse achha din', worstDay: 'Sabse bura din', biggestCost: 'Sabse bada ek-din kharcha', empire: 'Empire Snapshot', totBiz: 'Kul businesses (branches)', uniqBiz: 'Alag business types', cities: 'Sheher active', countries: 'Desh active', totStaff: 'Kul staff', totManagers: 'Managers', props: 'Properties', assets: 'Wealth assets', portfolio: 'Portfolio (shares+maal)', nwChart: 'Net Worth — pichle 60 din', shareCat: 'Munafa hissa — Category', shareCity: 'Munafa hissa — Sheher (Top 5)', staffRatio: 'Staff kharcha ratio', margin: 'Profit margin', roi: 'ROI (kul lagat par)', health: 'Cashflow sehat', records: 'Records aur Fun Stats', ms: 'Milestones — pehli baar kab pahunche', streak: 'Abhi ki munafa-streak (din)', longestStreak: 'Sabse lambi munafa-streak', rank: 'Rivals me tumhari rank', legacy: 'Legacy Score', notYet: 'abhi nahi', dayWord: 'Day', lifeNote: 'Note: Lifetime counters is save par {day} se ginne shuru hue hain — usse pehle ka khel inme shamil nahi.', healthy: 'Swasth', tight: 'Tang', danger: 'Khatra' },
  hindi: { rates: 'लाइव दरें — हर सेकंड का हिसाब', perSec: '/सेकंड', perMin: '/मिनट', perHour: '/घंटा', perPhase: '/चरण', income: 'आय', burn: 'खर्च (बर्न)', net: 'शुद्ध (मुनाफ़ा)', estNote: 'दरें पिछले पूरे दिन + आज के हिसाब का औसत-अनुमान हैं — लाइव अनुमान, वादा नहीं।', sessionEst: 'इस सत्र की अनुमानित शुद्ध कमाई', burnBreak: 'खर्च कहाँ जा रहा है', wages: 'वेतन', rent: 'किराया', cogs: 'माल (COGS)', util: 'बिजली/रखरखाव', wastage: 'बर्बादी', interest: 'ब्याज/EMI हिस्सा', lifetime: 'आजीवन — कुल हिसाब', lIncome: 'आजीवन आय', lCosts: 'आजीवन खर्च', lProfit: 'आजीवन मुनाफ़ा', lTax: 'आजीवन टैक्स दिया', lWages: 'आजीवन वेतन दिया', lCustomers: 'ग्राहक आए (अनुमान)', lItems: 'वस्तुएँ बिकीं (अनुमान)', lDays: 'कुल दिन खेले', lPhases: 'कुल चरण', bestDay: 'सबसे अच्छा दिन', worstDay: 'सबसे बुरा दिन', biggestCost: 'सबसे बड़ा एक-दिन खर्च', empire: 'साम्राज्य झलक', totBiz: 'कुल कारोबार (शाखाएँ)', uniqBiz: 'अलग कारोबार प्रकार', cities: 'शहर सक्रिय', countries: 'देश सक्रिय', totStaff: 'कुल कर्मचारी', totManagers: 'मैनेजर', props: 'संपत्तियाँ', assets: 'धन संपत्तियाँ', portfolio: 'पोर्टफोलियो (शेयर+माल)', nwChart: 'कुल संपत्ति — पिछले 60 दिन', shareCat: 'मुनाफ़ा हिस्सा — श्रेणी', shareCity: 'मुनाफ़ा हिस्सा — शहर (शीर्ष 5)', staffRatio: 'कर्मचारी खर्च अनुपात', margin: 'मुनाफ़ा मार्जिन', roi: 'ROI (कुल लागत पर)', health: 'नकदी स्वास्थ्य', records: 'रिकॉर्ड और मज़ेदार आँकड़े', ms: 'मील के पत्थर — पहली बार कब पहुँचे', streak: 'अभी की मुनाफ़ा-स्ट्रीक (दिन)', longestStreak: 'सबसे लंबी मुनाफ़ा-स्ट्रीक', rank: 'प्रतिद्वंद्वियों में आपकी रैंक', legacy: 'विरासत स्कोर', notYet: 'अभी नहीं', dayWord: 'दिन', lifeNote: 'नोट: आजीवन काउंटर इस सेव पर दिन {day} से गिनने शुरू हुए हैं — उससे पहले का खेल इनमें शामिल नहीं।', healthy: 'स्वस्थ', tight: 'तंग', danger: 'ख़तरा' },
  english: { rates: 'Live Rates — Per-Second Account', perSec: '/sec', perMin: '/min', perHour: '/hour', perPhase: '/phase', income: 'Income', burn: 'Burn (costs)', net: 'Net (profit)', estNote: 'Rates are an average-estimate from the last full day + today so far — a live estimate, not a promise.', sessionEst: 'Estimated net earned this session', burnBreak: 'Where the burn goes', wages: 'Wages', rent: 'Rent', cogs: 'Goods (COGS)', util: 'Utilities/upkeep', wastage: 'Wastage', interest: 'Interest/EMI share', lifetime: 'Lifetime — Total Account', lIncome: 'Lifetime Income', lCosts: 'Lifetime Expenses', lProfit: 'Lifetime Profit', lTax: 'Lifetime Taxes Paid', lWages: 'Lifetime Wages Paid', lCustomers: 'Customers Served (est.)', lItems: 'Items Sold (est.)', lDays: 'Total Days Played', lPhases: 'Total Phases', bestDay: 'Best Day', worstDay: 'Worst Day', biggestCost: 'Biggest Single-Day Expense', empire: 'Empire Snapshot', totBiz: 'Total Businesses (branches)', uniqBiz: 'Unique Business Types', cities: 'Cities Active', countries: 'Countries Active', totStaff: 'Total Staff', totManagers: 'Managers', props: 'Properties', assets: 'Wealth Assets', portfolio: 'Portfolio (shares+goods)', nwChart: 'Net Worth — Last 60 Days', shareCat: 'Profit Share — Category', shareCity: 'Profit Share — City (Top 5)', staffRatio: 'Staff Cost Ratio', margin: 'Profit Margin', roi: 'ROI (on total invested)', health: 'Cashflow Health', records: 'Records & Fun Stats', ms: 'Milestones — First Reached On', streak: 'Current Profit Streak (days)', longestStreak: 'Longest Profit Streak', rank: 'Your Rank Among Rivals', legacy: 'Legacy Score', notYet: 'not yet', dayWord: 'Day', lifeNote: 'Note: Lifetime counters on this save started counting from day {day} — earlier play is not included.', healthy: 'Healthy', tight: 'Tight', danger: 'Danger' },
}
export function statsText(settings) {
  return STATS_TEXT[(settings && settings.lang) || 'hinglish'] || STATS_TEXT.hinglish
}

// Business definitions ab har business ki apni file se aate hain (src/game/businesses/)
import { BUSINESSES, CATEGORIES, CAT_LABEL, PHASES, PHASE_W } from './businesses/index.js'
export { BUSINESSES, CATEGORIES, CAT_LABEL, PHASES, PHASE_W }
export const STOCKS = [
  { sym: 'RELY', name: 'Rely Industries', price: 2450 }, { sym: 'TCSX', name: 'TCS Tech', price: 3890 },
  { sym: 'HDBK', name: 'HD Bank', price: 1680 }, { sym: 'ZOMT', name: 'Zomato Foods', price: 265 },
  { sym: 'ADNP', name: 'Adani Ports', price: 1420 }, { sym: 'TATM', name: 'Tata Motors', price: 985 },
  { sym: 'INFY', name: 'Infosys', price: 1520 }, { sym: 'SBIN', name: 'SBI Bank', price: 810 },
  { sym: 'PAYT', name: 'Paytm Fin', price: 890 },
]
export const COMMODITIES = [
  { sym: 'GOLD', name: 'Gold (per 10g)', price: 78500 }, { sym: 'SILV', name: 'Silver (per kg)', price: 92000 },
  { sym: 'BTC', name: 'Bitcoin', price: 6850000 }, { sym: 'DOGE', name: 'Dogecoin', price: 14.5 },
]
export const PROPERTIES = [
  { id: 'flat1', name: '1BHK Flat — Uttam Nagar', icon: '🏠', cost: 2500000, rent: 12000 },
  { id: 'flat2', name: '3BHK Flat — Dwarka', icon: '🏢', cost: 7500000, rent: 32000 },
  { id: 'shop1', name: 'Market Shop — Laxmi Nagar', icon: '🏬', cost: 4000000, rent: 28000 },
  { id: 'plot', name: 'Plot — Gurgaon Sec 62', icon: '🌳', cost: 12000000, rent: 0 },
  { id: 'office', name: 'Office — CP Delhi', icon: '🏙️', cost: 20000000, rent: 150000 },
  { id: 'pg', name: 'PG Building — Karol Bagh', icon: '🛏️', cost: 9000000, rent: 65000 },
]
export const RIVALS = [
  { name: 'Simran (Mall Mogul)', pers: 'Aggressive (price war)', focus: 'Retail', nw: 21000000, g: 0.012 },
  { name: 'Vikram (Startup Bhai)', pers: 'Risky', focus: 'Tech', nw: 15000000, g: 0.02 },
  { name: 'Ananya (Property Tycoon)', pers: 'Premium', focus: 'Property', nw: 18000000, g: 0.010 },
  { name: 'Rohit (Stock Shark)', pers: 'Copycat', focus: 'Stocks', nw: 12000000, g: 0.016 },
  { name: 'Priya (Café Queen)', pers: 'Friendly', focus: 'Food', nw: 9000000, g: 0.011 },
  { name: 'Sharma Ji (Kirana King)', pers: 'Slow & Steady', focus: 'Retail', nw: 7000000, g: 0.007 },
]
export const DISTRICTS = [
  { name: 'Uttam Nagar', mood: 'Middle-class, high footfall', rentTrend: '+2%/yr', unlock: 0 },
  { name: 'Dwarka', mood: 'Family area, schools demand', rentTrend: '+3%/yr', unlock: 500000 },
  { name: 'Laxmi Nagar', mood: 'Students, coaching hub', rentTrend: '+3%/yr', unlock: 1500000 },
  { name: 'Karol Bagh', mood: 'Wholesale + PG crowd', rentTrend: '+4%/yr', unlock: 4000000 },
  { name: 'Connaught Place', mood: 'Premium, office crowd', rentTrend: '+5%/yr', unlock: 10000000 },
  { name: 'Gurgaon Cyber City', mood: 'Corporate, highest rents', rentTrend: '+6%/yr', unlock: 25000000 },
]
export const LEGACY_EVENTS = [
  { t: '🎉 Festival season! Food & Retail demand +30% aaj', eff: 'boom' },
  { t: '📉 Market me girawat — stocks saste ho gaye', eff: 'crash' },
  { t: '🌧️ Baarish! Footfall kam, delivery demand zyada', eff: 'rain' },
  { t: '🔥 Viral trend — ek business ki demand double ke aas-paas', eff: 'viral' },
  { t: '🛠️ Supplier ne rate badhaye — COGS mehenga aaj', eff: 'costly' },
  { t: '🏏 India match day — Evening footfall zabardast', eff: 'match' },
  { t: '😌 Aam din — koi khaas halchal nahi', eff: 'calm' },
  { t: '💼 Salary week! Shopping demand +20%', eff: 'salary' },
]
export const ACHIEVEMENTS = [
  { id: 'a1', name: 'Pehla Business', desc: '1 business kharido', check: s => ownedCount(s) >= 1, reward: 500 },
  { id: 'a2', name: 'Teen Dukaanein', desc: '3 businesses own karo', check: s => ownedCount(s) >= 3, reward: 2000 },
  { id: 'a3', name: 'Lakhpati', desc: 'Net worth ₹1L', check: s => s._nw >= 100000, reward: 1000 },
  { id: 'a4', name: 'Das Lakhpati', desc: 'Net worth ₹10L', check: s => s._nw >= 1000000, reward: 5000 },
  { id: 'a5', name: 'Crorepati', desc: 'Net worth ₹1 Cr', check: s => s._nw >= 10000000, reward: 50000 },
  { id: 'a6', name: 'Share Bazaar', desc: 'Pehla share kharido', check: s => Object.values(s.holdings).some(q => q > 0), reward: 300 },
  { id: 'a7', name: 'Makaan Malik', desc: 'Pehli property kharido', check: s => s.props.length >= 1, reward: 3000 },
  { id: 'a8', name: 'Survivor 100', desc: 'Day 100 tak khelo', check: s => s.day >= 100, reward: 10000 },
  { id: 'a9', name: 'Level 10', desc: 'Player level 10', check: s => levelOf(s.xp) >= 10, reward: 5000 },
  { id: 'a10', name: 'Empire Builder', desc: '10 businesses own karo', check: s => ownedCount(s) >= 10, reward: 25000 },
]
export function ownedCount(s) { return Object.keys(s.biz).length }
export function levelOf(xp) { return Math.floor(Math.sqrt(xp / 100)) + 1 }

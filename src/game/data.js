// Business definitions — rev = base daily revenue at price x1.0, default settings are profitable by design
export const CATEGORIES = ['Food', 'Retail', 'Service', 'Edu', 'Health', 'Tech', 'Industry', 'Energy']
export const CAT_LABEL = { Food: '🍔 Food & Drinks', Retail: '🛍️ Retail & Shopping', Service: '✂️ Services', Edu: '🎓 Education', Health: '🏥 Health', Tech: '💻 Tech & Media', Industry: '🏭 Industry', Energy: '⚡ Energy' }
export const PHASES = ['🌅 Morning', '☀️ Afternoon', '🌆 Evening', '🌙 Night']
// phase demand weights per category (sum = 1)
export const PHASE_W = {
  Food: [0.30, 0.25, 0.32, 0.13], Retail: [0.18, 0.34, 0.36, 0.12], Service: [0.22, 0.32, 0.34, 0.12],
  Edu: [0.28, 0.30, 0.36, 0.06], Health: [0.30, 0.30, 0.26, 0.14], Tech: [0.24, 0.34, 0.28, 0.14],
  Industry: [0.34, 0.38, 0.20, 0.08], Energy: [0.26, 0.28, 0.30, 0.16],
}
const B = (id, name, icon, cat, cost, rev, cogs, staff, wage, rent, util) => ({ id, name, icon, cat, cost, rev, cogs, staff, wage, rent, util })
export const BUSINESSES = [
  B('chai', 'Chai Stall', '☕', 'Food', 10000, 1800, 0.35, 1, 250, 120, 60),
  B('momo', 'Momo Corner', '🥟', 'Food', 25000, 4200, 0.38, 2, 280, 300, 120),
  B('dhaba', 'Dhaba', '🍛', 'Food', 75000, 11500, 0.40, 4, 300, 900, 350),
  B('restaurant', 'Restaurant', '🍽️', 'Food', 300000, 42000, 0.42, 8, 350, 3500, 1200),
  B('kirana', 'Kirana Store', '🏪', 'Retail', 40000, 6500, 0.55, 1, 280, 400, 100),
  B('mobileshop', 'Mobile Shop', '📱', 'Retail', 150000, 20000, 0.70, 2, 350, 1500, 300),
  B('boutique', 'Boutique', '👗', 'Retail', 120000, 15000, 0.45, 2, 320, 1300, 250),
  B('electronics', 'Electronics Showroom', '📺', 'Retail', 600000, 75000, 0.68, 5, 400, 6000, 1200),
  B('salon', 'Salon', '💇', 'Service', 60000, 8500, 0.25, 3, 330, 700, 300),
  B('carwash', 'Car Wash', '🚗', 'Service', 90000, 11000, 0.20, 3, 300, 800, 450),
  B('repair', 'Mobile Repair', '🔧', 'Service', 35000, 5500, 0.30, 2, 320, 350, 120),
  B('gym', 'Gym', '🏋️', 'Service', 250000, 22000, 0.10, 4, 400, 3000, 1500),
  B('tuition', 'Tuition Centre', '📚', 'Edu', 30000, 6000, 0.05, 2, 500, 400, 100),
  B('coaching', 'Coaching Institute', '🎯', 'Edu', 200000, 20000, 0.08, 5, 600, 2200, 400),
  B('playschool', 'Kids Play School', '🧸', 'Edu', 400000, 32000, 0.10, 8, 450, 4500, 800),
  B('computer', 'Computer Institute', '🖥️', 'Edu', 180000, 18000, 0.06, 4, 550, 1800, 600),
  B('pharmacy', 'Pharmacy', '💊', 'Health', 120000, 17000, 0.55, 2, 400, 1100, 250),
  B('dental', 'Dental Clinic', '🦷', 'Health', 350000, 28000, 0.20, 4, 700, 3200, 700),
  B('lab', 'Diagnostic Lab', '🔬', 'Health', 500000, 42000, 0.35, 6, 600, 4500, 1500),
  B('hospital', 'Hospital', '🏨', 'Health', 2500000, 260000, 0.40, 25, 800, 20000, 8000),
  B('appstartup', 'App Startup', '🚀', 'Tech', 500000, 35000, 0.05, 8, 1200, 5000, 800),
  B('ytstudio', 'YouTube Studio', '🎬', 'Tech', 80000, 9000, 0.10, 2, 600, 600, 300),
  B('gaming', 'Gaming Zone', '🎮', 'Tech', 160000, 15000, 0.08, 2, 350, 1600, 900),
  B('itagency', 'IT Services Agency', '🧑‍💻', 'Tech', 800000, 60000, 0.05, 12, 1300, 8000, 1200),
  B('bakeryf', 'Bakery Factory', '🏭', 'Industry', 600000, 68000, 0.50, 10, 450, 5000, 2500),
  B('garment', 'Garment Factory', '👕', 'Industry', 1200000, 130000, 0.55, 25, 400, 9000, 4000),
  B('furniture', 'Furniture Workshop', '🪑', 'Industry', 300000, 35000, 0.48, 6, 500, 2800, 900),
  B('printing', 'Printing Press', '🖨️', 'Industry', 220000, 26000, 0.45, 5, 480, 2000, 1100),
  B('evcharge', 'EV Charging Station', '🔌', 'Energy', 400000, 30000, 0.45, 1, 350, 3000, 500),
  B('solar', 'Solar Plant', '🌞', 'Energy', 1500000, 70000, 0.02, 3, 600, 6000, 800),
  B('petrol', 'Petrol Pump', '⛽', 'Energy', 2000000, 220000, 0.80, 6, 450, 8000, 2000),
  B('roplant', 'RO Water Plant', '💧', 'Energy', 280000, 26000, 0.30, 4, 400, 2400, 1300),
]
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
export const EVENTS = [
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

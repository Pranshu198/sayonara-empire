// Pass 3.5 Step 3 — engine unit tests (Vitest, dev-only; shipped bundle me kabhi nahi jata)
import { describe, it, expect } from 'vitest'
import { initialState, phaseTick, netWorth, fmt, sanitizeNums } from '../src/game/engine.js'
import { monthEnd } from '../src/game/engines/treasury.js'
import { festMultFor, ALL_FESTIVALS } from '../src/game/festivals/index.js'
import { landedCost, fxOf } from '../src/game/engines/logistics.js'
import { ALL_IMPORTS } from '../src/game/imports/index.js'

function chaiState() {
  const s = initialState()
  s.cash -= 10000
  s.biz['chai@india_delhi'] = { lv: 1, price: 1, stock: 100, staff: 1, profitToday: 0, profitTotal: 0, rating: 4.0, mktDays: 0, loc: 'india_delhi', employees: [] }
  return s
}

describe('tax (Treasury monthEnd)', () => {
  it('sirf us mahine ke profit par 10% tax, ek hi baar', () => {
    const s = initialState(); s.day = 30; s.monthProfit = 100000; s.cash = 500000
    monthEnd(s, fmt)
    expect(s.cash).toBeCloseTo(490000, 0)
    expect(s.lastTaxDay).toBe(30)
    expect(s.monthProfit).toBe(0)
    const c = s.cash
    monthEnd(s, fmt) // guard: dobara nahi katega
    expect(s.cash).toBe(c)
  })
  it('loss wale mahine me tax zero', () => {
    const s = initialState(); s.day = 30; s.monthProfit = -5000; s.cash = 100000
    monthEnd(s, fmt)
    expect(s.cash).toBe(100000)
  })
})

describe('receivables (85/15 cashflow split)', () => {
  it('phase me 15% udhaar banta hai, din khatm par settle', () => {
    const s = chaiState()
    const s2 = phaseTick(s)
    expect(s2.receivables).toBeGreaterThan(0)
    let cur = s2
    for (let i = 0; i < 3; i++) cur = phaseTick(cur)
    expect(cur.day).toBe(2)
    expect(cur.receivables).toBe(0)
  })
})

describe('EMI (loan monthEnd)', () => {
  it('EMI kat-ti hai, mahine ghate hain, aakhir me loan band + credit up', () => {
    const s = initialState(); s.cash = 1000000; s.credit = 700
    s.loan = { amount: 120000, emi: 11000, months: 2 }
    s.day = 30; monthEnd(s, fmt)
    expect(s.cash).toBe(1000000 - 11000)
    expect(s.loan.months).toBe(1)
    s.day = 60; monthEnd(s, fmt)
    expect(s.loan.amount).toBe(0)
    expect(s.credit).toBeGreaterThan(700)
  })
})

describe('festival boost', () => {
  it('sakriya tyohar par category multiplier > 1', () => {
    const f = ALL_FESTIVALS.find((x) => x.scope === 'global' && x.cats && Object.keys(x.cats).length)
    expect(f).toBeTruthy()
    const cat = Object.keys(f.cats)[0]
    expect(festMultFor(f.start, null, cat)).toBeCloseTo(f.cats[cat], 5)
    expect(festMultFor(f.start, null, 'NoSuchCat')).toBe(1)
  })
})

describe('import landed cost', () => {
  it('FX ±9% band me, container qty par per-unit sasta', () => {
    const L = ALL_IMPORTS.find((x) => (x.containerMinQty || 1000) <= 1000) || ALL_IMPORTS[0]
    const fx = fxOf(L.country, 10)
    expect(fx).toBeGreaterThanOrEqual(0.9); expect(fx).toBeLessThanOrEqual(1.1)
    const small = landedCost(L, 100, 10), big = landedCost(L, 1000, 10)
    expect(big.bulk).toBe(true)
    expect(big.total / 1000).toBeLessThan(small.total / 100)
    expect(big.total).toBeGreaterThan(0)
  })
})

describe('wages (staff + employees)', () => {
  it('employee ki tankhwah life.wages me judti hai', () => {
    const a = chaiState()
    const b = chaiState(); b.biz['chai@india_delhi'].employees = [{ salary: 12000, skillPct: 60, effPct: 60 }]
    const ra = phaseTick(a), rb = phaseTick(b)
    expect(rb.life.wages).toBeGreaterThan(ra.life.wages)
  })
})

describe('manager salary (Treasury)', () => {
  it('mahine par tankhwah kat-ti hai; na de pao to manager jata hai', () => {
    const s = initialState(); s.day = 30; s.cash = 100000
    s.managers = { finance: { role: 'finance', name: 'Test', salary: 20000 } }
    monthEnd(s, fmt)
    expect(s.cash).toBe(80000)
    expect(s.managers.finance).toBeTruthy()
    const s2 = initialState(); s2.day = 30; s2.cash = 0; s2.bank = 0
    s2.managers = { finance: { role: 'finance', name: 'Test', salary: 20000 } }
    monthEnd(s2, fmt)
    expect(s2.managers.finance).toBeUndefined()
  })
})

describe('stability guards (Pass 3.5)', () => {
  it('anjaan biz id wala purana save crash nahi karta', () => {
    const s = chaiState()
    s.biz['ghostbiz@india_delhi'] = { lv: 1, price: 1, stock: 50, staff: 1, profitToday: 0, profitTotal: 0, rating: 4, mktDays: 0, loc: 'india_delhi', employees: [] }
    expect(() => phaseTick(s)).not.toThrow()
  })
  it('sanitizeNums NaN/Infinity ko surakshit karta hai', () => {
    const s = chaiState(); s.cash = NaN; s.bank = Infinity; s.supplier = 0
    sanitizeNums(s)
    expect(Number.isFinite(s.cash)).toBe(true)
    expect(Number.isFinite(s.bank)).toBe(true)
    expect(s.supplier).toBe(1)
  })
})

describe('150-day headless sim', () => {
  it('600 phases, zero error, saare number finite, din 151', () => {
    let s = chaiState()
    for (let i = 0; i < 600; i++) {
      const o = s.biz['chai@india_delhi']
      if (o && o.stock < 30) o.stock = 100 // restock bot (cash check sim me saral)
      s = phaseTick(s)
    }
    expect(s.day).toBe(151)
    expect(Number.isFinite(s.cash)).toBe(true)
    expect(Number.isFinite(netWorth(s))).toBe(true)
    expect(s.life.rev).toBeGreaterThan(0)
  })
})

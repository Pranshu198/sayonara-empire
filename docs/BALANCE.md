# Sayonara Empire — Balance Constants & Pass 3.5 Playtest Notes

Playtest method: `scripts/sim-strategies.mjs` — 4 bot strategies × 150 days (600 phases) against the real engine, mirroring UI rules. Zero errors in all runs; every core number stayed finite.

## Sim results (150 days, after 3.5 fixes)

| Strategy | Net Worth | Lifetime biz profit | Branches | Verdict |
|---|---|---|---|---|
| Single stall (chai only) | ₹7.83 L | ₹1.92 L | 1 | Healthy baseline — patience pays, slowly |
| Franchise spam | ₹2.21 L* | **₹11.25 L** | **18** | Top earner; *NW looks low because the bot reinvests everything into branches, which NW values at 0.6–0.85× cost (illiquidity discount) |
| Import-heavy (naive) | ₹6.31 L | ₹6.73 L | 2 | Viable after fix (was ₹1.15 L — a trap). Still below the no-import control (₹9.82 L) when played naively every 5 days; imports are a *timed* tool (pre-festival), not an always-on one |
| Manager-heavy (4 managers, 2 biz) | ₹6.32 L | ₹9.78 L | 2 | Managers lift gross profit ≈ +50%, but ~₹5 L of salaries over 5 months eats it at small scale — they pay off as the empire grows. Working as designed |

## Bugs found & fixed in 3.5

1. **Atlas was dead content.** City cost/unlock were pure tier formulas ~100× too high: 398/399 cities needed ≥ ₹1.45 Cr NW (the prestige threshold!) before the *first* expansion. Rescaled by tier (below) in `cityIndex.js` + `cityExtra.js` — franchise sim went from 1 branch → 18 branches.
2. **Imports were a cash trap.** Catalogue `basePrice` is a real-world per-unit price, but game stock is an abstract 0–100 meter; a ₹1.9 L order returned 20 stock points. Fix: `IMPORT_ECON_SCALE = 0.05` in `engines/logistics.js` (landed cost now ≈ 3–4× a normal restock for the same stock — a premium, not a trap) and delivery stock conversion `qty/10 → qty/2` (cap 100) in `ImportPanel.jsx`.

## Core constants (source of truth = code)

- **Start:** ₹50,000 cash. Daily reward ₹750/day. Offline earnings: 20% of estimated daily profit per real hour away, capped 8 h.
- **Business P&L (per phase):** revenue = baseRev × phaseWeight × (1 + 0.18×(lv−1)) × price × elasticity × rating/market/event/stock factors × cityDemand × festivalMult × staffLeave × ceilingPenalty × importedTag(1.15) × employeeFactor(≤1.30) × season × prestigeMult × difficultyFactor (easy 1.15 / hard 0.90).
- **Costs:** COGS = revenue × cogs% × supplierIndex × contractMult; fixed daily (rent × cityRent + wages + utilities) ÷ 4 per phase; wastage by contract tier; branch staff wages salary/120 per phase.
- **Cashflow:** 85% of revenue lands immediately, 15% is receivables, settled next morning.
- **Stock:** burns phaseWeight × 26 per phase; restock cost = baseRev × cogs% × missing% × 0.9 + ₹10.
- **Branches:** 2nd+ branch of the same type costs 50%; NW/sell value = cost × (0.6 + 0.25×lv); upgrade cost = cost × 0.55 × lv, max lv 10.
- **Cities (new 3.5 ladder):** tier1 cost ₹25K / unlock ₹75K · tier2 ₹75K / ₹2L · tier3 ₹2.5L / ₹7.5L · tier4 ₹7.5L / ₹25L · tier5 ₹20L / ₹75L. Delhi free.
- **Tax:** month-end only (day % 30, guarded by lastTaxDay), 10% × taxStrict on *that month's* accumulated profit only.
- **Loan:** rate by credit score (750+ → 10%, 650+ → 13%, else 17%); EMI = amount × (1+rate) / 12 monthly.
- **Investments:** FD 7%/yr, SIP ~11%/yr, bonds ~7.5%/yr (daily accrual); property +6%/yr appreciation + monthly rent; stocks random-walk with sentiment.
- **Imports:** landed = base × FX(±9%) × 0.05 scale, +8% shipping, +duty%, container (qty ≥ 1000) −22%; delivery adds min(100, qty/2) stock; "Imported" tag = +15% demand for 14 days.
- **Managers:** monthly salary via Treasury at month-end; if cash+bank can't pay, the first manager leaves. HR appraisal +1% efficiency on day 30.
- **Rivals (3.5 reactive):** growth = g × rnd(0.4–1.6) × compAggro × reaction — reaction ×1.45 when the player is ahead of that rival (chase), ×0.8 when the player is below 25% of the rival (relax). Rank changes generate Sheher Times news.
- **Prestige:** needs NW ≥ ₹1 Cr; resets to ₹25K; permanent multiplier +0.25 per prestige.

## Pass 3.6 — Evolution model

- **Tiers (visual + perk):** Lv 1–4 Shuruaat · 5–9 Jamti Dukaan · 10–19 Brand · 20–34 Sheher ka Seth · 35+ Samrajya (`src/game/evolution.js`).
- **Level cap:** 10 → **50** (Samrajya reachable; upgrade cost formula unchanged: cost × 0.55 × lv per level, so Lv 35 costs ≈ 327× base cost cumulatively — a true long-term sink, not a shortcut).
- **Perk:** demand ×(1 + 0.01 × tierIndex), max **+4%** at Samrajya. Source: `evoDemandF()` in the phase revenue chain.
- **Spot-check (150-day, 4 strategies, after the change):** single-stall life profit ₹1.93L · franchise-spam ₹11.44L (18 branches — still top, same as 3.5, no new dominant strategy) · import-heavy ₹6.74L · manager-heavy ₹9.75L. Zero errors, zero negative-cash days. Engine tick 1.02 ms/phase (54 branches/216 staff).
- **NW note:** sell/NW value formula (0.6 + 0.25×lv) unchanged — at Lv 50 it values a business at 13.1× base cost vs ≈ 674× cumulative upgrade spend, so upgrade-to-sell arbitrage is impossible.

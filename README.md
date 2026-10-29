<div align="center">

<img src="docs/assets/banner.gif" alt="Sayonara Empire — animated splash" width="400" />

# SAYONARA EMPIRE

<img src="docs/assets/tagline.gif" alt="₹50,000 se shuruaat… poori duniya ka SAMRAJYA" width="640" />

**A giant Indian economy & business-tycoon simulator that runs entirely in your browser.**
Start with a single chai stall in Uttam Nagar, Delhi — end with businesses across **399 cities in 51+ countries**, AI managers running your operations, imports docking from Dubai and Shanghai, and a legacy the whole world reads about in the *Sheher Times*.

[![▶ Play the Live Game](https://img.shields.io/badge/▶_PLAY_LIVE-sayonara--empire-gold?style=for-the-badge)](https://pranshu198.github.io/sayonara-empire/)

![Live](https://img.shields.io/badge/status-live-brightgreen)
![React](https://img.shields.io/badge/React-19.3-61dafb)
![Vite](https://img.shields.io/badge/Vite-8.3-a855f7)
![Lines of Code](https://img.shields.io/badge/lines_of_code-475%2C299-blueviolet)
![Source Files](https://img.shields.io/badge/src_files-386-orange)
![Content Entries](https://img.shields.io/badge/content_entries-44%2C000%2B-red)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Screenshots (real, from the live build)

| Splash | Dashboard — Day 47 | Businesses & Procurement |
|---|---|---|
| <img src="docs/screenshots/splash.png" width="250" /> | <img src="docs/screenshots/dashboard.png" width="250" /> | <img src="docs/screenshots/businesses.png" width="250" /> |

| Markets + per-stock news | Wealth Empire | World Atlas — Gujarat |
|---|---|---|
| <img src="docs/screenshots/markets.png" width="250" /> | <img src="docs/screenshots/wealth.png" width="250" /> | <img src="docs/screenshots/atlas.png" width="250" /> |

---

## What is this?

Sayonara Empire is a **deep economy simulation game** built by a solo indie developer from Delhi, India — designed phone-first, in a pure AMOLED-black UI, with a Hinglish heart and a real accounting soul.

This is not a clicker. Every business runs on a **line-by-line Profit & Loss engine**: footfall × conversion × price on the revenue side; supplier COGS, wages with PF/ESI, rising rent, utilities, wastage and depreciation on the cost side. **Profit is not cashflow** — 15% of sales arrive as receivables the next day, loans take EMI, and tax is charged **only on that month's accumulated profit** at every guarded month-end (the famous "Day-30 freeze" of v1 is fixed by design and covered by an in-game 100-Day Test).

## The world is the board

- **World Atlas — 399 cities.** All 28 Indian states + 8 UTs (187 Indian cities, with districts for the big metros) and 212 world cities across 51+ countries — New York, London, Dubai, Singapore, Tokyo, Sydney, Toronto… Every city has a population tier, rent index, demand index, category strengths, climate flavour and a signature festival. Expand city-by-city (cost + net-worth gate), open businesses *there*, and watch that city's rent and demand flow straight into your P&L.
- **306 real festivals.** Diwali, Holi, Eid (×2), Pongal, Onam, Durga Puja, Ganesh Chaturthi, Chhath, Bihu, Rath Yatra — plus Chinese New Year, Halloween, Thanksgiving, Black Friday, Oktoberfest, Rio Carnival, Singles' Day and independence days. Festivals boost matching categories **only where you operate**, trigger corporate hamper orders, send staff on leave, print headlines, and show up on a 30-day lookahead calendar so you can stock up in time.
- **Procurement engine — 340 items.** Every input has several sellers side-by-side (local mandi, national distributor, company direct) differing in quality tier (Local / Economy / Premium / Branded), unit price, bulk slabs, delivery days, reliability % and payment terms. Your chosen contract changes COGS, wastage, complaint risk and your **price ceiling** in the live P&L.
- **Import system — 1,500 listings.** Buy from Atlas countries with the full landed cost shown *before* you confirm: base price × live FX + shipping + customs duty − container discount. Stock arrives days later (port delays happen), and earns the business a 14-day **"Imported" tag** that lifts demand.
- **AI Managers — 640 profiles, 8 roles.** Hire Purchase, Inventory, Pricing, Marketing, Finance, HR, Trading and Expansion managers. Set their rules (restock below X%, auto-sell at +Y%, keep cash above Z); they act every phase and **log every action** in an auditable Manager Activity Report. High skill = fewer mistakes. A bad manager *will* lose you money — and the report will honestly say so.

## Content depth (all real, all wired into the game)

| Library | Entries | Library | Entries |
|---|---:|---|---:|
| Random events | 6,600 | Customer stories | 8,100 |
| Newspaper headlines | 6,000 | Decision cards | 2,480 |
| Products | 5,760 | Staff pool | 4,200 |
| Missions | 1,982 | Collectibles | 1,950 |
| Angel startups | 1,800 | Movie studio slate | 1,500 |
| Import listings | 1,500 | Manager profiles | 640 |
| Cities | 399 | Procurement items | 340 |
| Festivals | 306 | Businesses | 32 |
| Encyclopedia terms | 370+ | Bulk achievements | 240+ |

Plus: a stock market (9 stocks + gold/silver/BTC/DOGE with per-stock news), property with rising values, a Business Bazaar (buy ready-made businesses, negotiate, list your own), a multi-bidder **Auction House** (including a Sniper and a Bluffer), 15 classes of wealth assets, collectibles trading, movie production, time capsules, a luxury ladder, charity, city projects, dynasty & heirs, prestige, and a Legacy Score that counts your cities and countries.

## How to play

1. **Buy a business** (Business tab — pick the city first; each city's rent/demand applies).
2. Time flows in 4 phases a day — **Manual** mode (Next Phase / End Day) or **Auto** (1x–8x). Set prices, restock before you hit zero, run marketing.
3. **Bank** your profit: FD, SIP, loans with real credit-score pricing (750+ → 10%).
4. **Expand**: unlock new cities in the Atlas, sign better procurement contracts, import premium stock.
5. **Automate**: hire managers, set rules, audit their report.
6. Month-end is safe: tax applies **only to that month's profit** — verify it yourself with *More → 100-Din Test*.

## The engine suite

Fifteen documented simulation engines (`src/game/engines/`), each with real inputs and outputs, composed by the core economy engine:

Demand · Price Elasticity · Procurement/Supply · Import/Logistics · Labour/HR · Automation (AI-Manager) · Credit · Market · Property · Festival · Location/Atlas · Rival AI · Customer/Reputation · Cashflow/Treasury · Risk/Insurance

**P&L per phase, per business:**
`Revenue = Base × PhaseWeight × Level × Price × Elasticity(price) × Rating × Marketing × Event × Stock × LocationDemand(city, category) × Festival(city, category, day) × StaffLeave × PriceCeiling(contract quality) × ImportedTag × Season × Prestige × Difficulty`
`Profit = Revenue − COGS(supplier index × contract) − Fixed(staff wages + city-scaled rent + utilities + depreciation) − Wastage(quality)`

## Performance, honestly

475k lines would be a brick without code-splitting. The build splits into **143 chunks**: vendor separately, all heavy panels (Wealth, Bazaar, Auction, Atlas, Managers, Imports, Procurement…) as `React.lazy` chunks, the entire World Atlas geography as per-region lazy modules, and 84 deep-content files streaming in behind the splash. Entry chunk: **482,901 → 419,297 bytes gzip (−13%)** versus the 104k-line Pass 2 build — smaller *and* 4.5× the content.

## Architecture

```
src/
  App.jsx                 — shell, tabs, HUD, time control
  components/             — panels (most are lazy chunks)
  game/
    engine.js             — core economy loop (phases, day-end, month-end)
    engines/              — the 15-engine suite
    atlas/                — cityIndex (static) + india/*.js + world/*.js (lazy profiles)
    festivals/            — 306 festivals, per-region data + calendar logic
    procurement/          — 340 items × multi-seller contracts
    imports/              — 1,500 listings by continent
    managers/             — 640 profiles, rule templates
    content/              — the big libraries (events, customers, news, …)
    deepLoader.js         — streams 84 deep content files after first paint
```

## Tech stack

React 19 · Vite 8 · Framer Motion · pure CSS (AMOLED design system) · localStorage saves (export/import codes) · GitHub Pages hosting. No backend, no tracking, no ads — the whole empire runs on the player's phone.

## Roadmap

- Per-district businesses inside metro cities
- Multiplayer Rich List (friends' empires)
- Festival special-edition product lines & seasonal story arcs per region
- Manager careers: XP, promotions, poaching by rivals

## Contributing & license

Built solo in Delhi with a phone and stubbornness. Issues and ideas welcome — open an issue. Code is under the **MIT License** (see `LICENSE`).

<div align="center">

*Ek chai stall se duniya tak — ye safar abhi baaki hai.* ☕🌍

**[▶ Play now — pranshu198.github.io/sayonara-empire](https://pranshu198.github.io/sayonara-empire/)**

</div>

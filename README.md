<div align="center">

<img src="docs/assets/banner.gif" alt="Sayonara Empire — animated splash" width="400" />

# SAYONARA EMPIRE

<img src="docs/assets/tagline.gif" alt="₹50,000 se shuruaat… poori duniya ka SAMRAJYA" width="640" />

**A giant Indian economy & business-tycoon simulator that runs entirely in your browser.**
Start with a single chai stall in Uttam Nagar, Delhi — end with businesses across **399 cities in 51+ countries**, AI managers running your operations, imports docking from Dubai and Shanghai, and a legacy the whole world reads about in the *Sheher Times*.

[![▶ Play the Live Game](https://img.shields.io/badge/▶_PLAY_LIVE-sayonara--empire-gold?style=for-the-badge)](https://pranshu198.github.io/sayonara-empire/)

![Live](https://img.shields.io/badge/status-live-brightgreen)
![PWA](https://img.shields.io/badge/PWA-installable-5a0fc8)
![React](https://img.shields.io/badge/React-19.3-61dafb)
![Vite](https://img.shields.io/badge/Vite-8.3-a855f7)
![Lines of Code](https://img.shields.io/badge/lines_of_code-477%2C488-blueviolet)
![Source Files](https://img.shields.io/badge/src_files-415-orange)
![Content Entries](https://img.shields.io/badge/content_entries-44%2C000%2B-red)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Screenshots (real, from the live build)

| The app on desktop — device frame | The app on phone — swipe tabs, pill nav |
|---|---|
| <img src="docs/screenshots/app-frame.png" width="420" /> | <img src="docs/screenshots/app-home.png" width="250" /> |

| Splash | Dashboard — Day 47 | Businesses & Procurement |
|---|---|---|
| <img src="docs/screenshots/splash.png" width="250" /> | <img src="docs/screenshots/dashboard.png" width="250" /> | <img src="docs/screenshots/businesses.png" width="250" /> |

| Markets + per-stock news | Wealth Empire | World Atlas — Gujarat |
|---|---|---|
| <img src="docs/screenshots/markets.png" width="250" /> | <img src="docs/screenshots/wealth.png" width="250" /> | <img src="docs/screenshots/atlas.png" width="250" /> |

| Stats / Analytics — live rates, lifetime, records |
|---|
| <img src="docs/screenshots/stats.png" width="250" /> |

| My Empire HQ — brand rollup, branches | HQ Detail — per-branch P&L & control | Staff — CV Team (hire/train/promote) |
|---|---|---|
| <img src="docs/screenshots/hq.png" width="250" /> | <img src="docs/screenshots/hq-detail.png" width="250" /> | <img src="docs/screenshots/hq-cv.png" width="250" /> |

| UI in Hindi (Devanagari) | UI in Urdu (Roman) | UI in Arabic (RTL) |
|---|---|---|
| <img src="docs/screenshots/hindi.png" width="250" /> | <img src="docs/screenshots/urdu-roman.png" width="250" /> | <img src="docs/screenshots/arabic.png" width="250" /> |

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
- **Stats / Analytics command center.** A dedicated tab (own SVG icon) with live rate meters — income/sec, burn/sec and net/sec derived honestly from the engine's actual recent P&L (in Manual mode they switch to per-phase units), a burn breakdown by wages/rent/COGS/utilities/wastage/interest, lifetime counters (income, expenses, taxes paid, wages paid, estimated customers & items, best/worst day, biggest expense day), an empire snapshot (branches, cities, countries, staff, portfolio, net-worth chart, profit-share donut by category, top-5 cities), and records — milestone days for ₹1L/₹10L/₹1Cr+, profit streaks, rival rank and Legacy score. Lifetime counters are persisted in the save and, on older saves, honestly start counting from the day the feature arrived.

## Pass 3.2 — HQ, people, languages & polish

- **My Empire HQ (new tab).** Only *your* running businesses live here — grouped by brand with a profit rollup, every branch as its own card (city, level, rating, stock, staff, today's profit). Open a branch for its full HQ detail: P&L rows, price slider, restock/upgrade/marketing/sell, its own procurement contracts, franchise expansion, staff and auto-buy rules.
- **Franchise — true multi-location.** The same brand can run in many Atlas cities at once (each branch = its own staff, stock, P&L and city rent/demand; setup cost 50% of the business price, no branch limit but your cash). Old saves migrate automatically: every existing business becomes a branch in its city.
- **Deep staff with CVs.** Per-branch hiring from a 4,200-profile candidate library. Every CV shows name, role, skill %, efficiency %, experience, expected salary, trait and past employer — hire (25% signing), train, promote, raise or fire. Staff are real in the engine: their wages are a P&L cost line and their average quality moves revenue (capacity scales with level — a Lv 3 stall seats 20).
- **Auto-Stock Officer + HR Manager.** A Stock Officer hired *inside* a branch auto-buys its material by your rules (target stock %, max unit price, seller preference, imports allowed) and logs every purchase. The HR Manager improves the candidate pool, value-sorts the CV shortlist, can auto-hire under a salary cap, and runs morale + Day-30 appraisals.
- **Zero emojis — own icon library.** Every icon in the app is a hand-built stroke SVG from the in-house set (`src/components/icons/`, ~48 icons); generated text is sanitised before display. Grep-verified: **zero emoji characters in the entire `src/` tree**.
- **19 languages.** A real `t(key)` i18n system (`src/i18n/`, one lazy file per language): English, Hindi (Devanagari), Hinglish, **Urdu (Roman)** — Hinglish-style, Urdu script, Arabic (full RTL layout), French, Russian, Spanish, Portuguese, German, Bengali, Punjabi, Marathi, Tamil, Telugu, Chinese, Japanese, Korean. Searchable picker in Settings, browser auto-detect, instant switch, per-script fonts. Menus/labels/buttons/time/stats fully translate; the deep story/news libraries stay in their original language (stated honestly in Settings → About).
- **Card design system + ultra polish.** One card family (Base/Stat/Business/Asset/Person/Listing/Metric) with a shared anatomy — icon slot, title, subtitle, value zone, trend chip, action row — in flat/elevated/glass/glow/danger/success variants, an 8-pt spacing rhythm, radius scale 16/20/24, tabular numbers, skeleton shimmer for lazy panels, designed empty states and card-style toasts across every tab.
- **Heavy optimization, same quality.** Initial JS is **420 KB gzip total** (index + vendor + shared engine chunks, 184 chunks overall) after slimming the always-loaded content base pools and streaming the rest behind the splash via the deep loader; saves are debounce-throttled (1.5 s + flush on hide/close) instead of a full stringify per change; the Atlas windows long lists (40/page); a Performance Mode (Settings → Advanced, auto by FPS) trims particles on weak devices *without touching the design*. Engine perf, simulated in Node with a 54-branch / 216-staff empire: **1.6 ms per phase** (400 phases, zero errors). Headless verification of the final build: **all 9 tabs + HQ + CV + 5 language UIs — zero console errors, zero horizontal overflow at 390 px.**

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

## Install as an App (PWA)

Sayonara Empire is a full **Progressive Web App** — it installs like a native application, with its own gold-crown icon, fullscreen standalone launch (no browser chrome), offline play via a versioned service-worker app shell, and native-style touches throughout: swipe left/right to change tabs, a pill-indicator bottom navigation, safe-area-aware chrome, a device-frame presentation on desktop, and an in-app **Install** chip when your browser offers installation.

**Android / Chrome:** open the live game → tap **Install** on the chip (or ⋮ menu → *Add to Home screen* / *Install app*).
**iPhone / Safari:** open the live game → Share → *Add to Home Screen*.
**Desktop Chrome/Edge:** click the install icon in the address bar.

Once installed it launches fullscreen from your home screen and keeps working offline — your save lives on your device.

## Pass 3.3 — a real mobile application

- **Native app shell.** The web-page frame is gone: on phones the game is full-bleed edge-to-edge; on desktop/tablet it presents centred in a rounded device column (430 px) over an ambient purple/gold backdrop, with the tab bar docked inside the frame.
- **PWA plumbing.** Web app manifest (standalone, portrait, AMOLED `#000000` theme), generated icon set (192 / 512 / maskable / apple-touch, from the game's own crown-S monogram), and a hand-rolled service worker — network-first navigations so new deploys land instantly, cache-first hashed assets, old caches purged by version (`v3.3.1`). Verified: SW registers and activates, and the game **reloads fully offline**.
- **Native interactions.** Swipe gestures switch tabs (inputs/sliders/modals are exempt), overscroll/pull-to-refresh is contained inside the app, UI chrome is non-selectable with no tap highlight or tap delay, scrollbars are hidden, and every press keeps the haptic-style micro-scale feedback.
- **Verified like before.** Headless run of the final build: all tabs + HQ + Stats — **zero console errors, zero horizontal overflow at 390 px**, swipe Empire → Business confirmed, desktop frame renders at exactly 430 px.

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

477k lines would be a brick without code-splitting. The build splits into **184 chunks**: vendor separately, all heavy panels (Wealth, Bazaar, Auction, Atlas, Managers, Imports, Procurement…) as `React.lazy` chunks, the entire World Atlas geography as per-region lazy modules, and 84 deep-content files streaming in behind the splash. Initial JS actually downloaded on first load: **419,962 bytes gzip** (index + vendor + shared, measured on the Pass 3.3 build) — essentially unchanged from the 104k-line Pass 2 build while carrying 4.5× the content, and the service worker caches the shell so repeat launches are near-instant.

## Architecture

```
index.html                — PWA meta, manifest + icon links
public/
  manifest.webmanifest    — standalone PWA manifest (portrait, #000 theme)
  sw.js                   — versioned app-shell service worker (offline)
  icon-*.png              — generated crown-S app icons (192/512/maskable/apple)
src/
  App.jsx                 — shell, tabs, HUD, time control, swipe nav, install chip
  app-shell.css           — native app framing, pill nav, overscroll, safe areas
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

React 19 · Vite 8 · Framer Motion · pure CSS (AMOLED design system) · PWA (manifest + service worker, offline) · localStorage saves (export/import codes) · GitHub Pages hosting. No backend, no tracking, no ads — the whole empire runs on the player's phone.

## Roadmap

- Per-district businesses inside metro cities
- Multiplayer Rich List (friends' empires)
- Festival special-edition product lines & seasonal story arcs per region
- Manager careers: XP, promotions, poaching by rivals

## Contributing & license

Built solo in Delhi with a phone and stubbornness. Issues and ideas welcome — open an issue. Code is under the **MIT License** (see `LICENSE`).

<div align="center">

*Ek chai stall se duniya tak — ye safar abhi baaki hai.*

**[▶ Play now — pranshu198.github.io/sayonara-empire](https://pranshu198.github.io/sayonara-empire/)**

</div>

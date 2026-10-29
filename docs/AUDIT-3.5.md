# Pass 3.5 — Honest Design/Code Audit (Step 0)

Method: README + App.jsx + app-shell.css + cards system + engine.js + engines/ + deepLoader.js + sw.js read line-by-line; live build screenshotted headless at 390px (all 9 tabs) and 1280px desktop. Baseline metrics: **477,497 lines / 415 src files, initial JS gzip 304,002 B (JS-only method), 197 chunks, engine ~1.1 ms/phase**.

## Top 20 issues, ranked by impact

1. **Home is not a command centre.** The first screen is *Time Control* — a settings widget. No net-worth hero, no sparkline, no "today's profit", no alerts, no suggested next action. The most valuable screen real-estate sells the least valuable content.
2. **Zero onboarding.** A new player lands with ₹50K and 9 tabs of systems. Nothing says "buy a chai stall first". First-session funnel is invisible.
3. **Home's core strings ignore the chosen language.** Day Report, time-control explainer, receivables label etc. are hardcoded Hinglish even when English/French/Arabic is selected — the 19-language promise breaks on the most-seen screen.
4. **No "while you were away" summary.** Offline earnings arrive as a 2.6-second toast. A returning player gets no recap of hours away / what was earned.
5. **Nothing surfaces "needs action".** Low stock, claimable missions, unclaimed daily reward/spin, idle cash, EMI month — the player must hunt through 9 tabs to discover them.
6. **Prestige has NO confirmation.** One tap on "Prestige (₹1Cr NW)" wipes the run. Meanwhile Reset asks twice (native `confirm()` in one section, typed RESET in Settings) — irreversible-action UX is inconsistent exactly where it matters most.
7. **Header wastes vertical space.** Brand wraps to two lines next to a cramped dayline; the three money boxes duplicate what one hero card could communicate with trend + sparkline.
8. **Save fragility.** One localStorage key, no last-good backup. A single corrupt/partial write = total progress loss. No integrity check on import either — a truncated paste fails with a vague toast or imports garbage.
9. **No service-worker update flow.** The SW `skipWaiting()`s silently; users never learn a new version arrived, and a stale shell can linger with no "Refresh" affordance.
10. **Rival AI is a blind random walk.** `growRivals` never looks at the player. The Rich List has no drama: nobody chases you, nobody reacts when you overtake them.
11. **Profit swings are unexplained in the moment.** The Day Report shows totals only. *Why* profit moved (festival? rent? wages? price elasticity?) is never stated as cause → effect where the player is looking.
12. **Stats burn-breakdown scans badly** (label stacked over value) and there is **no P&L waterfall** — the single best "where did the money go" visual is missing.
13. **Long lists lack search/sort.** Business catalogue (32 types × branches) has category chips only; a returning player with 20 branches can't find one fast. (Atlas paginates; Bazaar/Auction/CV lists are short enough today.)
14. **Number format is India-only.** Short/full Indian formats exist; the 19-language audience gets no international (K/M/B) option.
15. **No haptics.** Sound exists; tactile feedback (the cheapest "native feel" win on phones) is absent, and there's no setting for it.
16. **Accessibility gaps.** Tab buttons lack `aria-label`/`aria-current`; section toggles lack `aria-expanded`; the install-chip close is a raw text glyph instead of the in-house `x` icon.
17. **Stability landmine in `phaseTick`:** `bizDef(id)` can return `undefined` for a business id an old save carries but the current data no longer has → `PHASE_W[d.cat]` throws and the game hard-crashes every tick. No NaN/Infinity sanitisation anywhere either.
18. **StatsPanel re-renders wholesale every 1s** for its rate ticker (whole-panel `setTick`), churning a 198-line panel on low-end phones.
19. **Tab bar is crowded** (9 tabs, 10px labels) with a subtle active state and **no badge dots** for claimable rewards (daily reward, spin, missions sit unclaimed invisibly).
20. **Desktop:** the 430px frame is fine, but there are **no keyboard shortcuts** (space/→ for next phase is the obvious one) — cheap, expected on desktop.

## What is already good (don't break)
Initial JS 304 KB gzip with disciplined lazy panels; card design system with tokens started (cards.css); collapsible sections with persisted state; guarded month-end tax (Day-30 fix); receivables cashflow split; versioned SW caches; zero-emoji SVG icon set (~66 icons); save migration fills defaults for missing keys; `content-visibility` for scroll perf; perf-mode FPS guard.

# SUGGESTIONS — site vs SPEC.md

> Review of the landing page (`index.html`, `README.md`) against `SPEC.md`. Nothing here is applied. Pick what you want and I'll make the edits.

---

## 🎯 PURPOSE

The site was written before the spec. It's mostly right on the big idea (invite-a-player, friends stay vanilla) but it describes the *bot* in ways the spec has since ruled out. Below: contradictions, gaps, ready-to-paste copy, non-copy concerns, and open questions.

---

## ❌ WHERE THE SITE CONTRADICTS THE SPEC

| Site says | Spec says | Suggested fix |
|---|---|---|
| Hero: "no BepInEx, no plugin roulette" | BepInEx **does** run — on the bot host only. Friends stay vanilla. | "no BepInEx **on your machine**, no plugin roulette" |
| Step 03: "Local-LLM-biased planner — follow, gather, fight, chat" | 🚨 LLM in the movement loop = project death. Follow/gather/fight are C# (Reflex 60 Hz, Tactical 1 Hz). LLM only in the Mind. | Rewrite step 03. Say the model talks and plans; code moves and fights. |
| Step 03: "Point it at wood, deer, or a portal" | Commands are pings first (middle-click), then ~10 Levenshtein-matched verbs. No LLM in commands. | Describe pings + verbs. |
| Step 02: "Send a join code from the site. Palheim boots a real player client on our bot host" | **Now:** second PC, second Steam account. Hosted = Phase 5, optional. | Keep the invite framing, but say "a real client on its own license" and mark hosting as later. |
| Roadmap Now: "gather/follow/fight that doesn't embarrass us" | ▶️ Next action is **Phase 0** — five scripted moves + stamina drop. | Map Now / Next / Later to phases 0–1 / 2–3 / 4–5. |
| Roadmap Later: "Monetize after the Viking carries wood" | Open source, zero features held back. Sell operations, not features. | Reword. |
| Meta + OG description: "Dogfooding now." | Phase 0 not passed yet. | "Building in the open." |
| README product lock: "No BepInEx product path" | BepInEx is the toolchain, just never shipped to players. | "BepInEx only on the bot host — never shipped to players." |
| README status: "Private dogfood · Valheim 1.0" | Verified against 1.0.7 (nv 39). Phase 0 next. | "Phase 0 (seam proof) · Valheim 1.0.7" |

---

## ➕ WHAT THE SPEC SAYS THAT THE SITE DOESN'T

- 🏗️ **Three tiers** — Reflex 60 Hz / Tactical 1 Hz / Mind event-driven. This is the strongest technical differentiator on the page and it's absent. → New section **"How it thinks"** between *How it works* and *Why not a mod*.

- 🛡️ **Defensive stance is the default.** Over-eager bots pull mobs; #1 uninstall cause. → "How it thinks" + roadmap Next.

- ⏱️ **~200 ms reaction delay + miss rate. Never spawns items. Never teleports.** Pre-empts the "is it a cheat?" question. → FAQ.

- 🆓 **Open source. Self-host free. Zero features held back.** Sell pooling, reconnects, hosted model, voice. → FAQ + roadmap Later.

- 🛑 **Spoiler gating** keyed to server global keys (`defeated_eikthyr` …), enforced mechanically, not by prompt. → FAQ.

- 🚪 **"Fine to walk away from."** No streaks, no guilt, no retention mechanics. Priority: solo players, then accessibility. → Hero micro-proof or *Why* section. It's a values statement; it earns trust.

- 🖥️ **Real client, real license. Not screen-reading, not a wire-protocol clone.** → *Why not a mod* (one sentence).

- 📍 **Pings outrank chat.** Middle-click is vanilla, synced, zero-install, zero-token. → Step 03.

---

## ✍️ PROPOSED COPY (ready to paste)

### Meta / OG description
> An AI companion that joins Valheim as a real multiplayer player. Friends stay vanilla. Local-first brains. Building in the open.

### Hero subhead
> Palheim joins your server as a multiplayer player. Your friends keep their vanilla clients — no BepInEx on your machine, no plugin roulette.

### Hero micro-proof
> Great to play with. Fine to walk away from. No streaks, no guilt. Bootstrap, not vapor.

### How it works

**01 — Host like normal** *(unchanged)*
> Run Valheim the way you already do — dedicated server or friends' session. No client mods required on anyone's machine.

**02 — Invite Palheim**
> A real Valheim client on its own license walks in as a peer. Today that's our second PC and a second Steam account. Hosted invites come later.

**03 — Play with a teammate**
> Middle-click ping the ground: it goes there. Ping a creature: it fights it. Say *follow*, *stay*, *home*, *peace*. Reflexes and tactics are plain code. The language model only talks and plans.

### NEW section — `#mind` "How it thinks" (kicker: *Three tiers*)

Three cards (reuse the roadmap grid styling):

**⚡ Reflex · 60 Hz · code**
> Block, parry, dodge, attack timing, stamina, footing. Behaviour tree. No language model.

**🎯 Tactical · 1 Hz · code**
> Follow, engage, chop, mine, haul, retreat, eat, claim a bed. Utility scoring. No language model.

**💬 Mind · event-driven · LLM**
> Chat, jokes, memory, planning. Wakes on death, chat, ping, biome change, boss key. Never in the movement loop.

Paragraph under the cards:
> Defensive stance by default: it only fights what's attacking you or it. It reacts about 200 ms late and misses sometimes, on purpose. It never spawns items and never teleports.

### Why not another NPC mod — add one sentence after the existing two
> Not screen-reading, not a wire-protocol clone: a real client, a real license, driven by code.

### Roadmap

**Now — Prove the seam**
> Five scripted moves, stamina drops, an hour connected. Then follow, eat, claim a bed.

**Next — Stances and commands**
> Defensive by default. Pings, then ~10 spoken verbs. No model needed to obey.

**Later — The Mind, then hosting**
> Event-driven chat and planning. Spoiler gating from your boss keys. Everything open source — we sell hosting and voice, not features.

### FAQ — change one, add three

**Cloud AI bill?** *(replace)*
> Local model first. The language model only wakes on events, with a hard per-session token cap.

**Open source?** *(new)*
> Yes. All of it. Self-host free, zero features held back. We sell operations: pooling, reconnects, hosted model, voice.

**Will it spoil the game?** *(new)*
> Spoiler gating is mechanical, keyed to the bosses your server has actually beaten. Not a prompt promise.

**Is it a cheat?** *(new)*
> No. Reaction delay and a miss rate on purpose. It never spawns items and never teleports.

### README

- Product lock 3 → "**BepInEx on the bot host only** — never shipped to players"
- Sections list → insert "How it thinks" after "How it works"
- Status → "Phase 0 (seam proof) · Valheim 1.0.7"
- Add: `## Spec` — "Product and build spec lives in [SPEC.md](SPEC.md). Site copy follows it."

---

## ⚠️ CONCERNS BEYOND COPY

- 📝 **Waitlist is a localStorage stub.** No backend. The CTA says "Get early access" and stores the email in the visitor's own browser. Fine for now, but every signup is lost. Cheapest real fix: a Formspree / Buttondown / Google Form POST. One line of `main.js`.

- ⚖️ **Steam ToS is a real risk** (spec says so). Keep the FAQ's "no magic promises" line. Don't add anything that reads like a guarantee of account safety.

- 📧 **Talk to Iron Gate early.** The footer disclaimer is good. Consider it before the waitlist goes public, not after.

- 🔁 **Cache-busters.** `styles.css?v=4` and `main.js?v=4` in `index.html`. Bump on every CSS/JS change or Pages visitors get stale files.

- 🔗 **Nav is duplicated** in `.nav` (desktop) and `#mobile-nav` (mobile). A new section link must go in both or one menu silently lacks it.

- 🖼️ **Hero images are ~180 KB each**, loaded as CSS backgrounds. Fine, but a `<link rel="preload">` for the correct one would cut the flash on mobile.

- 🏷️ **Spec title still says "VALHEIM AI COMPANION".** Spec itself says rename for trademark. Harmless in a private repo; rename the heading before the repo goes public.

---

## ❓ OPEN QUESTIONS

1. Roadmap: keep the current "private play now" framing, or move to the honest Phase 0 framing above?
2. Add the "How it thinks" section (six sections instead of five), or fold the three tiers into step 03?
3. Hero micro-proof: swap in the "fine to walk away from" line, or keep "First on our own dedicated server"?
4. Wire the waitlist to a real endpoint now, or leave the stub until Phase 1 lands?

---

**TLDR:** the site's promise is right; its description of *how* is wrong in three places (LLM drives movement, gather/fight is "now", monetize features). Fix those, add the three-tier story, and the page matches the spec.

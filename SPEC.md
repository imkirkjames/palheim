# VALHEIM AI COMPANION — BUILD SPEC v1

> 🤖 Written for an AI implementer. No prior context assumed. Terse by design.

---

## 🎯 WHAT

AI-driven second player in Valheim.

Follows you. Fights beside you. Carries your stuff. Talks.

**Not** an NPC. **Not** a traditional game bot.

A **player emulator** — real client, real license, driven by code.

---

## 🧭 WHY

Valheim is a co-op game. Millions own it. Many have nobody to play with.

Priority order, fixed:

1. 👥 Playable for people alone
2. ♿ Accessibility — corpse runs, ore hauling, limited time, chronic pain, motor differences
3. 🔧 QoL + mod discovery
4. 📖 Post-endgame content
5. 💰 Money — last, not a design driver

🚪 Design rule: great to play with, **fine to walk away from**.

No streaks. No guilt. No retention mechanics.

---

## 🏗️ ARCHITECTURE

### The seam

`Player.SetControls()` — every human input funnels through it.

Drive that method → you are a player.

⚠️ Signature is version-volatile. **Bind by reflection, by parameter name.** Never hardcode.

Known params (0.217-era, verify): `movedir, attack, attackHold, secondaryAttack, block, blockHold, jump, crouch, run, autoRun, dodge`

### Patch target

`Postfix` on `Player.Update`.

Runs after game polls `ZInput` → our values win.

🔁 Fallbacks if input ignored: `Player.FixedUpdate`, `Player.LateUpdate`.

🔑 On bot machine nobody touches keyboard → `ZInput` returns zeros → nothing to fight.

### Three tiers — split by tick rate

⚡ **Reflex — 60Hz — C#**
Block, parry, dodge, attack timing, stamina, footing.
Behavior tree. **No LLM.**
~90% of "feels like a real teammate."

🎯 **Tactical — 1Hz — C#**
Follow, engage, chop, mine, haul, retreat, heal.
Utility scoring. **No LLM.**

💬 **Mind — event-driven — LLM**
Chat, jokes, planning, memory, intent parsing.
Latency budget 2–5s. Human voice-chat speed. Fine.

🚨 **LLM in the movement loop = project death.** Never.

### Event triggers for the Mind

Not a timer. Timer = ~700 calls/hr = cost death.

Fires on: death, chat message, ping, biome change, boss key, long idle, combat end.

Per-session token budget. Hard cap.

### Data flow

```
Mind (LLM, seconds)
  ↓ structured command → queue
Tactical (C#, 1Hz)
  ↓ intent → ControlState
Reflex (C#, 60Hz)
  ↓ ControlState
ControlSurface.Apply() → Player.SetControls()
```

🔒 Only `ControlSurface` ever touches the game. Everything upstream writes `ControlState`.

---

## 🖥️ DEPLOYMENT

**Now:** second PC, normal client, second Steam account.

**Later:** `-batchmode -nographics` on Linux. Same plugin. Untested — 30-min experiment.

**Not doing:** wire-protocol reimplementation. Shelved, not dead.

**Never:** screen-reading + input emulation. Needs GPU. Rejected.

### Test rig

- 🎮 Windows + GeForce → human client
- 🐧 Strix Halo Linux → dedicated server + bot client + local model

Dedicated server, not P2P. Bot stays connected when human logs off.

---

## 🔧 TOOLCHAIN

✅ Verified against Valheim 1.0.7 (network version 39), 2026-09-10:

- 📦 BepInExPack_Valheim **5.4.2350** (BepInEx 5.4.23.5, Mono)
- 🎯 `net462` class library
- 🔨 HarmonyX (via BepInEx)
- 🔓 Assembly publicizer over `assembly_valheim.dll` — most members are private
- 📁 Reference `valheim_Data/Managed/*.dll`

🐧 Linux: `libdoorstop_x64.so` built vs glibc 2.34 (Ubuntu 22.04 / Debian 12).

⚠️ Plugin version string must be plain semver. No `-beta` suffix.

📚 Reference impl: `Grantapher/ValheimPlus` — working HarmonyX mod on 1.0.7.

📚 Source diffs: `HSValhiem/Valheim-Sourcecode-Changes`.

🚫 Never redistribute game DLLs, publicized DLLs, or decompiled code.

---

## 📶 PHASES

Each has one hard pass/fail test.

### Phase 0 — Seam proof 🔌

Scripted 5-move sequence. No AI.

walk → jump → attack → block(hold 2s) → sprint

✅ **Pass:** all five visibly happen, **and** stamina drops on jump/attack/block/sprint.

Stamina is the tell — proves input was *processed*, not just animated.

👀 Watch from the **other** client too. Moves locally but not remotely = ZDO sync problem, different bug.

### Phase 0.5 — Stability 🔗

Client connects, stays connected 1 hour.

Auto-join on launch. Reconnect with backoff.

`Application.runInBackground = true` — **load-bearing**, unfocused Unity throttles to ~zero.

### Phase 1 — Follow 🐕

Beeline. Face target, walk at it, stop inside radius.

No pathfinding. Deliberate.

Unstick: moved < 0.02m while trying to move for >1s → jump.

Also in phase 1:
- 🍖 **Eat on buff expiry.** Unfed = ~25 HP, minimal stamina regen. Bot is a liability without this.
- 🛏️ **Claim a bed.** Else every death → starting stones → you walk across the map.

### Phase 2 — Defensive stance 🛡️

Three stances:
- 🕊️ **Peaceful** — never initiates, flees
- 🛡️ **Defensive** — engages only what's attacking you or it ← **DEFAULT**
- ⚔️ **Aggressive** — engages anything hostile in radius

Defensive default matters. Over-eager bot pulls extra mobs. Worse than no bot. #1 uninstall cause.

⏱️ **Add ~200ms reaction delay + miss rate.** Frame-perfect parry reads as a cheat and isn't fun.

### Phase 3 — Commands 🎮

📍 **Pings first, chat second.**

Middle-click sends a world position over the wire. Vanilla, synced, zero-install, zero-token.

- Ping ground → go there / hold there
- Ping creature → kill that

🔤 Then ~10 fuzzy-matched verbs: follow, stay, wait, come, home, peace, defend, attack, stop, carry.

🚫 **No LLM in commands.** Levenshtein match. Zero latency, zero cost.

Model outage → bot goes quiet but stays obedient.

### Phase 4 — The Mind 🧠

Event-driven LLM. Chat, jokes, memory, planning.

Separate process. Local HTTP. Iterate prompts without restarting the game.

Observation format = compact text scene, MUD-style. ~400 token budget.

Biome, time, weather, human pos/health, nearby entities + distances, inventory delta, recent events.

🎯 Getting the observation right matters more than model size.

Grammar-constrained JSON output. It picks from ~12 verbs, not writing prose.

### Phase 5 — Hosted ☁️ (optional)

Only if sharing beyond personal use.

---

## 🎭 THE MIND — DESIGN

### Humour

👀 The bot **witnessed** it. Level-one Greydwarf. Full HP. Third try, same camp.

🎯 Specificity is the joke. Generic banter isn't funny.

🔇 Spice slider controls **frequency**, not sharpness. Silence makes lines land.

❤️ **Never mock a real bad run.** Repeated failure → tone flips from roast to help.

⚰️ Death detection: **tombstone ZDO spawn**. Carries owner name + location. Definitive.

Damage-RPC proximity inference = fallback for *near*-deaths only.

📼 Log deaths/failures as **structured events from day one**. Can't reconstruct later.

### Wiki + spoilers

🔓 **Progression gating, mostly automatic.**

`ZoneSystem` global keys are server-synced: `defeated_eikthyr`, `defeated_gdking`, `defeated_bonemass`, `defeated_dragon`, `defeated_goblinking`, `defeated_queen`, + Deep North.

⚠️ **Correction:** `m_knownRecipes`, `m_knownMaterials`, `m_knownBiome` live in the player's local `.fch` file. **Not synced. Cannot be read.**

→ Model knowledge as **"what we've done together"** + opt-in slider.

🎚️ Second axis = bluntness: nudge → hint → directions → just tell me.

🗃️ Generate corpus from `ObjectDB` — items, recipes, station reqs, damage/resist. Authoritative, patch-current.

🧊 Deep North just shipped. Wikis are empty. ObjectDB is not.

⚠️ Strategy is **not** in ObjectDB. Needs ~20k tokens hand-written.

⚠️ Model doesn't know Deep North either. Don't let it improvise.

🛑 **Enforce spoilers mechanically, twice:**
1. Retrieval filter — out-of-horizon chunks never enter context
2. Output filter — scan against banned-entity list from current global keys

🚫 Never enforce via system prompt alone. It will leak.

---

## ⚠️ KNOWN PITFALLS

🎚️ **Skills start at zero.** Fresh character = weak damage, bad block, tiny stamina.
Phase 1 will look broken because bot can't run far.
Skills drop on death → spiral.
Dedicated servers don't validate `.fch` → **build the character pre-leveled.**
"Levels alongside you" is a later product choice, not a constraint.

🗺️ **Pathfinding only works in loaded zones.** Long-distance travel, water, cliffs, portals = separate project.

🩹 **Patch day breaks everything.** Keep Harmony surface tiny. Prefer public methods. Version-match host and client.

🔒 **ServerSync servers reject mismatched clients.** Alpha = vanilla server only. Plugin is client-side only.

🎒 **Bot death drops a tombstone with its gear.** Repeated deaths = total gear loss. Needs recovery logic by phase 2.

🌍 **MoveDir may be local-space** (z = forward relative to facing). Verify. If wrong direction, pass world vector directly.

⚡ **Jump may be level-triggered, not edge-triggered.** If it won't jump, hold the flag ~0.2s.

🔌 Plugin `Update()` runs **before** Valheim loads. Null-check `ZInput.instance`. Unity's raw `Input` is safe.

🚫 **Bot never spawns items. Never teleports.** One character file per world.

---

## 📦 OPEN SOURCE

🆓 Everything open. Self-host free. **Zero features held back.**

💳 Sell operations, not features: pooling, reconnects, region matching, hosted model + voice.

🚫 Crippled editions kill the goodwill that is the entire point.

🧩 Open the personality layer — prompts, quip packs, voice packs. Ecosystem > stars.

🏷️ **Rename.** Not "Valheim<X>". Trademark.

📧 **Talk to Iron Gate early**, while small and the story is clean.

---

## 🏆 LEADERBOARDS

🤖 **Rank bots, never players.** User is in on the joke, not the target.

🪦 Most creative death. Worst navigation. Best line of the week.

🚫 No kill counts, no hour counts. Rewards grinding, gets farmed.

✋ Curated + opt-in. Auto-ranked anything is gamed within a month.

---

## 🛑 DECIDED — DO NOT RELITIGATE

- Player emulator via `SetControls`. Not NPC. Not screen-reading.
- Reflection binding for the seam.
- Reflex/Tactical tiers are pure C#. LLM only in the Mind.
- Defensive is the default stance.
- Pings outrank chat as the command channel.
- Pre-leveled bot character.
- Licenses purchased per instance.
- Open source.

---

## ▶️ NEXT ACTION

Phase 0. Press the key. Read the log line that prints the real `SetControls` signature.

Everything else follows from whether those five moves land.

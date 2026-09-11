# Palheim

**Invite a Viking. Not a mod.**

Palheim is an AI companion that joins your Valheim world as a real multiplayer player. Your friends stay on vanilla clients — no BepInEx, no plugin roulette.

This repo hosts the waitlist landing page (static site).

## Product locks

- **Invite-as-player** — Palheim shows up as a multiplayer peer, not a client-side NPC prefab
- **Friends stay vanilla** — zero client mods required on their machines
- **No BepInEx product path** — we are not shipping “install a mod stack” as the product

## Site

Static waitlist landing page:

| File | Role |
|------|------|
| `index.html` | Page structure + copy |
| `styles.css` | Nordic dark aesthetic |
| `main.js` | Mobile nav + waitlist form stub |

### Sections

1. Hero
2. How it works
3. Why not another NPC mod
4. Roadmap
5. Waitlist form (stub)
6. FAQ

### Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

### Waitlist stub

The form validates email and stores submissions in `localStorage` under `palheim-waitlist`. No backend yet — wire invites when dogfood is solid.

## Status

Private dogfood · Valheim 1.0

Independent project. Not affiliated with Iron Gate Studio or Coffee Stain. Valheim is their game.

---

Built in the north. No client mods for your friends.

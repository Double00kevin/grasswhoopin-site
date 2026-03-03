# Grasswhoopin' Dev Cheat Sheet
**Project:** `KITT/projects/grasswhoopin-site` | Hosted on Cloudflare

---

## Daily Workflow

### See your changes locally (before pushing anything)
```bash
npm run dev
```
Then open: **http://localhost:4321**  
Hit `Ctrl+C` to stop the server.

---

### Check for errors before pushing
```bash
npm run build
```
Must complete with **zero errors**. If it errors, don't push — fix it first.

---

### Push changes to Cloudflare (live site)
```bash
git add -A && git commit -m "update" && git push
```
Cloudflare auto-deploys on push. Live in ~1-2 min.

---

## Full Sequence (start to finish)

| Step | Command | Purpose |
|------|---------|---------|
| 1 | `npm run dev` | Preview locally at localhost:4321 |
| 2 | `npm run build` | Verify zero build errors |
| 3 | `git add -A && git commit -m "update" && git push` | Push to Cloudflare |

---

## Other Useful Commands

| Command | What it does |
|---------|-------------|
| `npx astro check` | TypeScript/type error check |
| `npm run preview` | Preview the *built* version locally (after `npm run build`) |
| `git status` | See what files changed |
| `git log --oneline -5` | See last 5 commits |

---

## Notes
- **No pricing** on the site — by design, don't add it
- **Contact:** Text preferred over calls — 256-929-0532
- **Color tokens** are in `src/styles/global.css` (army, deere, screaming, camo, etc.)
- **Brand voice:** Lawns are "whooped," customers are "recruits," keep it Southern and loud
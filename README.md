# Attendance Ledger (PWA)

A self-contained timesheet, leave, and activity tracker — packaged as an
installable Progressive Web App. All data is stored locally in the
browser (`localStorage`), so there's no backend to host.

## Files

```
index.html          the app itself
manifest.json        PWA manifest (name, icons, theme color)
sw.js                 service worker (offline caching)
icons/                app icons generated from the company logo
README.md             this file
```

## Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to the root of the
   `main` branch (or a `docs/` folder — either works with Pages).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the `main` branch and the `/ (root)` folder (or `/docs` if you used
   that instead), then **Save**.
5. GitHub will publish the site at:
   `https://<your-username>.github.io/<repo-name>/`
   (First deploy can take a minute or two.)

That's it — no build step, no dependencies to install.

## Installing the app

Once the site is live over HTTPS (GitHub Pages does this automatically):

- **Desktop Chrome/Edge:** an install icon (⊕) appears in the address bar.
  Click it → **Install**.
- **Android Chrome:** open the site → menu (⋮) → **Add to Home screen** /
  **Install app**.
- **iOS Safari:** open the site → Share button → **Add to Home Screen**.

Once installed, the app opens in its own window (no browser chrome) and
keeps working offline after the first load, since the service worker
caches the app shell.

## Notes on the "project subpath" issue

GitHub Pages serves project sites at `/repo-name/`, not the domain root.
`manifest.json`'s `start_url` and `scope`, and `sw.js`'s registration, are
all written as **relative paths** (`./`), so this works correctly whether
the app lives at the root of a custom domain or under a GitHub Pages
subpath — no path edits needed either way.

## Updating the app later

If you edit `index.html` (or any cached file), bump `CACHE_VERSION` in
`sw.js` (e.g. `attendance-ledger-v1` → `attendance-ledger-v2`). This
forces the service worker to drop the old cache and fetch the new files,
so visitors don't get stuck on a stale cached copy.

## Data & privacy

Nothing is sent to any server. Timesheet data lives entirely in the
browser's `localStorage` on whichever device opens the app. Use the
**Save/Load Records** feature in the app to export/import a JSON backup
or sync across devices via a linked file (Chrome/Edge only).

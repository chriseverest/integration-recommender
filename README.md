# Integration Recommender (database browser)

Vite + React app that loads `integration-recommender-database.json` and presents filters, KPIs, a sortable table, and row-level detail.

## GitHub Pages (`gh-pages` branch)

GitHub Pages serves **static files** from the `gh-pages` branch, not the React source on `main`. After every successful build, publish the contents of **`dist/`** to that branch.

**Option A — CI (recommended)**  
Push to `main`. The workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs `npm ci`, `npm run build`, and updates the `gh-pages` branch with `dist/`.

**Option B — manual from your machine**

Use **`https://`** for `origin` (not `git@...`) so deploy can authenticate with **GitHub CLI**:

```bash
git remote set-url origin https://github.com/chriseverest/integration-recommender.git
gh auth login -h github.com
gh auth setup-git
npm run deploy
```

`npm run deploy` runs `vite build`, clears the gh-pages cache, then publishes `dist/`. If `origin` is an `https://github.com/...` URL, the deploy script passes a URL authenticated with **`gh auth token`**, so the push uses your **chriseverest** CLI session instead of SSH keys.

If you ever see `fatal: a branch named 'gh-pages' already exists`, run `npm run deploy` again — the script wipes the broken cache before publishing. You can also clear it manually: remove `node_modules/.cache/gh-pages` under this project.

**Repository settings**  
**Settings → Pages**: build source **Deploy from a branch**, branch **`gh-pages`**, folder **`/` (root)**.

The app uses `base: '/integration-recommender/'` in `vite.config.js`, so the site URL is:

`https://<user>.github.io/integration-recommender/`

## Local dev

```bash
npm install
npm run dev
```

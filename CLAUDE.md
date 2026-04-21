# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

There is **no build step, no bundler, and no test suite**. The empty `yarn.lock` is a stub — do not run `yarn install` or add a `package.json` expecting it to mean anything.

- Open [SRCafe.html](SRCafe.html) directly in a browser, or serve the directory statically (e.g. `python3 -m http.server`). React 18, ReactDOM, and `@babel/standalone` are loaded from unpkg via the `<script>` tags in the HTML.
- JSX files (`*.jsx`) are loaded with `type="text/babel"` and transpiled **in the browser at load time**. There is no pre-compile; save and refresh.
- Script load order in [SRCafe.html](SRCafe.html) is load-bearing: `data.js` and `details.js` must run before the JSX files because they define the `window.CAFES` / `window.CAFE_DETAILS` globals the components read from. Preserve that order when adding scripts.

## Architecture

Single-page app rendered into `#root` by [src/app.jsx](src/app.jsx). All inter-file communication happens through **window globals** and **loose top-level `const`s**, not imports — there is no module system.

- **Data layer** — [src/data.js](src/data.js) populates `window.CAFES` (the list view records). [src/details.js](src/details.js) populates `window.CAFE_DETAILS`, keyed by cafe `id`, with extended fields (gallery, menu, weeklyHours, busyHours, etc.) used only on the detail page. When you add a cafe, add matching entries to both or the detail page will fall back to partial data.
- **Components** — [src/components.jsx](src/components.jsx) defines the shared `Icon` map (inline SVGs) plus `DynamicIsland`, `Hero`, `CafeCard`, `ListRow`, `MapView`, `SplitView`, `Tweaks`. [src/detail.jsx](src/detail.jsx) defines `DetailPage`. Because these are concatenated globals, don't re-declare names across files. Note `detail.jsx` aliases its hooks (`useStateD`, `useEffectD`, `useMemoD`) to avoid colliding with the ones destructured in `components.jsx` / `app.jsx`.
- **App state** — `App` in [src/app.jsx](src/app.jsx) owns `search`, `filter`, `view`, `sort`, `saved`, `detailId`, and `tweaks`. Routing between the list and detail is just `detailId` state. `view`, `tweaks`, and `detailId` are persisted to `localStorage` under `srcafe-view`, `srcafe-tweaks`, `srcafe-detail`.
- **Theming** — Tweaks apply by setting `data-theme` and `--accent` on `document.documentElement`. All styling in [src/styles.css](src/styles.css), [src/motion.css](src/motion.css), [src/detail.css](src/detail.css) hangs off CSS custom properties defined under `:root` and `[data-theme="dark"]`; add new colors there rather than hard-coding hex values.
- **Scroll reveal** — elements with class `reveal` are observed by an `IntersectionObserver` in `App` that adds `.in` when they enter the viewport. The observer is re-run on `view`/`filter`/`search` changes, so any newly mounted element with `.reveal` will animate in automatically.

## Edit-mode / Tweaks protocol

The app is designed to be embeddable in a parent editor iframe. On mount, `App` posts `{type: '__edit_mode_available'}` to `window.parent` and listens for `__activate_edit_mode` / `__deactivate_edit_mode` messages to toggle the `Tweaks` panel.

The `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` comment markers in [SRCafe.html](SRCafe.html) (around `TWEAK_DEFAULTS`) and [src/app.jsx](src/app.jsx) (around the `tweaks` prop on `<Tweaks>`) are machine-parsed by the host editor — **keep them intact and on the same lines when editing those blocks**, and keep `TWEAK_DEFAULTS` in HTML in sync with the default-state shape in `useState(() => ... { accent, dark, live, density })`.

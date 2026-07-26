# CLAUDE.md — korchip-web

This file documents the codebase for AI assistants working on the **korchip-web** repository.

---

## Project Overview

**KORCHIP** is a static, single-page marketing website for a Korean energy storage company (founded 1990) that manufactures supercapacitors and LTO batteries. The site is bilingual (English / Korean) and requires no build step — files are served directly as static assets.

**Live products showcased:**
- **STARCAP Series** — Supercapacitors with 1,000,000+ cycle life
- **CHIPCELL LTO** — LTO batteries with 20,000+ cycle life

---

## Repository Structure

```
korchip-web/
├── index.html          # Entire page (single HTML file, 148 lines)
├── css/
│   └── style.css       # All styles (179 lines)
├── js/
│   └── main.js         # All JavaScript (39 lines)
├── logo.jpg            # Company logo (1053×213 px)
├── dcl.gif             # Product demo GIF (450×221)
├── dclt.gif            # Product demo GIF (177×157)
├── dcs.gif             # Product demo GIF (450×215)
├── dcsr.png            # Product image (244×118)
├── dms-rf.gif          # Demo image (177×87)
├── dms-rs.jpg          # Demo image (309×137)
└── sm.png              # Product image (137×67)
```

There are **no subdirectories for components, no package.json, no build tools, no test runner, and no CI/CD configuration.**

---

## Technology Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Markup     | HTML5 (semantic, single file)                   |
| Styling    | Vanilla CSS3 (single file, no preprocessor)     |
| Scripting  | Vanilla JavaScript ES6+ (single file)           |
| Font       | Google Fonts — Inter (weights 300–700, CDN)     |
| Build tool | **None** — open `index.html` directly           |
| Package mgr| **None** — no npm / yarn / pnpm                 |
| Framework  | **None** — no React, Vue, Angular, etc.         |

---

## Development Workflow

### Running the site locally

Open `index.html` in a browser — no server required for basic viewing. For development with live reload, use any static server:

```bash
# Python (no install needed)
python3 -m http.server 8080

# Node (if available)
npx serve .
```

### No build step, no compilation

All changes are edit-and-refresh. There is no:
- Transpilation
- Bundling
- Minification pipeline
- Dependency installation

---

## Bilingual System (EN / KO)

This is the most important convention in the codebase.

### How it works

1. **Default language is English.** Korean elements are hidden by default via CSS.
2. Elements with `data-lang="en"` are shown by default; `data-lang="ko"` elements are hidden.
3. When the user switches to Korean, `body.korean` is added and the CSS rules flip visibility.

```css
/* css/style.css */
[data-lang="ko"] { display: none; }              /* Korean hidden by default */
body.korean [data-lang="en"] { display: none; }  /* English hidden in KO mode */
body.korean [data-lang="ko"] { display: block; } /* Korean shown in KO mode */
```

4. `switchLang(lang)` in `js/main.js` adds/removes the `korean` class on `<body>`, updates `document.documentElement.lang`, and persists the choice to `localStorage` under the key `korchip-lang`.

### Bilingual authoring rule

**Every user-facing text element MUST have both an EN and a KO sibling.** Always add both when inserting new content:

```html
<p data-lang="en">English text here.</p>
<p data-lang="ko">한국어 텍스트.</p>
```

Navigation links follow the same pattern — each anchor appears twice, once per language.

---

## CSS Conventions

### Reset & base

Universal box-sizing reset. Body uses `font-family: 'Inter', sans-serif`, black background, white text.

### Layout

- `.section-full` — full-viewport-height section (`min-height: 100vh`) with flex centering. Used for all major content blocks.
- Utility classes are written inline on HTML elements using Tailwind-like naming (`flex`, `items-center`, `gap-2`, `text-center`, etc.) but **Tailwind is not installed** — these must be manually defined in `style.css` if new ones are needed, or written as inline styles.

### Scroll animations

- Elements start with `.fade-up` (opacity 0, translateY 30px).
- The Intersection Observer in `main.js` adds `.visible` when 10% of the element enters the viewport, triggering the CSS transition.
- Stagger delays: `.delay-100` (0.1s), `.delay-200` (0.2s), `.delay-300` (0.3s).

### Navigation

- `.nav-fixed` — fixed top bar, transparent by default.
- `.nav-scrolled` — applied by JS scroll listener when `pageYOffset > 100`; adds black background with `backdrop-filter: blur(20px)`.
- Nav links are hidden on mobile (`max-width: 768px` — `.nav-links { display: none }`). There is no mobile menu.

### Brand colors

| Token            | Value     | Usage                          |
|------------------|-----------|--------------------------------|
| `.korchip-red`   | `#E31837` | Accent color, product labels   |
| `.bg-korchip-red`| `#E31837` | Background variant             |
| Background       | `#000000` | Page base                      |
| Text primary     | `#ffffff` | Body text                      |
| Text secondary   | `#9ca3af` (gray-400) | Subtitles, descriptions |

### Glassmorphism / cards

`.product-card` uses `background: rgba(255,255,255,0.03)`, `border: 1px solid rgba(255,255,255,0.1)`, and `backdrop-filter: blur(10px)`.

### Decorative elements

- `.grid-pattern` — 50×50px grid overlay using CSS `background-image` with two orthogonal linear gradients at 3% white opacity.
- `.gradient-overlay` — top-to-bottom black gradient overlay for hero legibility.
- `.bg-tech` — radial gradient from `#0a0a1a` to `#000` used on the hero section.

---

## JavaScript Conventions

`js/main.js` has three responsibilities — keep them separate:

1. **Language switching** (`switchLang(lang)`) — modifies body class, `html.lang`, button active states, and localStorage.
2. **Scroll animations** — single `IntersectionObserver` watching all `.fade-up` elements, threshold `0.1`.
3. **Navbar scroll effect** — single `scroll` event listener on `window`, threshold `100px`.

No module system is used. All code is in global scope. Keep JS minimal and in `main.js`.

---

## HTML Structure (Page Sections)

| Section                  | ID / Selector              | Description                          |
|--------------------------|----------------------------|--------------------------------------|
| Navigation               | `#navbar` / `.nav-fixed`   | Fixed top bar with lang switcher     |
| Hero                     | `.section-full.bg-tech`    | Full-screen intro with grid pattern  |
| Products — STARCAP       | `#products`                | Supercapacitor showcase              |
| Products — CHIPCELL LTO  | _(no explicit id)_         | LTO battery showcase                 |
| Technical Specifications | `#specs`                   | Spec cards for both products         |
| Footer                   | `<footer>`                 | Copyright and branding               |

Note: `#technology`, `#company`, and `#contact` are referenced in nav links but **not implemented as sections** — they currently resolve to `#products` as a placeholder.

---

## Key Patterns to Follow

1. **No dependencies.** Do not introduce npm packages, CDN scripts (beyond the existing Google Fonts link), or build tools unless explicitly requested.
2. **Edit in place.** All CSS goes in `css/style.css`, all JS in `js/main.js`, all markup in `index.html`.
3. **Bilingual parity.** Never add English-only or Korean-only content. Always provide both `data-lang` variants.
4. **Preserve dark theme.** The site is exclusively dark. Do not introduce light backgrounds or light-mode toggles.
5. **Minimal JS.** This site has no framework. Keep JavaScript vanilla, imperative, and scoped to `main.js`.
6. **No mobile nav.** The navigation is intentionally hidden on mobile (`max-width: 768px`). Do not add a hamburger menu unless explicitly asked.

---

## Git Workflow

- **Main branch:** `master`
- **Remote:** `http://local_proxy@127.0.0.1:44408/git/elova9049/korchip-web`
- Feature branches follow the pattern `claude/<session-id>`
- Push with: `git push -u origin <branch-name>`

There are no pre-commit hooks, linters, or automated tests. Commits are straightforward.

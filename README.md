# Bluetrain Africa — website (bluetrain.africa)

React 18 + Vite + Tailwind CSS 3 + Framer Motion. Dark, editorial build on the Bluetrain Brand Guidelines V3 (2026).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in /dist — deploy to Vercel, Netlify, Cloudflare Pages, etc.
npm run build:single  # self-contained preview file: dist-single/bluetrain-africa.html
```

## File structure

```
├── index.html                  meta, favicon
├── tailwind.config.js          brand tokens: colours, type scale, keyframes
├── public/
│   ├── favicon.png             logomark on Bluetrain Blue (guidelines: icon for favicons only)
│   ├── brand/                  transparent white + colour logo lockups, white logomark
│   └── fonts/                  ← drop licensed ITC Avant Garde .woff2 files here
└── src/
    ├── main.jsx                fonts, MotionConfig (honours prefers-reduced-motion)
    ├── index.css               base styles, .glass / .glow-hover utilities, @font-face
    ├── App.jsx                 page order
    ├── content/site.js         shared config + English copy (edit here, not in components)
    ├── content/sw.js           Swahili copy — same shape as English
    ├── content/africaMap.js    generated Africa map paths (Natural Earth 1:50m)
    ├── lib/i18n.jsx            language provider: useLang() → { lang, setLang, t }
    ├── lib/theme.js            light/dark theme hook
    ├── lib/motion.js           spring presets
    └── components/
        ├── Navbar.jsx          1  floating glass header, active-section pill, mobile menu
        ├── Hero.jsx            2  kinetic headline + CTAs
        ├── SignalField.jsx        hero canvas: logomark arcs, pointer lean + 3D tilt
        ├── ClientTicker.jsx    3  About intro + monochrome client marquee
        ├── WhereWeWork.jsx        Tanzania, Kenya, South Africa, Zambia — map + list
        ├── Services.jsx        4  six-tile asymmetric bento
        ├── Work.jsx            5  filterable case studies
        ├── WorkArt.jsx            brand art panels until real photography exists
        ├── Testimonial.jsx     6  testimonial slider (falls back to featured statement)
        ├── Contact.jsx         7  3-step discovery form
        ├── Footer.jsx          8  columns, live Dar es Salaam time, legal
        └── ui/                 Button, Logo, Icons, Reveal
```

## Before launch — fill these in (`src/content/site.js`)

| What | Where |
|---|---|
| Booking link for "Book a Call" | `config.bookingUrl` |
| Form endpoint (Formspree, Basin, serverless fn). Empty = opens a pre-filled email to info@bluetrain.co.tz | `config.formEndpoint` |
| Social handles | `config.socials` |
| Budget bands / currency | `contact.steps[2].options` |
| Approved testimonials (slider appears automatically) | `testimonials` |
| Client logos (optional, monochrome SVG) — and confirm display permissions | `clients[].logo` |
| Campaign photography for case studies | `work.items[].image` → `/public/work/...` |
| Verified hero stat, if wanted | `hero.stat` |
| Privacy / Terms pages | `footer.legal` |

## Languages (English / Kiswahili)

- The EN | SW switch is in the header (and in the mobile menu). The choice is remembered; first-time
  visitors whose browser prefers Swahili get Swahili automatically.
- Every string lives in `content/site.js` (English) and `content/sw.js` (Swahili). Add or edit copy in both.
- Form answers are always sent to the team in English, with a `language` field showing which version the visitor used.
- The Swahili is a careful first translation — have a native-speaking copy editor review it before launch.

## Markets

The four countries are set in `config.countries` (`TZ`, `KE`, `ZA`, `ZM`) and appear in the hero, the
"Where we work" map section, and the footer. To add a country, add its code there, its name in both
language files, and its path in `africaMap.js`.

## Deploy (Cloudflare Workers + GitHub)

The site runs on the Cloudflare Worker `bluetrain-africa` (custom domains bluetrain.africa and www).
Cloudflare Workers Builds watches the GitHub repo: every push to `main` runs `npm run build` and
`npx wrangler deploy`, and the site updates in about a minute. Config: `wrangler.jsonc`.

- `dist/` is served as static files: one HTML file per page, `404.html`, `sitemap.xml`, `robots.txt`,
  `_redirects` (old Wix URLs → new pages, 301; edit in `scripts/postbuild.mjs`) and `_headers`.
- `worker/index.js` only handles `/auth` and `/callback`: GitHub sign-in for the editor.
- Worker secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (from the GitHub OAuth app whose callback
  URL is `https://bluetrain.africa/callback`). For local testing put them in `.dev.vars`.
- Local check of the whole thing: `npm run preview:worker` → http://localhost:8787

## Bluetrain Informed (blog) — the editor at /admin

Articles are Markdown files in `content/informed/<slug>.md`. The team edits them at
**bluetrain.africa/admin** (Sveltia CMS, config in `public/admin/config.yml`), signing in with GitHub.
Saving commits to `main`, which republishes the site. Editors need a GitHub account with write access
to the repo.

- `scripts/content.mjs` reads the files before every build, checks the fields (the build stops with a
  clear message if, say, a category is wrong), and generates `src/content/informed.posts.generated.js`.
- Front matter: title, standfirst, date, category, format, markets, author, author_role, cover_image,
  cover_alt, cover_art (1–12), takeaways, sw_title, sw_standfirst, sw_takeaways, sw_body, featured,
  read_time (blank = from word count), draft (true = not published). The Markdown below is the body.
- Body: `##` headings, paragraphs with bold/italic/links, bullet and numbered lists, `>` quotes (a last
  line starting with "—" is the attribution), and images on their own line (`![alt](src "caption")`).
- Uploaded images go to `public/images/informed/`.
- Categories, markets and formats are defined in `src/content/informed.js` and must match the editor's
  options in `public/admin/config.yml`.

## Pages

- `/` home · `/informed` blog index · `/informed/<slug>` article (real URLs on a web host; the single-file preview uses `#/informed…` because it runs from disk).
- Blog posts live in `content/informed/*.md`, edited at /admin (the 8 launch posts are drafts — review before promoting).
  Same shape can come from a CMS later.

## New sections

Results strip (`Results.jsx`), Clients wall (`ClientWall.jsx`, add approved logos in its `logos` map),
Informed teaser/index/post (`components/informed/`), cursor light + grain (`ui/Ambient.jsx`),
magnetic primary buttons (`ui/Button.jsx`), mobile action bar (`StickyCTA.jsx`), offices in `config.offices`.

## Fonts

ITC Avant Garde Gothic Pro (Medium, Demi, Bold) and Inter (variable) are self-hosted from `src/assets/fonts`
as Latin-subset woff2, converted from the supplied files. **Check the ITC licence covers web embedding** —
desktop licences usually don't.

## Brand rules baked in

- Full logo never below 150px wide; logomark only used as favicon.
- Logo files are the approved white / colour versions, never recoloured or stretched.
- Blue stays dominant: navy base, one full Bluetrain Blue band (statement section), amber used only for success and highlights.
- All motion respects `prefers-reduced-motion`; the hero canvas pauses when off-screen.

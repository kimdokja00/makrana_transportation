# Jammu Makrana Transport & Komal Minerals Supplier

MERN (MongoDB, Express, React, Node) website for a Makrana-based house of natural
stone and minerals, trading since 1985. Built to deploy on Vercel.

---

## ⚠️ Before this goes live

The site is visually complete, but three things are **placeholders** that must be
resolved. None of them block deployment; all of them block going public.

| # | What | Where | Why it matters |
| - | ---- | ----- | -------------- |
| 1 | **All photography** | `client/src/lib/assets.js` | Every image is still hot-linked from `melangestones.com` — another firm's server, bandwidth and stock. Replace with your own photos. |
| 2 | **Email address** | `SITE.email` in `client/src/data/siteContent.js` | Currently `info@example.com`. The contact page and mailto links are dead until this is real. |
| 3 | **Three counter figures** | `COUNTERS` in `client/src/data/siteContent.js` | "Years in Business" is derived from 1985 and is accurate. Consignments / stone varieties / states reached are invented placeholders — confirm or correct them. |

Already removed, because they could not be reused under any circumstances:
Melange Stones' logo, their favicons, their clients' logos (the "They Trusted us"
strip), their social profiles, and all customer testimonials — those were
attributed to named individuals and were never yours to publish.

To self-host images: put your photos in `client/public/assets/images/`, change
`ASSET_BASE` to `/assets/images`, and delete the warning comment in `assets.js`.

---

## Stack layout

```
├── api/                    Express application (runs as a Vercel Function)
│   ├── index.js            The Express app — exported, never .listen()'d
│   ├── dev-server.js       Local listener on :5000 for `npm run dev:api`
│   ├── lib/db.js           Cached Mongoose connection (serverless-safe)
│   ├── lib/env.js          Loads .env.local for local dev
│   ├── models/             Stone, Enquiry
│   ├── routes/             /stones, /enquiries
│   ├── data/stones.js      The 10 stones — seed source + API fallback
│   └── seed.js             `npm run seed`
├── client/                 React SPA (Vite)
│   ├── index.html
│   └── src/
│       ├── pages/          Home, About, StoneRange, StoneDetail,
│       │                   StoneProducts, Contact, NotFound
│       ├── components/     Header, Footer, BrandMark, PageHeader,
│       │                   StoneCard, Counter, SectionTitle, Icon,
│       │                   FloatingWidgets
│       ├── data/           Business identity + copy (siteContent.js)
│       ├── lib/            api client, asset URLs, page meta
│       └── styles/globals.css
├── vercel.json             Build settings, API + SPA rewrites
└── vite.config.js          root: client, build output: dist
```

One `package.json` at the root holds every dependency, so Vercel installs once.
Edit **`client/src/data/siteContent.js`** to change the business name, phone
numbers, addresses, GST number or page copy — every component reads from it.

## Local development

```bash
npm install
cp .env.example .env.local     # add your MONGODB_URI
npm run dev                    # API on :5000, Vite on :5173
```

Open **http://localhost:5173**.

**MongoDB is optional to get started.** With no `MONGODB_URI` the API serves the
bundled catalogue from `api/data/stones.js`, and if the API is unreachable the
React app falls back to `client/src/data/stonesFallback.js`. The site always
renders; wire up the database when you're ready. If Vite reports port 5173 in
use, it prints an alternate URL — use that.

Other scripts:

```bash
npm run dev:api     # Express only, with --watch
npm run dev:web     # Vite only
npm run build       # production SPA build into dist/
npm run preview     # serve the built SPA locally
npm run seed        # load the stone catalogue into MongoDB
```

## Database

| Model | Purpose |
| --- | --- |
| `Stone` | The stone range. `name`, `slug`, `tagline`, `category`, `image`, `description`, `origin`, `finishes[]`, `applications[]`, `order`, `featured`. |
| `Enquiry` | Contact-form submissions. `name`, `email`, `phone`, `subject`, `message`, `stoneOfInterest`, `status`. |

### Seeding

Put your connection string in `.env.local`, then:

```bash
npm run seed            # upsert all stones by slug
npm run seed -- --fresh # drop and re-insert instead
```

`GET /api/health` reports whether the database is connected.

## API

| Method | Endpoint | Notes |
| --- | --- | --- |
| `GET` | `/api/health` | Status + database connection state. |
| `GET` | `/api/stones` | Full range. Filters: `?category=Granite`, `?featured=true`. |
| `GET` | `/api/stones/:slug` | One stone. |
| `POST` | `/api/enquiries` | Contact form. Validates, returns `400` with a field map. |
| `GET` | `/api/enquiries` | Requires `ADMIN_TOKEN` set and sent as `x-admin-token`. |

Responses include `source` — either `mongodb` or `bundled` — so you can always
tell what answered.

## Deploying to Vercel

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Vercel → **Add New → Project** → import the repo.
3. Leave the framework preset as **Other** — `vercel.json` already sets the build
   command (`npm run build`), output directory (`dist`), and the rewrites that
   send `/api/*` to the Express function and everything else to `index.html`.
4. **Settings → Environment Variables**, for Production *and* Preview:
   - `MONGODB_URI` — your Atlas connection string
   - `ADMIN_TOKEN` — optional, to enable reading enquiries
5. **In MongoDB Atlas → Network Access, allow `0.0.0.0/0`.** Vercel's functions
   have no fixed IP, so a narrow allowlist will make the function hang and time
   out. This is the most common MERN-on-Vercel failure.
6. Deploy, then seed the deployed database from your machine with `npm run seed`.
7. Verify `https://<your-app>.vercel.app/api/health` → `{"status":"ok","database":"connected"}`.

For a custom domain, add it under **Settings → Domains** and point DNS at Vercel.

### Deploying to GitHub Pages

The live site is `https://<user>.github.io/makrana_transportation/`, published by
the **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`) on every
push to `main`. Pages → **Source** must stay set to **GitHub Actions**.

The workflow builds `dist/` with `VITE_BASE=/makrana_transportation/`, copies
`index.html` to `404.html`, and uploads the artifact at the site root. GitHub
Pages serves that `404.html` for unrecognised paths, so client-side deep links
such as `/makrana_transportation/stone-range/marble-manufacturer-in-india` mount
the SPA instead of a blank page.

Root hosting (Vercel, `npm run preview`, local dev) uses the default `/` base.
If you deploy the app under a different sub-path, set `VITE_BASE` to it — never
hard-code it in `vite.config.js`, or root deployments will request their assets
from a path that does not exist and fail with a MIME-type error.

## Notes

- Design tokens came from the template the original site used: primary `#9d9482`,
  Roboto, uppercase section taglines with `.1em` tracking, black/white surfaces.
  The stylesheet is written from scratch rather than copied, so it is yours to
  own and maintain.
- The logo is a text lockup (`BrandMark.jsx`) rather than an image. When you have
  a logo file, drop it in `client/public` and swap the component for an `<img>`.
- `SITE.socials` is empty, so all social blocks hide themselves. Add
  `{ label, href, icon }` entries to switch them on.
- Reworking the stone range? Edit `api/data/stones.js` (the seed source),
  `client/src/data/stonesFallback.js` (the offline mirror), **and** re-run
  `npm run seed` so the database matches.

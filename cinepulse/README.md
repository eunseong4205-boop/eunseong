# CINEPULSE

Korean box-office analytics dashboard built with **Next.js 16 App Router, TypeScript, Tailwind CSS 4 and Recharts**. Sites production uses the bundled **Vinext** Cloudflare Worker adapter; the standard Next.js commands below run the same application source.

## Run immediately

Node.js 22.13+ (Node 24 recommended), npm, and no API key required for the default demo.

```bash
npm ci
npm run dev:next
# http://localhost:3000
```

For the Sites-compatible local preview use `npm run dev` (port 5173). `npm run build` emits a Cloudflare Worker and client assets in `dist/`. Run `npm run build:next` for a standard Next.js production build, then `npx next start`.

## Features

- Daily / weekly TOP 10, audience, sales, separate audience/sales change rates, sample reservation rates.
- Title search, genre and date filters, refresh and five-minute polling, rising movies, loading / empty / failure states.
- `/movies/[id]`: 7 / 14 / 30-day audience and revenue projections, uncertainty bands, demo success probability, up to three competitors and an interactive range brush.
- Responsive Korean dark interface, reduced-motion support, semantic controls and keyboard access.
- Optional WebMCP dashboard-filter tool with validated arguments and lifecycle cleanup.

## Data provenance and forecasting limitations

The default is a **fictional rerelease scenario** using real movie titles. All figures and reservation rates are synthetic, fixed to a demo end date of 2026-09-12. Daily and weekly aggregates are calculated from the same deterministic daily series. Demo weekly means the seven days ending on the selected date. KOBIS weekly uses the API's Mon–Sun week (`weekGb=0`) and returns its official `showRange`.

`lib/cinema/forecast.ts` implements a deterministic **untrained demonstration baseline**, using recent seven-day averages, capped trends and a weekday factor. It is not an LLM or a trained, backtested AI model. Bands widen with horizon but do not have calibrated statistical coverage. The displayed probability is an uncalibrated score for **one million additional viewers during the selected horizon**, not profitability. Model output is visibly labeled as simulation, including when underlying observations are from KOBIS. Replace the forecast function / `ForecastProvider` contract in `lib/cinema/providers.ts` with a trained service when available; keep predictions, intervals and calibration metadata together.

## Connect KOBIS

Copy `.env.example` to `.env.local` for Next.js and set `KOBIS_API_KEY`. For hosted Sites set the same server secret in the Site environment. Do not use `NEXT_PUBLIC_` for credentials. Select **KOBIS 실적** in the dashboard.

- `lib/cinema/types.ts`: common domain model.
- `lib/cinema/mock.ts`: deterministic fixture source.
- `lib/cinema/kobis.ts`: official daily/weekly/detail adapters, server-only fetch, 12-second timeout, three-request concurrency limit, deduplicated requests and bounded five-minute memory cache.
- `lib/cinema/service.ts`: date/source validation and provider selection.
- `/api/boxoffice?source=mock&period=daily&date=2026-09-12&history=true`: application API. Live mode uses `source=kobis`.

Live history requests fetch the last 14 daily TOP 10 snapshots. A movie missing from a snapshot is **unknown, never zero**; only the contiguous trailing history is used and a minimum of seven days is required. This public API cannot recover full out-of-TOP-10 movie history. Cold live requests can make up to 25 upstream calls; caching is per Worker isolate, not a persistent historical database. Production-scale use should ingest historical series into shared storage.

KOBIS reports prior-day / completed-period attendance and can revise values after closing. Polling does **not** make it intraday live attendance. `audiChange` and `salesChange` are displayed as supplied by KOBIS; no custom week-over-week interpretation is asserted. The public Open API does **not** provide reservation rates. Live mode displays **미제공**; connect a separately authorized reservation-data provider before showing live rates. No real KOBIS credential or paid AI API is included or used by tests.

Official references: [API catalog](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do), [daily statistics notes](https://www.kobis.or.kr/kobis/business/stat/boxs/findDailyBoxOfficeList.do), [separate reservation statistics](https://www.kobis.or.kr/kobis/business/stat/boxs/findRealTicketList.do).

## Validation

```bash
npm run typecheck
npm test
npm run build:next
```

Tests verify day/week reconciliation, deterministic dates, horizon totals and bounds, insufficient history, invalid query rejection, key-free demo operation, and official-field normalization using an HTTP fixture. GitHub Actions runs these checks and the real Next.js build on main pushes and pull requests. Tests never call a paid API or use production secrets.

## Deployment

The `.openai/hosting.json` manifest belongs to this registered Site. Sites serves the app privately for its owner. Deployment is performed through the Sites connector after a successful Worker build. Source and build archives contain no API keys. When creating a separate Site, obtain a new manifest through Sites instead of reusing this project's identity.

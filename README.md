# Merchant Launch Integration Portal

A merchant operations and integration management platform inspired by gaming commerce workflows (e.g. Xsolla-style product launch tooling). Operations and integration teams use it to validate catalog SKUs, monitor launch readiness, review operational issues, and simulate webhook delivery before go-live.

> **Note:** This is a portfolio-grade operational portal. Webhook testing is **simulated** (no external HTTP calls). Authentication is **not implemented yet** by design, to keep the focus on catalog workflows, readiness logic, and integration visibility.

---

## Recruiter-friendly summary

Full-stack Next.js application with a production-style SaaS dashboard for merchant product launch operations. Includes Supabase-backed CRUD, a rule-based readiness engine, automated operational issue tracking, webhook simulation with persisted test history, and a real-time analytics dashboard—all built with TypeScript, server components, and a layered architecture suitable for team-scale extension.

**What you can evaluate quickly:** product management flows, server-side business logic, data modeling, UX for operational tooling, and honest scope boundaries (simulated webhooks, no auth yet).

---

## Business problem solved

Launching digital commerce products (virtual currency, battle passes, subscriptions, etc.) requires more than a product record. Teams must confirm:

- SKU and pricing metadata are complete
- Webhook endpoints are configured for purchase events
- Support contacts and regional settings are in place
- Launch blockers are visible before products go live

This portal centralizes those checks into a single operational workspace—reducing launch risk and giving integration teams a realistic pre-flight checklist.

---

## Core features

| Area | Capability |
|------|------------|
| **Dashboard** | Live KPIs: product counts, avg readiness, issue totals, webhook success rate, launch health buckets |
| **Product catalog** | Searchable/filterable product table with status, readiness, and pricing |
| **Product CRUD** | Create, read, and update products via Supabase (no delete yet) |
| **Readiness scoring** | Server-calculated score derived from operational rules |
| **Operational issues** | Auto-generated findings synced to `product_issues` on create/update |
| **Audit log** | Readiness findings with product context and severity |
| **Webhook simulator** | Local simulation of merchant callback events with payload preview |
| **Webhook history** | Persisted test runs with result, latency, and timestamps |
| **Product setup** | Webhook URL, support email, and integration metadata on detail pages |
| **Launch health** | Products grouped by readiness thresholds (ready / attention / blocked) |
| **UI** | Responsive dark SaaS dashboard with sidebar navigation |

---

## System architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (React 19 + shadcn/ui)                             │
│  Server Components + Client Components (forms, filters)     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Next.js App Router                                         │
│  • Server Components (pages, data fetching)                 │
│  • Server Actions (create/update product, webhook tests)    │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐  ┌────────────────┐  ┌──────────────────┐
│ lib/products  │  │ lib/dashboard- │  │ lib/webhook-*    │
│ lib/product-  │  │ analytics.ts   │  │ (simulator +     │
│ readiness.ts  │  │                │  │  test logs)      │
└───────┬───────┘  └────────┬───────┘  └────────┬─────────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            ▼
              ┌─────────────────────────┐
              │ Supabase (PostgreSQL)   │
              │ • products              │
              │ • product_issues        │
              │ • webhook_test_logs     │
              └─────────────────────────┘
```

**Design principles:**

- **Server-first data access** — Supabase reads/writes run on the server via `@supabase/ssr`
- **Thin pages, fat domain modules** — Business logic lives in `lib/`, not scattered in UI
- **Snake_case ↔ camelCase mapping** — Database rows mapped to typed frontend models
- **Simulated integrations** — Webhook delivery is modeled locally; no outbound payment or webhook HTTP

---

## Folder structure

```
merchant-launch-portal/
├── app/
│   ├── layout.tsx                 # Root layout, fonts, dark theme
│   ├── page.tsx                   # Redirects to /dashboard
│   └── (portal)/                  # Shared dashboard shell (route group)
│       ├── layout.tsx             # Sidebar + header wrapper
│       ├── dashboard/             # Operational analytics home
│       ├── products/              # Catalog, create, detail, edit
│       ├── webhook-tester/        # Simulated webhook testing
│       └── audit-log/             # Operational issue visibility
├── components/
│   ├── layout/                    # Sidebar, header, dashboard cards
│   ├── products/                  # Catalog table, forms, status badges
│   ├── webhook/                   # Tester panel + history table
│   └── ui/                        # shadcn/ui primitives
├── lib/
│   ├── supabase/                  # Browser + server Supabase clients
│   ├── products.ts                # Product CRUD + issue sync
│   ├── product-readiness.ts       # Readiness rule engine
│   ├── dashboard-analytics.ts     # Dashboard aggregation queries
│   ├── webhook-simulator.ts       # Local webhook simulation
│   ├── webhook-tests.ts           # Webhook test log persistence
│   ├── demo-products.ts           # Legacy demo data (reference)
│   └── navigation.ts              # Sidebar nav config
├── types/
│   ├── product.ts                 # Product domain types
│   └── webhook.ts                 # Webhook event/log types
└── .env.example                   # Environment variable template
```

---

## Tech stack

| Technology | Role | Why it was chosen |
|------------|------|-------------------|
| **Next.js (App Router)** | Framework, routing, SSR | Server components for secure data fetching; file-based routes; Netlify OpenNext deployment |
| **TypeScript** | Type safety | Shared domain types across UI, server actions, and data mappers |
| **Tailwind CSS v4** | Styling | Utility-first layout; fast iteration on dashboard UI |
| **shadcn/ui** | Component library | Accessible, customizable primitives (tables, forms, cards) without heavy abstraction |
| **Supabase** | Database + API | PostgreSQL with RLS-ready schema; fast prototyping for portfolio/production path |
| **Netlify** | Hosting | Zero-config Next.js deploys (OpenNext), preview URLs per branch |

**Supporting libraries:** `lucide-react` (icons), `@supabase/ssr` (cookie-aware server client), `class-variance-authority` + `tailwind-merge` (component variants).

---

## Key business logic systems

### 1. Product management (`lib/products.ts`)

- CRUD operations against the `products` table
- Validates form input server-side
- Maps camelCase form fields to snake_case DB columns
- Triggers readiness evaluation and issue sync on create/update

### 2. Readiness engine (`lib/product-readiness.ts`)

Rule-based evaluation that produces **issues** and a **readiness score** from the same input—keeping score and findings aligned.

### 3. Issue sync (`lib/products.ts`)

On product create/update:

1. Evaluate readiness rules
2. Persist product row with computed score
3. Replace related rows in `product_issues`

### 4. Webhook simulation (`lib/webhook-simulator.ts` + `lib/webhook-tests.ts`)

Generates realistic JSON payloads and deterministic success/failure outcomes, then logs results to `webhook_test_logs`.

### 5. Dashboard analytics (`lib/dashboard-analytics.ts`)

Centralized aggregation for KPIs, launch health buckets, recent issues, and recent webhook activity.

---

## Readiness engine

The readiness engine (`evaluateProductReadiness`) checks product setup and returns:

- A list of **operational issues** (message + severity: `low` | `medium` | `high`)
- A **readiness score** (0–100) derived from issue severities

**Example rules:**

| Condition | Severity |
|-----------|----------|
| Missing SKU | High |
| Missing region | Medium |
| Invalid/zero price | High |
| Missing webhook URL | Medium |
| Missing support email | Medium |
| Status is `draft` | Low |
| Live product without webhook | High |
| Live product with score &lt; 80 | High |

**Score calculation:**

- Start at **100**
- Deduct **25** per high issue, **15** per medium, **10** per low
- Floor at **0**

Scores are computed **on the server** during create/update so clients cannot spoof readiness.

---

## Webhook simulation

The webhook system models merchant callback testing **without sending real HTTP requests**.

**Supported event types:**

- `payment.completed`
- `payment.failed`
- `purchase.refunded`
- `item.delivered`
- `subscription.renewed`

**Simulation rules:**

| Condition | Result |
|-----------|--------|
| Product has no webhook URL | `failed` |
| Event type is `payment.failed` | `failed` |
| Otherwise | `success` |

Each run generates:

- A structured JSON payload (product, merchant, transaction metadata)
- A simulated latency (deterministic ms value)
- A response message
- A persisted row in `webhook_test_logs`

Products can deep-link to the tester: `/webhook-tester?productId=<id>`.

---

## Dashboard analytics

The dashboard (`lib/dashboard-analytics.ts`) pulls live operational data:

**Metrics**

- Total / live / draft product counts
- Average readiness score
- Total operational issues
- Webhook success rate (% of simulated tests)

**Launch health summary**

| Readiness | Classification |
|-----------|----------------|
| ≥ 90% | Launch-ready |
| 60–89% | Needs attention |
| &lt; 60% | Blocked / high risk |

**Activity panels**

- Recent operational issues (from `product_issues`)
- Recent webhook test runs (from `webhook_test_logs`)

---

## Screenshots

<!-- Add screenshots after deployment -->

| View | Description |
|------|-------------|
| `docs/screenshots/dashboard.png` | Operational dashboard with KPIs and launch health |
| `docs/screenshots/products.png` | Product catalog with readiness and filters |
| `docs/screenshots/product-detail.png` | Product detail with readiness, setup, and issues tabs |
| `docs/screenshots/webhook-tester.png` | Webhook simulator with payload preview and history |
| `docs/screenshots/audit-log.png` | Operational audit log |

---

## Live deployment

<!-- Replace with your Netlify URL after deploy (Site settings → Domain management) -->

**Production URL:** `https://your-site-name.netlify.app`

**Repository:** `https://github.com/a1ysF/merchant-launch-portal`

---

## Deploy to Netlify (from Vercel)

This app uses Next.js App Router, Server Components, and Server Actions. Netlify supports those via its built-in OpenNext adapter — you do **not** need a separate plugin in `package.json` unless you want to pin a version.

### 1. Turn off Vercel (optional)

In the [Vercel dashboard](https://vercel.com/dashboard), open your project → **Settings** → remove the Git integration or delete the project so you are not deploying twice.

### 2. Connect the repo on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in (GitHub is easiest if your code is on GitHub).
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** and authorize Netlify if prompted.
4. Select **`merchant-launch-portal`** (repo: `a1ysF/merchant-launch-portal`).

### 3. Confirm build settings

Netlify should auto-detect Next.js. Confirm these match `netlify.toml`:

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Publish directory | `.next` |
| Node version | 20 (set in UI or via `NODE_VERSION` in `netlify.toml`) |

If anything looks wrong, click **Show advanced** and set them manually.

### 4. Add environment variables

Before the first deploy finishes (or right after), open **Site configuration** → **Environment variables** and add:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same place (anon/public key) |

Use the same values as your local `.env.local`. Apply to **Production** (and **Deploy previews** if you want previews to talk to Supabase).

### 5. Deploy

Click **Deploy site**. The first build usually takes a few minutes. When it succeeds, Netlify gives you a URL like `https://random-name.netlify.app`.

- **Rename the site:** Site configuration → **General** → **Site details** → change site name.
- **Custom domain:** Domain management → add your domain and follow DNS instructions.

### 6. After deploy

- Open the production URL and check `/dashboard`, product pages, and webhook tester.
- Every `git push` to `main` triggers a new production deploy (default behavior).
- Pull requests can get **Deploy previews** if that option is enabled on the site.

### Local Netlify CLI (optional)

```bash
npm install -g netlify-cli
netlify login
netlify init    # link this folder to your Netlify site
netlify dev     # local dev with Netlify env
```

### Troubleshooting

| Problem | What to try |
|---------|-------------|
| Build fails on Netlify but works locally | Check build logs; ensure Node 20; run `npm run build` locally. |
| Blank data / Supabase errors | Confirm env vars on Netlify match `.env.local`; redeploy after adding vars. |
| Old Vercel URL still live | Remove or pause the Vercel project so traffic goes only to Netlify. |

---

## Installation and setup

### Prerequisites

- Node.js 20+
- npm
- Supabase project (free tier is sufficient)

### 1. Clone and install

```bash
git clone https://github.com/your-username/merchant-launch-portal.git
cd merchant-launch-portal
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in values from **Supabase → Project Settings → API**.

### 3. Database

Ensure these tables exist in Supabase:

- `products`
- `product_issues`
- `webhook_test_logs`

Enable RLS and configure policies for your current phase (see below).

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → redirects to `/dashboard`.

### 5. Build for production

```bash
npm run build
npm start
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) API key |

> Never commit `.env.local`. The anon key is safe for client exposure when RLS is configured correctly.

**Temporary RLS (pre-auth portfolio phase):** Anonymous `SELECT` / `INSERT` / `UPDATE` / `DELETE` policies may be enabled on `products`, `product_issues`, and `webhook_test_logs` for demo purposes. Tighten policies before production.

---

## Future improvements

- [ ] Authentication (Supabase Auth) and user-scoped RLS
- [ ] Product delete / archive workflow
- [ ] Real outbound webhook delivery (queued jobs + retry logic)
- [ ] Role-based access (ops, integration engineer, read-only)
- [ ] Chart visualizations for readiness trends over time
- [ ] Webhook signing / HMAC verification
- [ ] Multi-environment support (staging vs production merchants)
- [ ] Generated Supabase types (`database.types.ts`)
- [ ] E2E tests for critical launch flows

---

## Lessons learned and engineering decisions

1. **Server actions for mutations** — Keeps Supabase credentials off the client and centralizes validation.
2. **One readiness module** — Score and issues share the same rules, avoiding drift between UI and database.
3. **Simulated webhooks first** — Models integration workflows without network complexity or security risk in a portfolio context.
4. **Analytics aggregation layer** — `dashboard-analytics.ts` isolates query logic from presentation for easier testing and reuse.
5. **Route groups `(portal)`** — Shared dashboard shell without affecting URL structure.
6. **Honest scope** — No fake payment processor integrations; the value is operational realism and architecture clarity.

---

## Scalability considerations

| Layer | Current state | Scale path |
|-------|---------------|------------|
| **Data** | Single Supabase project, indexed tables | Read replicas, materialized views for analytics |
| **Auth** | Open anon policies (demo) | Supabase Auth + row-level tenant isolation |
| **Webhooks** | In-process simulation | Background workers (Edge Functions, queues) for real delivery + retries |
| **Analytics** | Client-side aggregation in server modules | Precomputed metrics table or scheduled rollups |
| **Frontend** | Server components + minimal client JS | Streaming, pagination, virtualized tables at scale |

The codebase separates **domain logic** (`lib/`) from **UI** (`components/`, `app/`), so services can move to API routes or microservices without rewriting business rules.

---

## Interview talking points

1. **Why a readiness engine instead of manual checklists?**  
   Automates repeatable launch gates and produces auditable issues tied to each SKU.

2. **Why simulate webhooks?**  
   Demonstrates integration workflow design without exposing a portfolio app to outbound network calls or merchant credentials.

3. **How is readiness score protected?**  
   Calculated server-side during create/update; not accepted from the client.

4. **How does issue sync work?**  
   Delete-and-reinsert pattern on `product_issues` keeps findings in sync with current product state.

5. **How would you add auth?**  
   Supabase Auth session in middleware, replace anon RLS with `auth.uid()` policies, optional org/merchant_id column on products.

6. **What would real webhook delivery look like?**  
   Queue job → signed POST to merchant URL → store response + retry with backoff → surface failures in audit log.

7. **Trade-offs you made?**  
   No delete/archive yet, no chart library, temporary open RLS—prioritized end-to-end operational flows over enterprise completeness.

---

## License

Private portfolio project. Update this section if you open-source the repository.

---

## Author

Built as a portfolio demonstration of merchant launch operations tooling inspired by gaming commerce platforms.

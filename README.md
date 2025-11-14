# Project Arabia 

> A tech-focused community for link aggregation and thoughtful discussion — inspired by Hacker News and Lobsters, but built for the modern web and the Arabic tech scene.

---

## Overview

**ProjectArabia** is a community platform centered around sharing and discussing links, projects, and ideas.
It’s designed for developers, founders, and builders who value depth, curiosity, and simplicity — not noise.

Users can:

* Submit tech-related articles, posts, or projects.
* Discuss and vote on links in real-time.
* Receive clean, non-spammy notifications when someone interacts with their post or comment.
* Explore trending discussions without algorithms getting in the way.

Think *old-school web communities*, but fast, edge-native, and thoughtfully minimal.

---

## Stack

* **Framework:** [TanStack Start](https://tanstack.com/start) — file-based routing + modern React SSR
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Email Service:** [Resend](https://resend.com) (used for notifications)

---

## Infrastructure

Runs entirely on the **Cloudflare Edge**:

* **Cloudflare Pages & Workers** – serving both frontend and API from the edge
* **Cloudflare Queues** – background email dispatch (no user-blocking or spam bursts)
* **Cloudflare KV** – fast cache for recent posts and sessions
* **Cloudflare D1 (SQLite)** – persistent relational storage

---

## Architecture Highlights

* **Serverless-first design:** No traditional backend servers — everything lives on Workers.
* **Real-time consistency:** KV for speed, D1 for truth.
* **Edge queueing:** Notifications are enqueued and processed asynchronously, respecting rate limits.
* **Predictable simplicity:** No complex abstractions, no hidden magic.

---

## Vision

ProjectArabia aims to become the home for **Arabic-speaking tech minds**,
where ideas spread fast but thoughtfully — without engagement farming or hype.

The mission is simple:

> Create a calm space where builders share what matters.

---

## Development

```bash
# clone the repo
git clone https://github.com/v0id-user/projectarabia.git
cd projectarabia

# install dependencies (bun recommended)
bun install

# start dev server
bun run dev
```

---

## Environment Variables

Below are the environment variables required to run ProjectArabia.  
Copy these into your `.env` file and set the appropriate values.

```env
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_D1_TOKEN=

RESEND_API_KEY=

SECRET_KEY=
SESSION_SECRET=
```

- **CLOUDFLARE_ACCOUNT_ID**: Your Cloudflare account ID.
- **CLOUDFLARE_D1_TOKEN**: API token for D1 database access.
- **RESEND_API_KEY**: Your Resend (email service provider) API key.
- **SECRET_KEY**: Used for encryption and signing.
- **SESSION_SECRET**: Session cookie secret.

All variables are required for a successful build and deployment.

---

## Deployment


### Account setup & Database setup

#### Production Setup

For production deployment, follow the [Drizzle ORM Cloudflare D1 documentation](https://orm.drizzle.team/docs/connect-cloudflare-d1) to set up your D1 database and configure the necessary environment variables.

You'll need to:
1. Create a D1 database in your Cloudflare dashboard
2. Set up your `wrangler.jsonc` with the D1 database configuration
3. Configure the required environment variables (see [Environment Variables](#environment-variables) section)

#### Local Development Setup

For local development, you need to configure the database path in `drizzle.config.ts`:

1. Start your dev server once: `bun run dev`
2. Navigate to `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/` directory
3. Find your database file (it will be a `.sqlite` file with a long hash name)
4. Copy the full path to that file
5. Update `drizzle.config.ts` and replace the `url` in the `dbCredentials` object with your database path

Example:
```typescript
dbCredentials: {
  url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/YOUR_DATABASE_FILE.sqlite",
}
```

#### Deploy to Production

To deploy to production:

```bash
# Set all environment variables from .env file to production environment
bun wrangler secret bulk .env --env production

# Build the project for production
bun run build

# Deploy to Cloudflare production environment
bun run deploy
```

---

## License & Credits

AGPL-3.0 License.
Built by [#V0ID](https://v0id.me) — powered by curiosity, caffeine, and the edge.

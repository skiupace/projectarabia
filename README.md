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

## License & Credits

AGPL-3.0 License.
Built by [#V0ID](https://v0id.me) — powered by curiosity, caffeine, and the edge.

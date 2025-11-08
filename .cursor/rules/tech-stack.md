# Tech Stack & Dependencies

## Core Technologies
- **Framework**: TanStack Start (file-based routing + modern React SSR)
- **Runtime**: Bun v1.1+ (STRICTLY use bun for all operations - no npm/yarn/pnpm)
- **Language**: TypeScript 5.9+ (strict mode enabled)
- **UI Library**: React 19.2
- **State Management**: Zustand 5.0
- **Forms**: TanStack Form 1.23+ (STRICTLY use this for all form handling)
- **Data Fetching**: TanStack Query 5.90+
- **Styling**: Tailwind CSS v4 + Vite plugin
- **Icons**: Lucide React

## Development Tools
- **Linter/Formatter**: Biome 2.3+ (NOT ESLint/Prettier)
- **Testing**: Vitest 3.0
- **Type Generation**: Wrangler types for Cloudflare

## Database & ORM
- **Primary Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM 0.44+
- **Migrations**: Drizzle Kit 0.31+
- **Database Name**: `arabia` (binding in wrangler.jsonc)

## Cloudflare Stack
- **Workers**: Serverless compute
- **D1**: Primary database
- **KV**: Session storage and caching (binding: `ARABIAN_KV`)
- **Queues**: Email dispatch system (queue name: `mailer`)
- **Pages**: Static asset serving
- **Turnstile**: Bot protection (SITE_KEY configured in vars)

## External Services
- **Email**: Resend API (key: `RESEND_API_KEY`)
- **Bot Protection**: Cloudflare Turnstile

## Key Dependencies
```json
{
  "@tanstack/react-start": "^1.132.0",
  "drizzle-orm": "^0.44.7",
  "zustand": "^5.0.8",
  "@tanstack/react-form": "^1.23.8",
  "@tanstack/react-query": "^5.90.5",
  "bcryptjs": "^3.0.2",
  "resend": "^6.4.0"
}
```

## Rules
- ALWAYS use bun commands (never npm/yarn/pnpm)
- NEVER add new dependencies without considering edge compatibility
- USE TanStack Form for ALL form handling - no exceptions
- USE Biome for linting/formatting - no ESLint or Prettier configs


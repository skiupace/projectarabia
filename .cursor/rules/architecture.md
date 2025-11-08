# Architecture & Patterns

## Core Principle: NO Raw API Endpoints
- Everything is Server-Side Rendered (SSR) via TanStack Start
- NO traditional REST/GraphQL/tRPC APIs
- Use `createServerFn` from `@tanstack/react-start` for ALL server operations
- Server functions live in `/src/actions/`

## Three-Layer Architecture

### Layer 1: Actions (`/src/actions/`)
**Purpose**: Entry point for client-server interactions
- Handle HTTP request/response use server functions with createServerFn
- Validate input using Zod schemas
- Call service layer
- Return structured responses

**Rules**:
- NEVER query database directly from actions
- NEVER contain business logic
- ALWAYS validate input at boundary
- ALWAYS use service layer for data operations

### Layer 2: Services (`/src/services/`)
**Purpose**: Business logic and orchestration
- Implement business rules
- Orchestrate multiple queries
- Handle complex operations
- Apply domain logic

**Rules**:
- Called ONLY by actions
- Can call multiple queries
- Should NOT contain raw SQL
- Focus on business logic, not data access

### Layer 3: Queries (`/src/db/queries/`)
**Purpose**: Pure database access
- Raw Drizzle ORM queries
- Single responsibility per query
- Reusable data access functions

**Rules**:
- STRICTLY database queries only
- NO business logic
- NO validation
- Return raw database results

## Data Flow Pattern
```
User Interaction → Component
    ↓
Action (createServerFn) - validates input
    ↓
Service - applies business logic
    ↓
Query - fetches/mutates data
    ↓
Response back up the chain
```

## Edge-First Architecture
- All code runs on Cloudflare Workers (V8 isolates)
- Global edge deployment
- No traditional servers
- Instant cold starts

## Serverless Patterns
- Use KV for fast reads (sessions, cache)
- Use D1 for persistent data (source of truth)
- Use Queues for async operations (emails)
- Leverage edge computing advantages

## State Management
- Server state: TanStack Query
- Client state: Zustand stores in `/src/stores/`
- Form state: TanStack Form
- Session state: Cookie-based via `/src/actions/-sessions/`

## Rules Summary
- NEVER bypass the three-layer architecture
- ALWAYS use appropriate layer for each concern
- KEEP layers decoupled and focused
- USE edge-native patterns (KV, D1, Queues)


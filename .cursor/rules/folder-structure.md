# Folder Structure & Responsibilities

## Project Root
```
projectarabia/
├── .cursor/rules/       # AI assistant rules (this folder)
├── dist/               # Build output (don't edit)
├── public/             # Static assets (images, favicon)
├── seed/               # Database seeding scripts
├── src/                # Source code (main work area)
├── worker/             # Cloudflare Worker entry point
└── wrangler.jsonc      # Cloudflare configuration
```

## `/src/actions/` - Server Functions
**Purpose**: All `createServerFn` implementations

**Structure**:
- `auth-submit.ts` - Authentication actions
- `post-submit.ts` - Post creation/editing
- `comment-submit.ts` - Comment operations
- `vote-submit.ts` - Voting logic
- `get-feed.ts` - Feed fetching
- `get-post.ts` - Single post fetching
- `get-comments.ts` - Comment fetching
- `get-user.ts` - User profile fetching
- `admin-mod.ts` - Admin/moderation actions
- `report.flagging.ts` - Report/flag handling
- `verify.ts` - Email verification

**Subdirectories**:
- `-mailer/` - Email queue system (prefix `-` indicates internal)
- `-sessions/` - Session management utilities

**Rules**:
- ONE action per file (keep focused)
- Name pattern: `{entity}-{verb}.ts` or `get-{entity}.ts`
- ALWAYS export default createServerFn
- ALWAYS validate input with Zod

## `/src/actions/-mailer/` - Email System
**Purpose**: Email queue and notification logic

**Files**:
- `helpers.ts` - Batching, recipient resolution, email fetching
- `queue.ts` - Queue management, cooldowns, email preparation

**Rules**:
- Prefix `-` indicates internal/private module
- ALL emails go through queue system
- NEVER send emails synchronously
- Respect cooldown periods

## `/src/actions/-sessions/` - Session Management
**Purpose**: Cookie-based session handling

**Files**:
- `useSession.ts` - Session hook and utilities

**Rules**:
- Use provided utilities - don't manage cookies manually
- Sessions stored in Cloudflare KV

## `/src/services/` - Business Logic
**Purpose**: Business logic layer between actions and queries

**Files**:
- `auth.ts` - Authentication logic
- `user.ts` - User management
- `posts.ts` - Post business logic
- `comments.ts` - Comment handling
- `votes.ts` - Voting logic
- `badges.ts` - Badge system
- `validation.ts` - Input validation helpers
- `verifications.ts` - Email verification
- `report.ts` - Report handling
- `cloudflare.ts` - Turnstile validation

**Rules**:
- Complex logic goes here, not in actions
- Can orchestrate multiple queries
- Focus on business rules
- Called ONLY by actions

## `/src/db/queries/` - Database Queries
**Purpose**: Pure Drizzle ORM queries

**Files**:
- `users.ts` - User queries
- `posts.ts` - Post queries
- `comments.ts` - Comment queries
- `votes.ts` - Vote queries
- `badges.ts` - Badge queries
- `verifications.ts` - Verification queries
- `users_status.ts` - User status queries
- `reports.ts` - Report queries

**Rules**:
- ONLY database access code
- NO business logic
- Return raw database results
- Keep queries reusable

## `/src/schemas/` - Validation Schemas
**Purpose**: Zod schemas for validation

**Subdirectories**:
- `auth/` - Authentication schemas
- `db/` - Database model schemas (11 files)
- `forms/` - Form validation schemas (3 files)
- `general/` - General-purpose schemas

**Rules**:
- Define ALL validation schemas here
- Use Zod for all validation
- Export typed schemas
- Keep DRY - reuse common patterns

## `/src/components/` - React Components
**Purpose**: UI components

**Structure**:
- `badge.tsx` - Badge component
- `board/` - Layout components (header, body, footer)
- `comment/` - Comment components (form, item, row, thread)
- `post/` - Post components (detail, form, row)
- `user/` - User components (detail)
- `login/` - Login components (form)

**Rules**:
- Group by feature/domain
- One component per file
- Use TanStack Form for all forms
- Call actions, never services/queries

## `/src/routes/` - TanStack Router Routes
**Purpose**: File-based routing

**Structure**:
- `__root.tsx` - Root layout
- `index.tsx` - Homepage
- Feature folders: `post/`, `comments/`, `user/`, etc.

**Rules**:
- File-based routing (filename = route)
- Use loaders for data fetching
- Keep route files thin
- Complex logic in components/actions

## `/src/stores/` - Zustand Stores
**Purpose**: Client-side state management

**Files**:
- `posts.ts` - Post state
- `comments.ts` - Comment state
- `comment-feeds.ts` - Comment feed state

**Rules**:
- Use for client-only state
- Keep stores focused
- Use TanStack Query for server state

## `/src/lib/` - Utilities
**Purpose**: Shared utilities

**Files**:
- `email/index.ts` - Email sending utilities
- `logger.ts` - Logging utilities
- `time.ts` - Time formatting helpers

## `/worker/index.ts` - Worker Entry
**Purpose**: Cloudflare Worker entry point

**Exports**:
- `fetch` - HTTP request handler
- `queue` - Queue message consumer

**Rules**:
- ONLY place for queue() export
- Handles email queue processing
- Don't add business logic here

## Naming Conventions
- **Files**: kebab-case (`post-submit.ts`)
- **Components**: PascalCase (`PostForm.tsx`)
- **Internal folders**: Prefix with `-` (`-mailer/`)
- **Routes**: Follow TanStack Router conventions


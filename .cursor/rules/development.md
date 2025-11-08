# Development Workflow & Commands

## Package Manager: Bun
**STRICTLY use Bun for all operations**

```bash
# ✅ Good
bun install
bun run dev
bun add package-name

# ❌ Bad - Never use
npm install
yarn add
pnpm install
```

## Common Commands

### Development
```bash
# Start dev server (http://localhost:3000)
bun run dev

# Generate TanStack Router routes
bun run generate-routes

# Watch routes (auto-regenerate on changes)
bun run watch-routes

# Generate Cloudflare types
bun run cf-typegen
```

### Code Quality
```bash
# Format code with Biome
bun run format

# Lint code with Biome
bun run lint

# Check for unused dependencies
bun run knip

# Run tests
bun run test
```

### Database
```bash
# Push schema changes to D1
bun run push-db

# Seed database
bun run seed

# Reset and seed database
bun run seed:reset
```

### Build & Deploy
```bash
# Build for production
bun run build

# Preview production build locally
bun run preview

# Full deployment (generate routes → build → deploy to Cloudflare)
bun run deploy

# Just preview (no deploy)
bun run preview
```

## Environment Setup

### Local Development
1. Clone repository
```bash
git clone https://github.com/v0id-user/projectarabia.git
cd projectarabia
```

2. Install dependencies
```bash
bun install
```

3. Configure environment
- Edit `wrangler.jsonc` for local vars
- Set up D1 database locally (if needed)
- Configure KV namespace

4. Generate types and routes
```bash
bun run cf-typegen
bun run generate-routes
```

5. Start dev server
```bash
bun run dev
```

### Configuration Files

#### `wrangler.jsonc` - Cloudflare Configuration
```jsonc
{
  "name": "projectarabia",
  "compatibility_date": "2025-09-02",
  "main": "worker/index.ts",
  
  // D1 Database
  "d1_databases": [{
    "binding": "arabia",
    "database_name": "arabia",
    "database_id": "..."
  }],
  
  // KV Storage
  "kv_namespaces": [{
    "binding": "ARABIAN_KV",
    "id": "..."
  }],
  
  // Environment Variables
  "vars": {
    "SITE_KEY": "...",
    "DOMAIN": "localhost:3000",
    "NODE_ENV": "development"
  }
}
```

#### `drizzle.config.ts` - Database Configuration
```typescript
export default {
  schema: "./src/schemas/db/*",
  out: "./drizzle",
  dialect: "sqlite",
  // ... D1 configuration
};
```

#### `vite.config.ts` - Build Configuration
```typescript
import { defineConfig } from "vite";
import { TanStackRouterPlugin } from "@tanstack/router-plugin";
import { cloudflareVitePlugin } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    TanStackRouterPlugin(),
    cloudflareVitePlugin(),
  ],
});
```

## Development Workflow

### Making Changes

#### 1. Adding a New Feature
```bash
# 1. Create route (if needed)
src/routes/new-feature/index.tsx

# 2. Create action
src/actions/feature-submit.ts

# 3. Create service
src/services/feature.ts

# 4. Create queries
src/db/queries/feature.ts

# 5. Create schemas
src/schemas/forms/feature.ts

# 6. Generate routes
bun run generate-routes

# 7. Test locally
bun run dev
```

#### 2. Updating Database Schema
```bash
# 1. Edit schema files
src/schemas/db/*.ts

# 2. Push to D1
bun run push-db

# 3. Update seed if needed
seed/*.ts
bun run seed:reset
```

#### 3. Adding Components
```bash
# 1. Create component
src/components/feature/component-name.tsx

# 2. Import in route
src/routes/feature/index.tsx

# 3. Format and lint
bun run format
bun run lint
```

### Hot Reload
- Vite HMR enabled for instant feedback
- Route generation watches file changes
- Worker reloads on action changes

### Debugging

#### Server-Side Logs
```typescript
// In actions/services
console.log("Debug info:", data);
console.error("Error occurred:", error);

// Appears in terminal running `bun run dev`
```

#### Client-Side Logs
```typescript
// In components
console.log("Component state:", state);

// Appears in browser console
```

#### TanStack Router DevTools
```typescript
// Enabled in development
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

<TanStackRouterDevtools />
```

#### TanStack Query DevTools
```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<ReactQueryDevtools />
```

## Testing

### Unit Tests (Vitest)
```bash
# Run all tests
bun run test

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

### Test Files
```
src/
  services/__tests__/
    auth.test.ts
    posts.test.ts
```

## Build Process

### Development Build
```bash
bun run dev
# - No minification
# - Source maps enabled
# - HMR enabled
# - Fast compilation
```

### Production Build
```bash
bun run build
# - Minification
# - Tree shaking
# - Code splitting
# - Optimized assets
# Output: dist/
```

### Preview Build
```bash
bun run preview
# - Builds production
# - Serves locally with Vite preview
# - Tests production behavior
```

## Deployment

### Automatic Deploy
```bash
bun run deploy
```

**Steps**:
1. Generates routes (`tsr generate`)
2. Builds project (`vite build`)
3. Deploys to Cloudflare (`wrangler deploy`)

### Manual Deploy
```bash
# Generate routes
bun run generate-routes

# Build
bun run build

# Deploy
wrangler deploy
```

### Environment Variables (Production)
- Set via Cloudflare Dashboard
- NOT in `wrangler.jsonc` vars (for local only)
- Required:
  - `SECRET_KEY` (Turnstile secret)
  - `RESEND_API_KEY` (Email API key)
  - `NODE_ENV=production`

## CI/CD Considerations
- Build command: `bun run generate-routes && bun run build`
- Test command: `bun run test`
- Deploy command: `wrangler deploy`
- Node version: Use Bun runtime

## Troubleshooting

### Routes Not Found
```bash
# Regenerate routes
bun run generate-routes
```

### Type Errors
```bash
# Regenerate Cloudflare types
bun run cf-typegen
```

### Database Errors
```bash
# Reset and reseed
bun run seed:reset
```

### Build Errors
```bash
# Clean build cache
rm -rf dist/
bun run build
```

### Dependency Issues
```bash
# Clean install
rm -rf node_modules bun.lock
bun install
```

## Performance Optimization

### Analyze Bundle
```bash
bun run build
# Check dist/client/assets/ sizes
```

### Code Splitting
- Automatic via Vite
- Route-based splitting by TanStack Router
- Lazy load components when possible

### Edge Caching
- Static assets cached at edge
- KV for session/cache data
- D1 for persistent data

## Rules Summary
- ALWAYS use bun (never npm/yarn/pnpm)
- GENERATE routes after route file changes
- RUN lint and format before committing
- TEST locally before deploying
- NEVER commit secrets to wrangler.jsonc
- USE DevTools for debugging
- CLEAN build when in doubt
- DEPLOY via `bun run deploy` command


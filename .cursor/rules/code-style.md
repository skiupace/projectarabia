# Code Style & Formatting

## Biome Configuration
**Source**: `biome.json`

### Formatting Rules
- **Indentation**: Spaces (NOT tabs)
- **Quote Style**: Double quotes (NOT single quotes)
- **Line Width**: Default Biome settings
- **Semicolons**: Always (TypeScript default)

### File Inclusion
- **Includes**: `**/*.ts`, `**/*.tsx`
- **Excludes**: `**/routeTree.gen.ts` (auto-generated)
- **VCS**: Git-aware, respects .gitignore

### Auto-Actions
- **Organize Imports**: Enabled on save
- **Format on Save**: Enabled

## TypeScript Style

### Imports
```typescript
// ✅ Good: Use @ alias for src imports
import { getUserById } from "@/services/user";
import { PostSchema } from "@/schemas/db/posts";

// ❌ Bad: Relative imports crossing directories
import { getUserById } from "../../services/user";
```

### Type Definitions
```typescript
// ✅ Good: Explicit types for function parameters
export async function createPost(data: PostInput): Promise<Post> {
  // ...
}

// ✅ Good: Use type imports when only importing types
import type { User } from "@/types";

// ✅ Good: Use const assertions for literals
const STATUS = {
  ACTIVE: "active",
  BANNED: "banned",
} as const;
```

### Function Style
```typescript
// ✅ Good: Arrow functions for simple operations
const formatDate = (date: Date) => format(date, "PPP");

// ✅ Good: Regular functions for exported APIs
export async function submitPost(data: PostInput) {
  // ...
}

// ✅ Good: Async/await over promises
async function fetchUser(id: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  return user;
}
```

## React Component Style

### Functional Components
```typescript
// ✅ Good: Named exports for components
export function PostForm({ postId }: { postId?: string }) {
  // ...
}

// ✅ Good: Type props inline or via interface
interface PostRowProps {
  post: Post;
  showAuthor?: boolean;
}

export function PostRow({ post, showAuthor = true }: PostRowProps) {
  // ...
}
```

### Hooks
```typescript
// ✅ Good: Custom hooks start with 'use'
export function useSession() {
  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: getSessionAction,
  });
  return data;
}
```

### TanStack Form Usage
```typescript
// ✅ Good: Always use TanStack Form
import { useForm } from "@tanstack/react-form";

export function PostForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
      await submitPostAction(value);
    },
  });

  return <form>...</form>;
}

// ❌ Bad: Plain HTML forms
<form onSubmit={handleSubmit}>...</form>
```

## Server Function Style

### Actions Pattern
```typescript
// ✅ Good: Standard action structure
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { someService } from "@/services/some-service";

const inputSchema = z.object({
  id: z.string(),
  data: z.string(),
});

export const someAction = createServerFn()
  .validator(inputSchema)
  .handler(async ({ data }) => {
    // 1. Get session if needed
    const session = await getSession();
    
    // 2. Additional validation
    if (!session) {
      throw new Error("Unauthorized");
    }
    
    // 3. Call service layer
    const result = await someService(data);
    
    // 4. Return structured response
    return { success: true, data: result };
  });
```

### Service Pattern
```typescript
// ✅ Good: Service orchestrates queries
export async function createPost(userId: string, data: PostInput) {
  // Business logic
  const slug = generateSlug(data.title);
  
  // Multiple query orchestration
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  
  const post = await insertPost({
    ...data,
    slug,
    authorId: userId,
  });
  
  await updateUserStats(userId);
  
  return post;
}
```

### Query Pattern
```typescript
// ✅ Good: Pure database query
export async function getPostById(id: string) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      author: true,
      votes: true,
    },
  });
}

// ❌ Bad: Business logic in query
export async function getPostById(id: string) {
  const post = await db.query.posts.findFirst({ ... });
  // Don't do validation here
  if (!post) throw new Error("Not found");
  return post;
}
```

## Error Handling

```typescript
// ✅ Good: Try-catch in actions
export const someAction = createServerFn()
  .handler(async ({ data }) => {
    try {
      const result = await someService(data);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error in someAction:", error);
      return { success: false, error: "Something went wrong" };
    }
  });

// ✅ Good: Specific error messages in services
export async function validateUser(id: string) {
  const user = await getUserById(id);
  if (!user) {
    throw new Error(`User not found: ${id}`);
  }
  if (user.status === "banned") {
    throw new Error("User is banned");
  }
  return user;
}
```

## Naming Conventions

### Files
- **Actions**: `{entity}-{verb}.ts` → `post-submit.ts`, `auth-submit.ts`
- **Components**: `{name}.tsx` → `post-form.tsx`, `comment-row.tsx`
- **Services**: `{domain}.ts` → `posts.ts`, `auth.ts`
- **Queries**: `{entity}.ts` → `users.ts`, `posts.ts`

### Variables
```typescript
// ✅ Good: Descriptive names
const userId = session.user.id;
const postData = await getPostById(postId);
const isAuthenticated = !!session;

// ❌ Bad: Abbreviated names
const uid = session.user.id;
const data = await getPostById(postId);
const auth = !!session;
```

### Constants
```typescript
// ✅ Good: UPPER_SNAKE_CASE for constants
const MAX_TITLE_LENGTH = 200;
const DEFAULT_PAGE_SIZE = 30;
const COOLDOWN_MINUTES = 5;
```

## Comments

```typescript
// ✅ Good: Comments explain WHY, not WHAT
// Cooldown prevents email spam during high activity
await setCooldown(key, COOLDOWN_MINUTES);

// ✅ Good: Document complex logic
// We batch notifications to the same recipient to avoid
// sending multiple emails for rapid-fire comments
const batched = batchNotificationMessages(messages);

// ❌ Bad: Comments that restate code
// Set cooldown
await setCooldown(key, COOLDOWN_MINUTES);
```

## Commands

### Formatting & Linting
```bash
# Format all code
bun run format

# Lint all code
bun run lint

# Both respect biome.json configuration
```

## Rules Summary
- USE Biome for all formatting/linting
- DOUBLE quotes, SPACES for indentation
- USE @ imports for src paths
- ORGANIZE imports automatically
- NAME files with kebab-case
- NAME components with PascalCase
- EXPORT functions explicitly
- HANDLE errors appropriately at each layer


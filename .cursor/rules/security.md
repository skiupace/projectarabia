# Security Best Practices

## Input Validation

### Always Validate at Action Boundary
```typescript
// ✅ Good: Validate with Zod schema
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url(),
  content: z.string().max(5000).optional(),
});

export const submitPost = createServerFn()
  .validator(inputSchema)
  .handler(async ({ data }) => {
    // data is now validated and typed
  });

// ❌ Bad: Trust client input
export const submitPost = createServerFn()
  .handler(async ({ data }: any) => {
    await createPost(data); // Unsafe!
  });
```

### Sanitize User Content
```typescript
// User-generated content should be sanitized
// Currently handled by React's automatic escaping
// For raw HTML (if ever needed), use a sanitization library
```

## Authentication & Authorization

### Session Management
```typescript
// ✅ Good: Check session in protected actions
import { getSession } from "@/actions/-sessions/useSession";

export const protectedAction = createServerFn()
  .handler(async ({ data }) => {
    const session = await getSession();
    
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    
    // Proceed with authenticated user
    const result = await someService(session.user.id, data);
    return result;
  });
```

### Authorization Checks
```typescript
// ✅ Good: Verify resource ownership
export const editPost = createServerFn()
  .handler(async ({ postId, data }) => {
    const session = await getSession();
    const post = await getPostById(postId);
    
    // Check ownership
    if (post.authorId !== session.user.id) {
      throw new Error("Forbidden");
    }
    
    // Check user status
    if (session.user.status === "banned") {
      throw new Error("Account banned");
    }
    
    await updatePost(postId, data);
  });
```

### Admin/Moderator Actions
```typescript
// ✅ Good: Check admin role
export const adminAction = createServerFn()
  .handler(async ({ data }) => {
    const session = await getSession();
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    
    if (session.user.role !== "admin" && session.user.role !== "moderator") {
      throw new Error("Insufficient permissions");
    }
    
    // Proceed with admin action
  });
```

## Bot Protection

### Turnstile Integration
```typescript
// ✅ Good: Validate Turnstile on public forms
import { validateTurnstile } from "@/services/cloudflare";

export const publicSubmitAction = createServerFn()
  .handler(async ({ data, turnstileToken }) => {
    // Validate Turnstile first
    const validation = await validateTurnstile(turnstileToken);
    
    if (!validation.success) {
      throw new Error("Bot protection failed");
    }
    
    // Proceed with action
  });
```

### Required on Forms
- Registration
- Login (after failed attempts)
- Post submission
- Comment submission
- Contact forms

## Rate Limiting

### Cloudflare KV for Rate Limiting
```typescript
// ✅ Good: Rate limit with KV
import { env } from "cloudflare:workers";

async function checkRateLimit(userId: string, action: string): Promise<boolean> {
  const key = `ratelimit:${userId}:${action}`;
  const existing = await env.ARABIAN_KV.get(key);
  
  if (existing) {
    const count = parseInt(existing);
    if (count >= MAX_REQUESTS) {
      return false; // Rate limited
    }
    await env.ARABIAN_KV.put(key, (count + 1).toString(), {
      expirationTtl: WINDOW_SECONDS,
    });
  } else {
    await env.ARABIAN_KV.put(key, "1", {
      expirationTtl: WINDOW_SECONDS,
    });
  }
  
  return true; // Allowed
}
```

### Rate Limit Targets
- **Post creation**: 5 per hour per user
- **Comment creation**: 20 per hour per user
- **Votes**: 100 per hour per user
- **Login attempts**: 5 per 15 minutes per IP
- **Password reset**: 3 per hour per email

## Password Security

### Hashing
```typescript
// ✅ Good: Use bcryptjs
import bcrypt from "bcryptjs";

// Hash password (cost factor 10)
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Password Requirements
```typescript
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number");
```

## Session Security

### Cookie Configuration
```typescript
// ✅ Good: Secure cookie settings
const sessionCookie = {
  httpOnly: true,        // Prevent XSS access
  secure: true,          // HTTPS only
  sameSite: "lax",       // CSRF protection
  maxAge: 30 * 24 * 60 * 60, // 30 days
};
```

### Session Storage
- **Primary**: Cloudflare KV (fast reads)
- **TTL**: 30 days
- **Key format**: `session:${sessionId}`

### Session Validation
```typescript
// ✅ Good: Validate session on every protected request
export async function getSession() {
  const sessionId = getCookie("session_id");
  
  if (!sessionId) return null;
  
  const session = await env.ARABIAN_KV.get(`session:${sessionId}`);
  
  if (!session) return null;
  
  return JSON.parse(session);
}
```

## SQL Injection Prevention

### Use Drizzle ORM
```typescript
// ✅ Good: Drizzle auto-escapes
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email)) // Parameterized
  .get();

// ❌ Bad: Raw SQL (avoid)
const user = await db.run(`SELECT * FROM users WHERE email = '${email}'`);
```

## XSS Prevention

### React Auto-Escaping
```typescript
// ✅ Good: React escapes by default
<div>{userContent}</div>

// ❌ Bad: dangerouslySetInnerHTML (avoid unless necessary)
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

### Content Security Policy
Consider adding CSP headers via Cloudflare Workers:
```typescript
response.headers.set(
  "Content-Security-Policy",
  "default-src 'self'; script-src 'self' 'unsafe-inline'"
);
```

## CSRF Protection

### SameSite Cookies
```typescript
// Enabled by default via session cookies
sameSite: "lax"
```

### Origin Validation
```typescript
// ✅ Good: Check origin on sensitive actions
const origin = request.headers.get("origin");
const expectedOrigin = env.DOMAIN;

if (origin !== expectedOrigin) {
  throw new Error("Invalid origin");
}
```

## Secrets Management

### Environment Variables
```typescript
// ✅ Good: Access via env binding
import { env } from "cloudflare:workers";

const secret = env.SECRET_KEY;
const apiKey = env.RESEND_API_KEY;

// ❌ Bad: Hardcode secrets
const secret = "abc123"; // Never do this!
```

### Wrangler Configuration
```jsonc
// wrangler.jsonc
{
  "vars": {
    // ✅ Good: Non-secret config only
    "SITE_KEY": "0x4AAAA...", // Public key OK
    "DOMAIN": "localhost:3000",
    "NODE_ENV": "development"
  }
  
  // ❌ Bad: Never put secrets here
  // "SECRET_KEY": "..." // Use Cloudflare Dashboard
  // "RESEND_API_KEY": "..." // Use Cloudflare Dashboard
}
```

### Production Secrets
Set via Cloudflare Dashboard:
```bash
# Via CLI (alternative)
wrangler secret put SECRET_KEY
wrangler secret put RESEND_API_KEY
```

## API Key Protection

### Never Expose to Client
```typescript
// ✅ Good: Server-side only
export const sendEmail = createServerFn()
  .handler(async () => {
    const apiKey = env.RESEND_API_KEY;
    await resend.send({ apiKey, ... });
  });

// ❌ Bad: Client-side exposure
export function sendEmailClient() {
  fetch("https://api.resend.com", {
    headers: { Authorization: API_KEY } // Never!
  });
}
```

## Error Messages

### Don't Leak Information
```typescript
// ✅ Good: Generic error messages
catch (error) {
  console.error("Login error:", error); // Log details server-side
  return { error: "Invalid credentials" }; // Generic to client
}

// ❌ Bad: Expose details
catch (error) {
  return { error: error.message }; // Might leak system info
}
```

## Content Moderation

### Report System
- Users can report posts/comments
- Stored in `reports` table
- Moderators review via admin panel

### Auto-Moderation (Future)
- Cloudflare AI for content filtering
- Rate limiting aggressive users
- Shadowban capability

## Email Security

### Queue-Based Sending
- Prevents email enumeration
- Rate limits built-in via cooldowns
- No direct user access to recipient emails

### Unsubscribe Links
- Include in all notification emails
- Store preferences in database
- Respect opt-outs

## Logging & Monitoring

### Security Events to Log
```typescript
// ✅ Good: Log security-relevant events
console.log(`Login attempt: ${email}`);
console.log(`Failed login: ${email}`);
console.log(`Admin action: ${action} by ${userId}`);
console.log(`Rate limit exceeded: ${userId}`);
console.warn(`Suspicious activity: ${details}`);
```

### Cloudflare Analytics
- Monitor traffic patterns
- Detect DDoS attempts
- Track error rates

## Rules Summary
- ALWAYS validate input with Zod at action boundary
- ALWAYS check session for protected actions
- ALWAYS verify resource ownership before mutations
- USE Turnstile on public submission forms
- RATE LIMIT sensitive operations via KV
- HASH passwords with bcryptjs (cost 10+)
- USE secure, httpOnly cookies for sessions
- NEVER expose secrets to client
- USE Drizzle ORM (prevents SQL injection)
- TRUST React for XSS prevention (avoid dangerouslySetInnerHTML)
- LOG security events for monitoring
- NEVER commit secrets to Git
- USE Cloudflare Dashboard for production secrets
- SANITIZE errors before sending to client


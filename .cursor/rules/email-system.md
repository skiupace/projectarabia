# Email Queue System

## Architecture Overview
ProjectArabia uses Cloudflare Queues for asynchronous, batched email delivery. This prevents blocking user operations and respects rate limits.

## Queue Configuration
**Source**: `wrangler.jsonc`

```jsonc
{
  "queues": {
    "producers": [{
      "queue": "mailer",
      "binding": "MAILER"  // Accessible in actions
    }],
    "consumers": [{
      "queue": "mailer",
      "max_batch_size": 100,     // Max messages per batch
      "max_batch_timeout": 5      // Seconds before forcing batch
    }]
  }
}
```

## Flow Diagram
```
User Action (comment/post)
    ↓
Action enqueues message → MAILER queue (producer)
    ↓ (batched by Cloudflare)
worker/index.ts queue() handler (consumer)
    ↓
Batch messages by recipient + target
    ↓
Check cooldown (KV lookup)
    ↓
Prepare email via Resend
    ↓
Send batch (single API call for multiple emails)
    ↓
Set cooldown (KV write)
```

## Components

### 1. Actions - Message Producers
Actions enqueue notification messages to the queue.

**Example** (from `comment-submit.ts`):
```typescript
import { env } from "cloudflare:workers";

// Enqueue notification
await env.MAILER.send({
  notificationType: "post_comment",
  targetId: postId,
  recipientId: post.authorId,
  actorId: userId,
  actorUsername: user.username,
  timestamp: new Date().toISOString(),
});
```

**Message Types**:
- `post_comment` - Someone commented on a post
- `comment_reply` - Someone replied to a comment

### 2. Helpers (`-mailer/helpers.ts`)
**Functions**:
- `batchNotificationMessages()` - Groups messages by recipient + target
- `getPostOwnerEmail()` - Fetches post author email
- `getCommentOwnerEmail()` - Fetches comment author email

**Batching Logic**:
```typescript
// Groups by: recipientId + notificationType + targetId
// Example: All comments on the same post for same user → one email
const key = `${recipientId}:${notificationType}:${targetId}`;
```

### 3. Queue Manager (`-mailer/queue.ts`)
**Functions**:
- `prepareNotificationEmail()` - Creates email payload
- `setCooldown()` - Sets cooldown key in KV
- `checkCooldown()` - Checks if cooldown active

**Cooldown Keys**:
```typescript
// Pattern: recipient_id:notification_type:target_id
const cooldownKey = `${recipientId}:post_comment:${postId}`;

// Stored in Cloudflare KV
// TTL: 5 minutes (300 seconds)
```

### 4. Worker Consumer (`worker/index.ts`)
**queue() Export**:
```typescript
export default {
  async queue(
    batch: MessageBatch<QueueNotificationMessage>,
    _env: Env,
    _ctx: ExecutionContext,
  ) {
    // 1. Extract messages
    const messages = batch.messages.map(msg => msg.body);
    
    // 2. Batch by recipient + target
    const batched = batchNotificationMessages(messages);
    
    // 3. Prepare emails (check cooldowns)
    const emailsToSend = [];
    for (const [key, msgs] of batched.entries()) {
      const prepared = await prepareNotificationEmail(...);
      if (prepared) emailsToSend.push(prepared);
    }
    
    // 4. Send batch via Resend
    await sendBatchEmails(emailPayloads, env.RESEND_API_KEY);
    
    // 5. Set cooldowns
    await Promise.all(
      emailsToSend.map(item => setCooldown(item.cooldownKey))
    );
  }
}
```

## Email Service (`lib/email/index.ts`)
**Functions**:
- `sendBatchEmails()` - Calls Resend batch API
- Handles Resend API errors
- Logs email status

## Cooldown System

### Purpose
Prevents email spam when multiple comments/replies happen quickly.

### Mechanism
- **Key**: `recipientId:notificationType:targetId`
- **Storage**: Cloudflare KV
- **TTL**: 5 minutes (300 seconds)
- **Check**: Before preparing email
- **Set**: After successfully sending email

### Example
```
User A posts something
User B comments at 10:00 AM → Email sent, cooldown set
User C comments at 10:02 AM → Cooldown active, no email
User D comments at 10:06 AM → Cooldown expired, email sent
```

## Notification Types

### post_comment
**Trigger**: Someone comments on a post
**Recipient**: Post author
**Email Content**: "X people commented on your post"

### comment_reply
**Trigger**: Someone replies to a comment
**Recipient**: Comment author
**Email Content**: "X people replied to your comment"

## Batching Strategy

### Cloudflare Queue Batching
- Collects up to 100 messages
- Waits max 5 seconds
- Whichever comes first triggers batch

### Application-Level Batching
- Groups messages by recipient + target
- Sends ONE email per group
- Includes count of actors

**Example**:
```
Queue receives:
- User B commented on Post 123
- User C commented on Post 123
- User D commented on Post 123

Application batches → One email to Post 123 author:
"3 people commented on your post"
```

## Error Handling

### Graceful Degradation
```typescript
try {
  await sendBatchEmails(emails, apiKey);
  await setCooldowns();
} catch (error) {
  console.error("Error sending batch:", error);
  // Continue processing other batches
}
```

### Retry Logic
- Cloudflare Queues handles automatic retries
- Failed messages re-enqueued
- Max retry attempts configurable

## Development Testing

### Local Queue Simulation
Queues don't run in local dev. For testing:

1. Mock queue sending:
```typescript
if (env.NODE_ENV === "development") {
  console.log("Would enqueue:", message);
  return;
}
await env.MAILER.send(message);
```

2. Test queue handler directly:
```typescript
// Create mock batch
const batch = {
  messages: [
    { body: { notificationType: "post_comment", ... } }
  ]
};
await queueHandler(batch, env, ctx);
```

## Rules Summary
- ALWAYS enqueue emails (never send synchronously)
- USE cooldowns to prevent spam
- BATCH messages efficiently
- HANDLE errors gracefully (don't block other emails)
- LOG all queue operations for debugging
- TEST queue logic separately from actions
- RESPECT rate limits (Resend: 10 emails/second)
- NEVER expose recipient emails to actors
- VALIDATE message schema before enqueuing
- MONITOR queue depth and processing time


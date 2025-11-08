import { createServerFn } from "@tanstack/react-start";
import {
  getHotPosts,
  getNewestPosts,
  getPostsByTitlePrefix,
  getPastMonths,
  getPostsByMonth,
} from "@/services/posts";
import type { PostWithUsername } from "@/types/posts";
import { env } from "cloudflare:workers";
import type { PostWithOrder } from "@/thealgorithm/ranking";
import { useAppSession } from "./-sessions/useSession";
import { z } from "zod";
import { logger } from "@/lib/logger";

const CACHE_KEY = "babel:feed:latest";
const CACHE_TTL_SECONDS = 300; // 5 minutes

const HOT_POSTS_DAYS = 7;
const MAX_POSTS = 50;

const cursorInputSchema = z.object({
  cursor: z.string().optional(),
});

const pageInputSchema = z.object({
  page: z.number().optional().default(1),
});

const monthInputSchema = z.object({
  month: z.string(),
  cursor: z.string().optional(),
});

async function fetchRankedFeed(
  page: number = 1,
): Promise<{ posts: PostWithOrder[]; hasMore: boolean; totalPosts: number }> {
  const session = await useAppSession();
  const userId = session.data.userId;

  // Try to fetch from cache (full ranked list)
  const cached = await env.ARABIAN_KV.get(CACHE_KEY);
  let allRankedPosts: PostWithOrder[] | null = null;

  if (cached) {
    try {
      allRankedPosts = JSON.parse(cached) as PostWithOrder[];
    } catch (_error) {
      // Invalidate corrupted cache
      await env.ARABIAN_KV.delete(CACHE_KEY);
      logger.error("fetchRankedFeed", {
        tag: "fetchRankedFeed",
        action: "cache_corrupted",
        userId,
      });
    }
  }

  // Cache MISS - Fetch and rank all hot posts
  if (!allRankedPosts) {
    const result = await getHotPosts(userId, MAX_POSTS, HOT_POSTS_DAYS, page);

    // For page 1, cache the full result
    if (page === 1) {
      // Re-fetch all posts to cache the complete ranked list
      const allPosts = await getHotPosts(userId, 500, HOT_POSTS_DAYS, 1);

      // Cache the full ranked list
      await env.ARABIAN_KV.put(CACHE_KEY, JSON.stringify(allPosts.posts), {
        expirationTtl: CACHE_TTL_SECONDS,
      });

      allRankedPosts = allPosts.posts;
    } else {
      return result;
    }
  }

  // Slice cached results for requested page
  const offset = (page - 1) * MAX_POSTS;
  const posts = allRankedPosts.slice(offset, offset + MAX_POSTS);
  const hasMore = allRankedPosts.length > offset + MAX_POSTS;

  return { posts, hasMore, totalPosts: allRankedPosts.length };
}

async function fetchNewestPosts(
  cursor?: string,
): Promise<{ posts: PostWithUsername[]; hasMore: boolean }> {
  const session = await useAppSession();
  const userId = session.data.userId;
  const result = await getNewestPosts(userId, MAX_POSTS, 60, cursor); // 60 days
  return result;
}

export const rankedFeedFn = createServerFn({ method: "GET" })
  .inputValidator(pageInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    logger.debug("rankedFeedFn", {
      tag: "rankedFeedFn",
      userId: session.data.userId,
      page: data.page,
    });
    const result = await fetchRankedFeed(data.page);
    logger.debug("rankedFeedFn", {
      tag: "rankedFeedFn",
      action: "success",
      userId: session.data.userId,
      page: data.page,
      count: result.posts.length,
      hasMore: result.hasMore,
    });
    return result;
  });

export const getNewestPostsFn = createServerFn({ method: "GET" })
  .inputValidator(cursorInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    logger.debug("getNewestPostsFn", {
      tag: "getNewestPostsFn",
      userId: session.data.userId,
      cursor: data.cursor,
    });
    const result = await fetchNewestPosts(data.cursor);
    logger.debug("getNewestPostsFn", {
      tag: "getNewestPostsFn",
      action: "success",
      userId: session.data.userId,
      count: result.posts.length,
      hasMore: result.hasMore,
    });
    return result;
  });

async function fetchAskPosts(
  cursor?: string,
): Promise<{ posts: PostWithUsername[]; hasMore: boolean }> {
  const session = await useAppSession();
  const userId = session.data.userId;
  const result = await getPostsByTitlePrefix(
    "اسال بابل: ",
    userId,
    50,
    60,
    cursor,
  );
  return result;
}

async function fetchSharePosts(
  cursor?: string,
): Promise<{ posts: PostWithUsername[]; hasMore: boolean }> {
  const session = await useAppSession();
  const userId = session.data.userId;
  const result = await getPostsByTitlePrefix(
    "شارك بابل: ",
    userId,
    50,
    60,
    cursor,
  );
  return result;
}

export const getAskPostsFn = createServerFn({ method: "GET" })
  .inputValidator(cursorInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    logger.debug("getAskPostsFn", {
      tag: "getAskPostsFn",
      userId: session.data.userId,
      cursor: data.cursor,
    });
    const result = await fetchAskPosts(data.cursor);
    logger.debug("getAskPostsFn", {
      tag: "getAskPostsFn",
      action: "success",
      userId: session.data.userId,
      count: result.posts.length,
      hasMore: result.hasMore,
    });
    return result;
  });

export const getSharePostsFn = createServerFn({ method: "GET" })
  .inputValidator(cursorInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    logger.debug("getSharePostsFn", {
      tag: "getSharePostsFn",
      userId: session.data.userId,
      cursor: data.cursor,
    });
    const result = await fetchSharePosts(data.cursor);
    logger.debug("getSharePostsFn", {
      tag: "getSharePostsFn",
      action: "success",
      userId: session.data.userId,
      count: result.posts.length,
      hasMore: result.hasMore,
    });
    return result;
  });

export const getPastMonthsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    logger.debug("getPastMonthsFn", {
      tag: "getPastMonthsFn",
    });
    const result = await getPastMonths();
    logger.debug("getPastMonthsFn", {
      tag: "getPastMonthsFn",
      action: "success",
      count: result.months.length,
    });
    return result;
  },
);

export const getPostsByMonthFn = createServerFn({ method: "GET" })
  .inputValidator(monthInputSchema)
  .handler(async ({ data }) => {
    const session = await useAppSession();
    const userId = session.data.userId;
    logger.debug("getPostsByMonthFn", {
      tag: "getPostsByMonthFn",
      userId,
      month: data.month,
      cursor: data.cursor,
    });
    const result = await getPostsByMonth(data.month, userId, 50, data.cursor);
    logger.debug("getPostsByMonthFn", {
      tag: "getPostsByMonthFn",
      action: "success",
      userId,
      month: data.month,
      count: result.posts.length,
      hasMore: result.hasMore,
    });
    return result;
  });
